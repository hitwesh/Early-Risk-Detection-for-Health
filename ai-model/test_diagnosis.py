import pandas as pd

from diagnosis_engine import run_diagnosis

DATA_PATH = "../datasets/raw/disease_symptom_dataset.csv"


def _get_label_column(df):
	if "Disease" in df.columns:
		return "Disease"
	if "diseases" in df.columns:
		return "diseases"
	return df.columns[0]


df = pd.read_csv(DATA_PATH)

df.columns = [c.strip() for c in df.columns]

label_col = _get_label_column(df)
symptom_cols = [c for c in df.columns if c != label_col]

X = df[symptom_cols].values
y = df[label_col].values

run_diagnosis(X, y, list(symptom_cols))
