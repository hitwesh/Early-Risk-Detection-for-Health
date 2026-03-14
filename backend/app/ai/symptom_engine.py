import numpy as np


def entropy(labels):
	values, counts = np.unique(labels, return_counts=True)
	probs = counts / counts.sum()

	return -np.sum(probs * np.log2(probs + 1e-9))


def information_gain(X, y, symptom_index):
	total_entropy = entropy(y)

	symptom_present = X[:, symptom_index] == 1
	symptom_absent = X[:, symptom_index] == 0

	if symptom_present.sum() == 0 or symptom_absent.sum() == 0:
		return 0

	y_present = y[symptom_present]
	y_absent = y[symptom_absent]

	weight_present = len(y_present) / len(y)
	weight_absent = len(y_absent) / len(y)

	gain = total_entropy \
		- weight_present * entropy(y_present) \
		- weight_absent * entropy(y_absent)

	return gain


def rank_symptoms(X, y, asked_symptoms=None, symptom_counts=None):
	if asked_symptoms is None:
		asked_symptoms = set()

	scores = {}

	if symptom_counts is None:
		symptom_counts = X.sum(axis=0)

	candidate_symptoms = np.where(symptom_counts > 5)[0]

	if candidate_symptoms.size > 0:
		if len(X) > 50000:
			top_k = 25
		elif len(X) > 10000:
			top_k = 40
		else:
			top_k = 80

		top_k = min(top_k, candidate_symptoms.size)
		top = np.argsort(symptom_counts[candidate_symptoms])[-top_k:]
		candidate_symptoms = candidate_symptoms[top]

	for i in candidate_symptoms:
		if i in asked_symptoms:
			continue

		gain = information_gain(X, y, i)
		scores[i] = gain

	ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)

	return ranked


def next_best_question(X, y, symptom_names, asked_symptoms, symptom_counts=None):
	ranked = rank_symptoms(X, y, asked_symptoms, symptom_counts)

	best_index = ranked[0][0]

	return symptom_names[best_index], best_index


def update_dataset(X, y, symptom_index, answer):
	mask = X[:, symptom_index] == answer

	return X[mask], y[mask]
