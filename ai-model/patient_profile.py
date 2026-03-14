from input_validation import ask_choice, ask_int, ask_yes_no


def get_patient_profile():
	age = ask_int("Age: ", 0, 110)
	sex = ask_choice("Sex (male/female): ", ["male", "female"])
	bmi = ask_int("BMI: ", 10, 60)
	bp = ask_int("Blood pressure: ", 70, 200)
	blood_sugar = ask_int("Blood sugar: ", 50, 400)

	diabetes = ask_yes_no("Diabetes history (y/n): ")
	hypertension = ask_yes_no("Hypertension history (y/n): ")
	smoking = ask_yes_no("Smoking (y/n): ")
	alcohol = ask_yes_no("Alcohol use (y/n): ")
	family_heart_disease = ask_yes_no("Family heart disease (y/n): ")
	recent_infection = ask_yes_no("Recent infection (y/n): ")

	if age < 18 or sex == "male":
		pregnancy = False
	else:
		pregnancy = ask_yes_no("Pregnancy (y/n): ")
	chronic_disease = ask_yes_no("Chronic disease history (y/n): ")

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
		"family_heart_disease": family_heart_disease,
		"recent_infection": recent_infection,
		"pregnancy": pregnancy,
		"chronic_disease": chronic_disease
	}
