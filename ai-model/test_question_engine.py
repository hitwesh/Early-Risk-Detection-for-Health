import pandas as pd
from question_engine import next_best_question, update_dataset

DATA_PATH = "../datasets/raw/disease_symptom_dataset.csv"


def _get_label_column(df):
	if "Disease" in df.columns:
		return "Disease"
	if "diseases" in df.columns:
		return "diseases"
	return df.columns[0]


# load dataset
df = pd.read_csv(DATA_PATH)
df.columns = [c.strip() for c in df.columns]

label_col = _get_label_column(df)
symptom_cols = [c for c in df.columns if c != label_col]

X = df[symptom_cols].values
y = df[label_col].values

symptom_names = list(symptom_cols)

asked = set()

print("Initial dataset size:", len(X))

for i in range(6):
	question, idx = next_best_question(X, y, symptom_names, asked)

	print("\nQuestion:", question)

	answer = input("yes/no: ")

	answer = 1 if answer == "yes" else 0

	X, y = update_dataset(X, y, idx, answer)

	asked.add(idx)

	print("Remaining cases:", len(X))
