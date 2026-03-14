import json

import numpy as np
import torch
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.utils.class_weight import compute_class_weight
from torch import nn
from torch.optim import Adam

from dataset_loader import load_dataset
from preprocessing import build_symptom_dictionary, encode_dataset
from model import DiseasePredictor

DATA_PATH = "../datasets/raw/disease_symptom_dataset.csv"
FORCE_CPU = True


def add_embedding_features(X, embeddings):
	embedding_features = []

	for row in X:
		active = np.where(row == 1)[0]

		if len(active) == 0:
			embedding_features.append(np.zeros(embeddings.shape[1]))
		else:
			emb = embeddings[active].mean(axis=0)
			embedding_features.append(emb)

	embedding_features = np.array(embedding_features)

	return np.concatenate([X, embedding_features], axis=1)


def train():
	df = load_dataset(DATA_PATH)

	symptoms, symptom_to_idx = build_symptom_dictionary(df)

	X, y, diseases = encode_dataset(df, symptom_to_idx)

	embeddings = np.load("symptom_embeddings.npy")
	X = add_embedding_features(X, embeddings)

	scaler = StandardScaler()
	X = scaler.fit_transform(X)

	X_train, X_test, y_train, y_test = train_test_split(
		X,
		y,
		test_size=0.2,
		random_state=42
	)

	X_train = torch.tensor(X_train, dtype=torch.float32)
	X_test = torch.tensor(X_test, dtype=torch.float32)

	y_train = torch.tensor(y_train, dtype=torch.long)
	y_test = torch.tensor(y_test, dtype=torch.long)

	if FORCE_CPU:
		device = torch.device("cpu")
	else:
		device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
	print(f"Using device: {device}")

	model = DiseasePredictor(
		input_size=X.shape[1],
		num_classes=len(diseases)
	).to(device)

	class_weights = compute_class_weight(
		class_weight="balanced",
		classes=np.unique(y),
		y=y
	)

	class_weights = torch.tensor(class_weights, dtype=torch.float32).to(device)

	criterion = nn.CrossEntropyLoss(weight=class_weights)
	optimizer = Adam(model.parameters(), lr=0.001)

	epochs = 250

	X_train = X_train.to(device)
	y_train = y_train.to(device)
	X_test = X_test.to(device)
	y_test = y_test.to(device)

	for epoch in range(epochs):
		outputs = model(X_train)

		loss = criterion(outputs, y_train)

		optimizer.zero_grad()
		loss.backward()
		optimizer.step()

		with torch.no_grad():
			test_outputs = model(X_test)
			_, predicted = torch.max(test_outputs, 1)
			accuracy = (predicted == y_test).sum().item() / len(y_test)

		print(f"Epoch {epoch+1} Loss: {loss.item()} Accuracy: {accuracy}")

	torch.save(model.state_dict(), "disease_model.pt")

	# Save symptom index
	with open("symptom_index.json", "w") as f:
		json.dump(symptom_to_idx, f)

	# Save disease labels
	with open("disease_labels.json", "w") as f:
		json.dump(list(diseases), f)

	print("Saved metadata files")

	print("Model saved as disease_model.pt")


if __name__ == "__main__":
	train()
