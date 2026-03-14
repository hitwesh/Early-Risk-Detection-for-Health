import numpy as np

PEDIATRIC_KEYWORDS = [
	"diaper",
	"croup",
	"bronchiolitis",
	"teething",
	"neonatal",
	"infant"
]

GERIATRIC_KEYWORDS = [
	"alzheimer",
	"parkinson",
	"dementia"
]

PREGNANCY_KEYWORDS = [
	"pregnancy",
	"preeclampsia",
	"gestational",
	"placenta",
	"postpartum"
]

MALE_ONLY_KEYWORDS = [
	"prostate",
	"testicular",
	"penile"
]

FEMALE_ONLY_KEYWORDS = [
	"ovarian",
	"uterine",
	"endometriosis",
	"pregnancy",
	"cervical",
	"vaginal",
	"vulvar"
]


def apply_medical_filters(probs, diseases, patient):
	age = patient.get("age", 0)
	sex = str(patient.get("sex", "")).lower()

	for i, d in enumerate(diseases):
		name = d.lower()

		if age > 12 and any(k in name for k in PEDIATRIC_KEYWORDS):
			probs[i] = 0

		if age < 40 and any(k in name for k in GERIATRIC_KEYWORDS):
			probs[i] = 0

		if sex in ["male", "m"] and any(k in name for k in PREGNANCY_KEYWORDS):
			probs[i] = 0

		if sex in ["female", "f"] and any(k in name for k in MALE_ONLY_KEYWORDS):
			probs[i] = 0

		if sex in ["male", "m"] and any(k in name for k in FEMALE_ONLY_KEYWORDS):
			probs[i] = 0

	total = np.sum(probs)
	if total > 0:
		probs = probs / total

	return probs
