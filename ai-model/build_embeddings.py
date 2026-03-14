import json

import numpy as np
import pandas as pd

from symptom_graph import build_cooccurrence_matrix, generate_symptom_embeddings

DATA_PATH = "../datasets/raw/disease_symptom_dataset.csv"


def _get_label_column(df):
    if "Disease" in df.columns:
        return "Disease"
    if "diseases" in df.columns:
        return "diseases"
    return df.columns[0]


def build():
    df = pd.read_csv(DATA_PATH)
    df.columns = [c.strip() for c in df.columns]

    label_col = _get_label_column(df)
    symptom_cols = [c for c in df.columns if c != label_col]

    co_matrix = build_cooccurrence_matrix(df, symptom_cols)

    embeddings = generate_symptom_embeddings(co_matrix, dim=64)

    np.save("symptom_embeddings.npy", embeddings)

    print("Embeddings saved")


if __name__ == "__main__":
    build()
