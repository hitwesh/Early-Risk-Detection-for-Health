import numpy as np


def apply_risk_factor_weights(disease_probs, diseases, patient):
	weights = np.ones(len(diseases))

	for i, disease in enumerate(diseases):
		d = disease.lower()

		age = patient.get("age", 0)
		sex = str(patient.get("sex", "")).lower()

		if patient.get("diabetes"):
			if "diabetes" in d or "neuropathy" in d or "kidney" in d:
				weights[i] *= 1.4

		if patient.get("blood_sugar", 0) > 180:
			if "diabetes" in d or "kidney" in d or "neuropathy" in d:
				weights[i] *= 1.4

		if patient.get("hypertension"):
			if "heart" in d or "stroke" in d or "cardio" in d:
				weights[i] *= 1.3

		if patient.get("smoking"):
			if "lung" in d or "copd" in d or "emphysema" in d:
				weights[i] *= 1.4

		if patient.get("alcohol"):
			if "liver" in d or "cirrhosis" in d:
				weights[i] *= 1.3

		if patient.get("family_heart_disease"):
			if "heart" in d or "cardio" in d or "stroke" in d:
				weights[i] *= 1.2

		if patient.get("bmi", 0) > 30:
			if "diabetes" in d or "heart" in d:
				weights[i] *= 1.2

		if patient.get("bp", 0) > 140:
			if "stroke" in d or "heart" in d:
				weights[i] *= 1.3

		if age >= 60:
			if "stroke" in d or "heart" in d or "cardio" in d:
				weights[i] *= 1.5

		if sex in ["female", "f"] and age >= 50:
			if "osteoporosis" in d:
				weights[i] *= 1.2

	adjusted = disease_probs * weights
	adjusted = adjusted / np.sum(adjusted)

	return adjusted
