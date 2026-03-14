import numpy as np
import torch

from app.ai.model_loader import get_model
from app.ai.risk_factors import apply_risk_factor_weights


def _build_base_vector(symptoms, symptom_names):
	name_to_idx = {name: idx for idx, name in enumerate(symptom_names)}
	vector = np.zeros(len(symptom_names), dtype=float)

	for symptom in symptoms:
		idx = name_to_idx.get(symptom)
		if idx is not None:
			vector[idx] = 1.0

	return vector


def _add_embedding_features(base_vector, embeddings):
	active = np.where(base_vector == 1)[0]
	if active.size == 0:
		embedding_vec = np.zeros(embeddings.shape[1])
	else:
		embedding_vec = embeddings[active].mean(axis=0)

	return np.concatenate([base_vector, embedding_vec], axis=0)


def run_diagnosis(symptoms, risk_factors):
	artifacts = get_model()
	model = artifacts.model
	symptom_names = artifacts.symptom_names
	disease_labels = artifacts.disease_labels
	embeddings = artifacts.embeddings
	scaler = artifacts.scaler

	base_vector = _build_base_vector(symptoms, symptom_names)
	features = _add_embedding_features(base_vector, embeddings)
	features = scaler.transform([features])[0]

	input_size = model.network[0].in_features
	if features.shape[0] < input_size:
		features = np.pad(features, (0, input_size - features.shape[0]), constant_values=0.0)
	elif features.shape[0] > input_size:
		features = features[:input_size]

	inputs = torch.tensor(features, dtype=torch.float32).unsqueeze(0)
	with torch.no_grad():
		outputs = model(inputs)
		probs = torch.softmax(outputs, dim=1).cpu().numpy()[0]

	probs = apply_risk_factor_weights(probs, disease_labels, risk_factors)
	indices = np.argsort(probs)[-5:][::-1]

	diseases = [disease_labels[i] for i in indices]
	probabilities = [float(probs[i]) for i in indices]

	return {
		"diseases": diseases,
		"probabilities": probabilities,
	}
