import json

import numpy as np
import torch

from model import DiseasePredictor

# Load metadata
with open("symptom_index.json") as f:
	symptom_to_idx = json.load(f)

with open("disease_labels.json") as f:
	diseases = json.load(f)

# Load model
model = DiseasePredictor(
	input_size=len(symptom_to_idx),
	num_classes=len(diseases)
)

model.load_state_dict(torch.load("disease_model.pt", map_location="cpu"))
model.eval()


def predict(symptoms):
	vector = np.zeros(len(symptom_to_idx))

	for s in symptoms:
		if s in symptom_to_idx:
			vector[symptom_to_idx[s]] = 1

	tensor = torch.tensor(vector, dtype=torch.float32).unsqueeze(0)

	with torch.no_grad():
		output = model(tensor)

	probs = torch.softmax(output, dim=1)

	topk = torch.topk(probs, 5)

	results = []

	for i in range(5):
		disease_idx = topk.indices[0][i].item()
		probability = topk.values[0][i].item()

		results.append({
			"disease": diseases[disease_idx],
			"probability": probability
		})

	return results
