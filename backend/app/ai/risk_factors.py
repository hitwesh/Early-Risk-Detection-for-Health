import numpy as np

PULMONARY_KEYWORDS = [
	"lung",
	"pneumonia",
	"bronch",
	"asthma",
	"emphysema",
	"atelectasis",
	"sarcoidosis",
	"respiratory",
	"pulmonary",
	"copd",
	"pleur",
	"trache",
	"bronchiol",
	"pneumothorax",
]

CARDIO_KEYWORDS = [
	"heart",
	"cardio",
	"cardiac",
	"coronary",
	"myocard",
	"hypertension",
	"arrhythm",
	"atrial",
	"ventric",
	"ischemia",
	"angina",
	"aortic",
	"valve",
]

INFECTION_KEYWORDS = [
	"infection",
	"sepsis",
	"flu",
	"virus",
	"viral",
	"bacteria",
	"bacterial",
	"pneumonia",
	"cough",
	"bronchitis",
]

NEURO_KEYWORDS = [
	"stroke",
	"seizure",
	"epilep",
	"neuro",
	"parkinson",
	"dementia",
	"alzheimer",
	"migraine",
	"tremor",
	"neuropathy",
]

GI_KEYWORDS = [
	"gastr",
	"colitis",
	"ulcer",
	"bowel",
	"intestinal",
	"ileus",
	"appendic",
	"diarr",
	"vomit",
	"abdomen",
]

RENAL_KEYWORDS = [
	"kidney",
	"renal",
	"neph",
	"urinary",
	"bladder",
]

CANCER_KEYWORDS = [
	"cancer",
	"carcin",
	"lymphoma",
	"leukemia",
	"tumor",
	"sarcoma",
	"metast",
]


def match_keywords(disease, keywords):
	d = disease.lower()
	return any(k in d for k in keywords)


def apply_risk_factor_weights(disease_probs, diseases, patient):
	weights = np.ones(len(diseases))

	for i, disease in enumerate(diseases):
		age = patient.get("age", 0)
		sex = str(patient.get("sex", "")).lower()

		if sex in ["male", "m"] and match_keywords(disease, ["ovarian", "uterine", "cervical", "vaginal", "vulvar", "endometri", "pcos", "pregnan"]):
			weights[i] = 0.0
			continue

		if sex in ["female", "f"] and match_keywords(disease, ["prostate", "testicular", "penile", "erectile"]):
			weights[i] = 0.0
			continue

		if age < 18 and match_keywords(disease, ["menopause", "prostate", "erectile"]):
			weights[i] *= 0.0
			continue

		if patient.get("diabetes"):
			if match_keywords(disease, ["diabetes", "neuropathy", "kidney"]):
				weights[i] *= 1.4

		if patient.get("blood_sugar", 0) > 180:
			if match_keywords(disease, ["diabetes", "kidney", "neuropathy"]):
				weights[i] *= 1.4

		if patient.get("hypertension"):
			if match_keywords(disease, CARDIO_KEYWORDS):
				weights[i] *= 1.3

		if patient.get("smoking"):
			if match_keywords(disease, PULMONARY_KEYWORDS):
				weights[i] *= 1.4

		if patient.get("alcohol"):
			if match_keywords(disease, ["liver", "cirrhosis", "hepat", "pancreat"]):
				weights[i] *= 1.3

		if patient.get("family_heart_disease"):
			if match_keywords(disease, CARDIO_KEYWORDS):
				weights[i] *= 1.2

		if patient.get("bmi", 0) > 30:
			if match_keywords(disease, ["diabetes", "heart", "cardio"]):
				weights[i] *= 1.2

		if patient.get("bp", 0) > 140:
			if match_keywords(disease, CARDIO_KEYWORDS):
				weights[i] *= 1.3

		if age >= 60:
			if match_keywords(disease, CARDIO_KEYWORDS + NEURO_KEYWORDS):
				weights[i] *= 1.5

		if patient.get("blood_sugar", 0) > 180 and match_keywords(disease, RENAL_KEYWORDS):
			weights[i] *= 1.2

		if sex in ["female", "f"] and age >= 50:
			if match_keywords(disease, ["osteoporosis"]):
				weights[i] *= 1.2

		if patient.get("recent_infection"):
			if match_keywords(disease, INFECTION_KEYWORDS):
				weights[i] *= 1.2

		if patient.get("pregnancy"):
			if match_keywords(disease, ["pregnan", "preeclampsia", "gestational", "postpartum", "labor"]):
				weights[i] *= 1.3
			if match_keywords(disease, ["prostate", "testicular", "penile"]):
				weights[i] *= 0.0
				continue

		if match_keywords(disease, CANCER_KEYWORDS) and age >= 50:
			weights[i] *= 1.2

		if patient.get("chronic_disease"):
			if match_keywords(disease, ["kidney", "heart", "lung", "copd", "diabetes"]):
				weights[i] *= 1.15

	adjusted = disease_probs * weights
	adjusted = adjusted / np.sum(adjusted)

	return adjusted
