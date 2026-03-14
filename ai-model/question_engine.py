import numpy as np
import pandas as pd
from collections import defaultdict


def entropy(labels):
    values, counts = np.unique(labels, return_counts=True)
    probs = counts / counts.sum()

    return -np.sum(probs * np.log2(probs + 1e-9))


def information_gain(X, y, symptom_index):
    total_entropy = entropy(y)

    symptom_present = X[:, symptom_index] == 1
    symptom_absent = X[:, symptom_index] == 0

    if symptom_present.sum() == 0 or symptom_absent.sum() == 0:
        return 0

    y_present = y[symptom_present]
    y_absent = y[symptom_absent]

    weight_present = len(y_present) / len(y)
    weight_absent = len(y_absent) / len(y)

    gain = total_entropy \
        - weight_present * entropy(y_present) \
        - weight_absent * entropy(y_absent)

    return gain


def rank_symptoms(X, y, asked_symptoms=None):
    if asked_symptoms is None:
        asked_symptoms = set()

    scores = {}

    for i in range(X.shape[1]):
        if i in asked_symptoms:
            continue

        gain = information_gain(X, y, i)
        scores[i] = gain

    ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)

    return ranked


def next_best_question(X, y, symptom_names, asked_symptoms):
    ranked = rank_symptoms(X, y, asked_symptoms)

    best_index = ranked[0][0]

    return symptom_names[best_index], best_index


def update_dataset(X, y, symptom_index, answer):
    if answer == 1:
        mask = X[:, symptom_index] == 1
    else:
        mask = X[:, symptom_index] == 0

    return X[mask], y[mask]
