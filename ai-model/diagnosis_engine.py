import json

import numpy as np
import torch
from sklearn.preprocessing import StandardScaler

from question_engine import next_best_question, update_dataset
from model import DiseasePredictor


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


def predict_diseases(model, symptom_vector, disease_labels):
	with torch.no_grad():
		outputs = model(symptom_vector)
		probs = torch.softmax(outputs, dim=1)

	probs = probs.numpy()[0]

	top_indices = np.argsort(probs)[-5:][::-1]

	results = []

	for idx in top_indices:
		results.append({
			"disease": disease_labels[idx],
			"probability": float(probs[idx])
		})

	return results


def run_diagnosis(X, y, symptom_names):
	embeddings = np.load("symptom_embeddings.npy")
	augmented_X = add_embedding_features(X, embeddings)

	model, symptom_index, disease_labels = load_model(augmented_X.shape[1])

	scaler = StandardScaler()
	scaler.fit(augmented_X)

	asked = set()
	user_symptoms = []

	for _ in range(6):
		question, idx = next_best_question(X, y, symptom_names, asked)

		print("\nDo you have:", question)

		answer = input("yes/no: ")
		answer = 1 if answer == "yes" else 0

		if answer == 1:
			user_symptoms.append(question)

		X, y = update_dataset(X, y, idx, answer)
		asked.add(idx)

		print("Remaining cases:", len(X))

	base_vector = build_symptom_vector(user_symptoms, symptom_names, symptom_index)
	base_vector = np.expand_dims(base_vector, axis=0)

	augmented_vector = add_embedding_features(base_vector, embeddings)
	augmented_vector = scaler.transform(augmented_vector)

	symptom_vector = torch.tensor(augmented_vector, dtype=torch.float32)

	results = predict_diseases(model, symptom_vector, disease_labels)

	print("\nTop Possible Diseases:\n")

	for r in results:
		print(f"{r['disease']} -- {r['probability']:.2%}")

	return results
