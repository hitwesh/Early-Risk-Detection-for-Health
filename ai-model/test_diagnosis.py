from dataset_cache import load_cached_dataset
from diagnosis_engine import run_diagnosis

def _prompt_float(label, default):
	value = input(f"{label} [{default}]: ").strip()
	return float(value) if value else float(default)


def _prompt_bool(label, default=False):
	default_str = "y" if default else "n"
	value = input(f"{label} (y/n) [{default_str}]: ").strip().lower()
	if value == "":
		return default
	return value in ["y", "yes"]


X, y, symptom_names = load_cached_dataset()

patient = {
	"age": _prompt_float("Age", 45),
	"bmi": _prompt_float("BMI", 31),
	"bp": _prompt_float("Blood pressure", 150),
	"diabetes": _prompt_bool("Diabetes history", False),
	"hypertension": _prompt_bool("Hypertension history", True),
	"smoking": _prompt_bool("Smoking", False)
}

run_diagnosis(X, y, symptom_names, patient)
