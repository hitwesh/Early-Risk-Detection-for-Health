from dataset_cache import load_cached_dataset
from diagnosis_engine import run_diagnosis
from patient_profile import get_patient_profile
from input_validation import ask_yes_no


X, y, symptom_names = load_cached_dataset()

patient = get_patient_profile()
patient["debug_risk"] = ask_yes_no("Show risk-factor debug (y/n): ")

run_diagnosis(X, y, symptom_names, patient)
