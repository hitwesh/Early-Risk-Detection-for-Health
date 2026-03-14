def _prompt_float(label):	
	value = input(f"{label}: ").strip()
	return float(value) if value else 0.0


def _prompt_bool(label):
	value = input(f"{label} (y/n): ").strip().lower()
	return value in ["y", "yes"]


def _prompt_text(label):
	return input(f"{label}: ").strip()


def get_patient_profile():
	age = _prompt_float("Age")
	sex = _prompt_text("Sex (male/female)")
	bmi = _prompt_float("BMI")
	bp = _prompt_float("Blood pressure")
	blood_sugar = _prompt_float("Blood sugar")

	diabetes = _prompt_bool("Diabetes history")
	hypertension = _prompt_bool("Hypertension history")
	smoking = _prompt_bool("Smoking")
	alcohol = _prompt_bool("Alcohol use")
	family_heart_disease = _prompt_bool("Family heart disease")

	return {
		"age": age,
		"sex": sex,
		"bmi": bmi,
		"bp": bp,
		"blood_sugar": blood_sugar,
		"diabetes": diabetes,
		"hypertension": hypertension,
		"smoking": smoking,
		"alcohol": alcohol,
		"family_heart_disease": family_heart_disease
	}
