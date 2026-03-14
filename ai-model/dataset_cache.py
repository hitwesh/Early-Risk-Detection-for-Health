import os

import numpy as np
import pandas as pd

DEFAULT_DATA_PATH = "../datasets/raw/disease_symptom_dataset.csv"


def _get_label_column(df):
	if "Disease" in df.columns:
		return "Disease"
	if "diseases" in df.columns:
		return "diseases"
	return df.columns[0]


def load_cached_dataset(data_path=DEFAULT_DATA_PATH, cache_dir="."):
	x_path = os.path.join(cache_dir, "X.npy")
	y_path = os.path.join(cache_dir, "y.npy")
	symptom_path = os.path.join(cache_dir, "symptom_names.npy")

	if os.path.exists(x_path) and os.path.exists(y_path) and os.path.exists(symptom_path):
		X = np.load(x_path)
		y = np.load(y_path, allow_pickle=True)
		symptom_names = np.load(symptom_path, allow_pickle=True).tolist()
		return X, y, symptom_names

	df = pd.read_csv(data_path)
	df.columns = [c.strip() for c in df.columns]

	label_col = _get_label_column(df)
	symptom_cols = [c for c in df.columns if c != label_col]

	X = df[symptom_cols].values
	y = df[label_col].values

	np.save(x_path, X)
	np.save(y_path, y)
	np.save(symptom_path, np.array(symptom_cols, dtype=object))

	return X, y, list(symptom_cols)
