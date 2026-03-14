import numpy as np


def build_symptom_disease_matrix(X, y, disease_labels, symptom_names):
	label_to_idx = {label: i for i, label in enumerate(disease_labels)}
	matrix = np.zeros((len(disease_labels), len(symptom_names)), dtype=float)
	counts = np.zeros(len(disease_labels), dtype=float)

	for i, label in enumerate(y):
		disease_idx = label_to_idx.get(label)
		if disease_idx is None:
			continue
		matrix[disease_idx] += X[i]
		counts[disease_idx] += 1

	for i, count in enumerate(counts):
		if count > 0:
			matrix[i] = matrix[i] / count

	return matrix


def initialize_probs(num_diseases):
	return np.ones(num_diseases, dtype=float) / num_diseases


def update_probabilities(probs, symptom_index, answer, symptom_disease_matrix):
	if answer:
		probs = probs * symptom_disease_matrix[:, symptom_index]
	else:
		probs = probs * (1 - symptom_disease_matrix[:, symptom_index])

	total = probs.sum()
	if total > 0:
		probs = probs / total

	return probs


def _entropy(dist):
	dist = dist[dist > 0]
	if dist.size == 0:
		return 0.0
	return -np.sum(dist * np.log2(dist))


def select_next_symptom(probs, symptom_disease_matrix, asked, top_k=40, min_count=0.01):
	symptom_probs = probs @ symptom_disease_matrix
	candidates = np.where(symptom_probs > min_count)[0]

	if candidates.size == 0:
		return None

	top_k = min(top_k, candidates.size)
	top = np.argsort(symptom_probs[candidates])[-top_k:]
	candidates = candidates[top]

	best_idx = None
	best_gain = -1.0
	current_entropy = _entropy(probs)

	for idx in candidates:
		if idx in asked:
			continue
		p_yes = symptom_probs[idx]
		p_no = 1 - p_yes

		if p_yes == 0 or p_no == 0:
			continue

		probs_yes = probs * symptom_disease_matrix[:, idx]
		probs_no = probs * (1 - symptom_disease_matrix[:, idx])

		if probs_yes.sum() > 0:
			probs_yes = probs_yes / probs_yes.sum()
		if probs_no.sum() > 0:
			probs_no = probs_no / probs_no.sum()

		expected_entropy = p_yes * _entropy(probs_yes) + p_no * _entropy(probs_no)
		gain = current_entropy - expected_entropy

		if gain > best_gain:
			best_gain = gain
			best_idx = idx

	return best_idx
