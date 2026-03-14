import numpy as np
import torch

from app.ai.disease_prior import apply_disease_prior
from app.ai.medical_filters import apply_medical_filters
from app.ai.model_loader import get_model
from app.ai.risk_factors import apply_risk_factor_weights


def normalize_symptom(symptom):
	if not isinstance(symptom, str):
		return ""
	cleaned = symptom.strip().lower().replace("-", " ").replace("_", " ")
	parts = cleaned.split()
	return " ".join(parts)


def _build_base_vector(symptoms, symptom_names):
	name_to_idx = {name: idx for idx, name in enumerate(symptom_names)}
	vector = np.zeros(len(symptom_names), dtype=float)

	for symptom in symptoms:
		normalized = normalize_symptom(symptom)
		idx = name_to_idx.get(normalized)
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


def _explain_prediction(model, base_vector, symptom_names):
	weights = model.network[0].weight.detach().cpu().numpy()
	symptom_count = len(symptom_names)
	weights = weights[:, :symptom_count]

	symptom_values = base_vector
	importance = np.abs(weights).mean(axis=0) * symptom_values
	top_features = np.argsort(importance)[-5:]

	explanations = []
	for idx in top_features:
		if symptom_values[idx] == 1:
			explanations.append(symptom_names[idx])

	return explanations[:3]


def _list_risk_factors(patient):
	ordered_keys = [
		"age",
		"sex",
		"bmi",
		"bp",
		"blood_sugar",
		"diabetes",
		"hypertension",
		"smoking",
		"alcohol",
		"family_heart_disease",
		"recent_infection",
		"pregnancy",
		"chronic_disease",
	]

	if not patient:
		return []

	considered = []
	for key in ordered_keys:
		if key in patient and patient.get(key) is not None:
			considered.append(key)
	return considered


def _predict_from_base_vector(base_vector, artifacts, risk_factors):
	model = artifacts.model
	disease_labels = artifacts.disease_labels
	embeddings = artifacts.embeddings
	scaler = artifacts.scaler

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
	probs = apply_disease_prior(probs, disease_labels)
	probs = apply_medical_filters(probs, disease_labels, risk_factors)
	indices = np.argsort(probs)[-5:][::-1]

	diseases = [disease_labels[i] for i in indices]
	probabilities = [float(probs[i]) for i in indices]
	key_symptoms = _explain_prediction(model, base_vector, artifacts.symptom_names)
	risk_factors_used = _list_risk_factors(risk_factors)

	return {
		"diseases": diseases,
		"probabilities": probabilities,
		"key_symptoms": key_symptoms,
		"risk_factors": risk_factors_used,
	}


def run_diagnosis(symptoms, risk_factors):
	artifacts = get_model()
	symptom_names = artifacts.symptom_names
	base_vector = _build_base_vector(symptoms, symptom_names)
	return _predict_from_base_vector(base_vector, artifacts, risk_factors)


def predict_from_vector(symptom_vector, risk_factors=None):
	artifacts = get_model()
	if risk_factors is None:
		risk_factors = {}

	base_vector = np.array(symptom_vector, dtype=float)
	if base_vector.shape[0] < len(artifacts.symptom_names):
		base_vector = np.pad(
			base_vector,
			(0, len(artifacts.symptom_names) - base_vector.shape[0]),
			constant_values=0.0,
		)
	elif base_vector.shape[0] > len(artifacts.symptom_names):
		base_vector = base_vector[: len(artifacts.symptom_names)]

	return _predict_from_base_vector(base_vector, artifacts, risk_factors)
