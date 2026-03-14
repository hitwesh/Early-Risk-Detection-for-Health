import numpy as np
import pandas as pd
from collections import defaultdict
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity


def build_cooccurrence_matrix(df, symptom_cols):
    co_matrix = np.zeros((len(symptom_cols), len(symptom_cols)))

    for _, row in df.iterrows():
        active = [i for i, s in enumerate(symptom_cols) if row[s] == 1]

        for i in active:
            for j in active:
                if i != j:
                    co_matrix[i][j] += 1

    return co_matrix


def generate_symptom_embeddings(co_matrix, dim=64):
    svd = TruncatedSVD(n_components=dim)

    embeddings = svd.fit_transform(co_matrix)

    return embeddings


def disease_similarity_matrix(X, y):
    disease_vectors = {}

    for disease in np.unique(y):
        rows = X[y == disease]

        disease_vectors[disease] = rows.mean(axis=0)

    matrix = cosine_similarity(list(disease_vectors.values()))

    return matrix, disease_vectors
