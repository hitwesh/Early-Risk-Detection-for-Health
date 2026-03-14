import numpy as np


def apply_risk_factor_weights(disease_probs, diseases, patient):
	weights = np.ones(len(diseases))

	for i, disease in enumerate(diseases):
		d = disease.lower()

		if patient.get("diabetes"):
			if "diabetes" in d or "neuropathy" in d or "kidney" in d:
				weights[i] *= 1.4

		if patient.get("hypertension"):
			if "heart" in d or "stroke" in d or "cardio" in d:
				weights[i] *= 1.3

		if patient.get("smoking"):
			if "lung" in d or "copd" in d or "emphysema" in d:
				weights[i] *= 1.4

		if patient.get("bmi", 0) > 30:
			if "diabetes" in d or "heart" in d:
				weights[i] *= 1.2

		if patient.get("bp", 0) > 140:
			if "stroke" in d or "heart" in d:
				weights[i] *= 1.3

	adjusted = disease_probs * weights
	adjusted = adjusted / np.sum(adjusted)

	return adjusted
