import json
import time
from collections import Counter

import numpy as np
import torch
from sklearn.preprocessing import StandardScaler

from question_engine import next_best_question, update_dataset
from model import DiseasePredictor
from risk_factors import apply_risk_factor_weights


def load_model(input_size):
	with open("symptom_index.json") as f:
		symptom_index = json.load(f)

	with open("disease_labels.json") as f:
		disease_labels = json.load(f)

	model = DiseasePredictor(input_size, len(disease_labels))
	model.load_state_dict(torch.load("disease_model.pt", map_location="cpu"))
	model.eval()

	return model, symptom_index, disease_labels


def add_embedding_features(X, embeddings):
	embedding_features = []

	for row in X:
		active = np.where(row == 1)[0]

		if len(active) == 0:
			embedding_features.append(np.zeros(embeddings.shape[1]))
		else:
			emb = embeddings[active].mean(axis=0)
			embedding_features.append(emb)

	embedding_features = np.array(embedding_features)

	return np.concatenate([X, embedding_features], axis=1)


def build_symptom_vector(symptoms, symptom_names, symptom_index):
	vector = np.zeros(len(symptom_names))
	symptom_set = set(symptom_index.keys())

	for s in symptoms:
		if s in symptom_set:
			idx = symptom_names.index(s)
			vector[idx] = 1

	return vector



def explain_prediction(model, base_vector, symptom_names):
	weights = model.network[0].weight.detach().numpy()
	symptom_count = len(symptom_names)
	weights = weights[:, :symptom_count]

	symptom_values = base_vector[0]

	importance = np.abs(weights).mean(axis=0) * symptom_values
	top_features = np.argsort(importance)[-5:]

	explanations = []

	for idx in top_features:
		if symptom_values[idx] == 1:
			explanations.append(symptom_names[idx])

	return explanations[:3]


def predict_diseases(model, symptom_vector, disease_labels, symptom_names, base_vector, patient):
	with torch.no_grad():
		outputs = model(symptom_vector)
		probs = torch.softmax(outputs, dim=1)

	probs = probs.cpu().numpy()[0]
	probs = apply_risk_factor_weights(probs, disease_labels, patient)

	top_indices = np.argsort(probs)[-5:][::-1]

	explanations = explain_prediction(model, base_vector, symptom_names)

	results = []

	for idx in top_indices:
		results.append({
			"disease": disease_labels[idx],
			"probability": float(probs[idx]),
			"explanation": explanations
		})

	return results


def bayesian_update(predictions, remaining_labels):
	disease_counts = Counter(remaining_labels)

	total = sum(disease_counts.values())

	priors = {d: c / total for d, c in disease_counts.items()}

	updated = []

	for p in predictions:
		disease = p["disease"]
		prior = priors.get(disease, 1e-6)
		posterior = p["probability"] * prior
		updated.append({
			"disease": disease,
			"probability": posterior,
			"explanation": p["explanation"]
		})

	norm = sum(d["probability"] for d in updated)

	for d in updated:
		d["probability"] /= norm

	updated.sort(key=lambda x: x["probability"], reverse=True)

	return updated


def run_diagnosis(X, y, symptom_names, patient=None):
	embeddings = np.load("symptom_embeddings.npy")
	augmented_X = add_embedding_features(X, embeddings)

	model, symptom_index, disease_labels = load_model(augmented_X.shape[1])

	scaler = StandardScaler()
	scaler.fit(augmented_X)

	asked = set()
	user_symptoms = []

	start_total = time.time()

	for step in range(6):
		if len(X) < 200:
			break

		iter_start = time.time()
		entropy_start = time.time()
		question, idx = next_best_question(X, y, symptom_names, asked)
		entropy_end = time.time()

		print("\nDo you have:", question)

		answer = input("yes/no: ").strip().lower()
		answer = 1 if answer in ["yes", "y"] else 0

		if answer == 1:
			user_symptoms.append(question)

		filter_start = time.time()
		X, y = update_dataset(X, y, idx, answer)
		filter_end = time.time()
		asked.add(idx)

		print("Remaining cases:", len(X))

		iter_end = time.time()
		entropy_time = entropy_end - entropy_start
		filter_time = filter_end - filter_start
		print(f"[Step {step+1}] Entropy: {entropy_time:.2f}s | Filter: {filter_time:.2f}s")
		print(f"Iteration {step+1} took {iter_end - iter_start:.2f} seconds")

	base_vector = build_symptom_vector(user_symptoms, symptom_names, symptom_index)
	base_vector = np.expand_dims(base_vector, axis=0)

	augmented_vector = add_embedding_features(base_vector, embeddings)
	augmented_vector = scaler.transform(augmented_vector)

	symptom_vector = torch.tensor(augmented_vector, dtype=torch.float32)

	model_start = time.time()
	if patient is None:
		patient = {}

	results = predict_diseases(model, symptom_vector, disease_labels, symptom_names, base_vector, patient)
	results = bayesian_update(results, y)
	model_end = time.time()
	print(f"Model inference: {model_end - model_start:.4f}s")

	print("\nTop Possible Diseases:\n")

	for r in results:
		print(f"\n{r['disease']} -- {r['probability']:.2%}")
		print("Key contributing symptoms:")
		for s in r["explanation"]:
			print("-", s)

	active_risks = [k for k, v in patient.items() if v]
	if active_risks:
		print("\nRisk factors considered:")
		for k in active_risks:
			print("-", k)

	end_total = time.time()
	print(f"\nTotal diagnosis time: {end_total - start_total:.2f} seconds")

	return results
