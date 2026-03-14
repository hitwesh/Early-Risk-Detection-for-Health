import numpy as np

COMMON_DISEASE_BOOST = [
	"flu",
	"pneumonia",
	"bronchitis",
	"asthma",
	"covid",
	"infection",
	"uri",
	"cold",
	"sinus",
	"gastroenteritis",
]

RARE_DISEASE_PENALTY = [
	"poison",
	"genetic",
	"tumor",
	"rare",
	"syndrome",
	"carcin",
	"sarcoma",
]


def apply_disease_prior(probs, diseases):
	weights = np.ones(len(diseases))

	for i, name in enumerate(diseases):
		d = name.lower()

		for c in COMMON_DISEASE_BOOST:
			if c in d:
				weights[i] *= 1.5

		for r in RARE_DISEASE_PENALTY:
			if r in d:
				weights[i] *= 0.4

	adjusted = probs * weights
	adjusted = adjusted / np.sum(adjusted)

	return adjusted
