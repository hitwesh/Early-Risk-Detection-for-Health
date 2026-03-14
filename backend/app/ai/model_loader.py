import json
import os
from functools import lru_cache

import numpy as np
import torch
from sklearn.preprocessing import StandardScaler

from app.ai.dataset_cache import load_cached_dataset
from app.ai.model import DiseasePredictor
from app.core.config import settings


class ModelArtifacts:
	def __init__(self):
		self.X, self.y, self.symptom_names = load_cached_dataset()
		(
			self.model,
			self.symptom_index,
			self.disease_labels,
			self.embeddings,
			self.scaler,
		) = self._load_model()

	def _add_embedding_features(self, X, embeddings):
		embedding_features = []

		for row in X:
			active = np.where(row == 1)[0]
			if len(active) == 0:
				embedding_features.append(np.zeros(embeddings.shape[1]))
			else:
				embedding_features.append(embeddings[active].mean(axis=0))

		return np.concatenate([X, np.array(embedding_features)], axis=1)

	def _load_model(self):
		model_path = settings.MODEL_PATH
		model_dir = os.path.dirname(model_path) or "."
		symptom_index_path = os.path.join(model_dir, "symptom_index.json")
		disease_labels_path = os.path.join(model_dir, "disease_labels.json")
		embeddings_path = os.path.join(model_dir, "symptom_embeddings.npy")

		with open(symptom_index_path, "r", encoding="utf-8") as f:
			symptom_index = json.load(f)

		with open(disease_labels_path, "r", encoding="utf-8") as f:
			disease_labels = json.load(f)

		state = torch.load(model_path, map_location="cpu")
		first_weight = state["network.0.weight"]
		input_size = first_weight.shape[1]

		model = DiseasePredictor(input_size, len(disease_labels))
		model.load_state_dict(state)
		model.eval()

		embeddings = np.load(embeddings_path)
		augmented_X = self._add_embedding_features(self.X, embeddings)
		scaler = StandardScaler()
		scaler.fit(augmented_X)

		return model, symptom_index, disease_labels, embeddings, scaler


@lru_cache()
def get_model():
	return ModelArtifacts()
