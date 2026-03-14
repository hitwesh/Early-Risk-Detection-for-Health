import pandas as pd


def load_dataset(path):
	df = pd.read_csv(path)

	# Normalize column names
	df.columns = [c.strip() for c in df.columns]

	return df
