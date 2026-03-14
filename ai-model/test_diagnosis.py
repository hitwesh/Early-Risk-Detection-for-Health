from dataset_cache import load_cached_dataset
from diagnosis_engine import run_diagnosis

X, y, symptom_names = load_cached_dataset()

run_diagnosis(X, y, symptom_names)
