from dataset_cache import load_cached_dataset
from diagnosis_engine import run_diagnosis
from patient_profile import get_patient_profile


X, y, symptom_names = load_cached_dataset()

patient = get_patient_profile()
patient["debug_risk"] = input("Show risk-factor debug (y/n): ").strip().lower() in ["y", "yes"]

run_diagnosis(X, y, symptom_names, patient)
