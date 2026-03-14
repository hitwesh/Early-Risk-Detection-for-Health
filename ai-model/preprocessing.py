import numpy as np


def _get_label_column(df):
	if "Disease" in df.columns:
		return "Disease"
	if "diseases" in df.columns:
		return "diseases"
	return df.columns[0]


def _symptom_columns(df, label_col):
	return [c for c in df.columns if c != label_col]


def _has_binary_symptom_columns(df, symptom_cols):
	numeric_cols = df[symptom_cols].select_dtypes(include="number")
	return numeric_cols.shape[1] == len(symptom_cols)


def build_symptom_dictionary(df):
	label_col = _get_label_column(df)
	symptom_cols = _symptom_columns(df, label_col)

	if _has_binary_symptom_columns(df, symptom_cols):
		symptoms = sorted(symptom_cols)
	else:
		symptoms = set()

		for col in symptom_cols:
			symptoms.update(df[col].dropna().unique())

		symptoms = sorted(symptoms)

	symptom_to_idx = {s: i for i, s in enumerate(symptoms)}

	return symptoms, symptom_to_idx


def encode_dataset(df, symptom_to_idx):
	X = []
	y = []

	label_col = _get_label_column(df)
	symptom_cols = _symptom_columns(df, label_col)

	diseases = df[label_col].unique()
	disease_to_idx = {d: i for i, d in enumerate(diseases)}

	if _has_binary_symptom_columns(df, symptom_cols):
		for _, row in df.iterrows():
			vector = row[symptom_cols].fillna(0).to_numpy(dtype=float)
			X.append(vector)
			y.append(disease_to_idx[row[label_col]])
	else:
		for _, row in df.iterrows():
			vector = np.zeros(len(symptom_to_idx))

			for col in symptom_cols:
				symptom = row[col]

				if symptom in symptom_to_idx:
					vector[symptom_to_idx[symptom]] = 1

			X.append(vector)
			y.append(disease_to_idx[row[label_col]])

	return np.array(X), np.array(y), diseases
