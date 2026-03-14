def ask_int(prompt, min_val, max_val):
	while True:
		try:
			value = int(input(prompt))
			if value < min_val or value > max_val:
				print(f"Enter a value between {min_val} and {max_val}")
				continue
			return value
		except ValueError:
			print("Invalid input. Enter a number.")


def ask_yes_no(prompt):
	while True:
		ans = input(prompt).lower().strip()
		if ans in ["yes", "y"]:
			return True
		if ans in ["no", "n"]:
			return False
		print("Please answer yes or no.")


def ask_choice(prompt, choices):
	choices = [c.lower() for c in choices]
	while True:
		ans = input(prompt).lower().strip()
		if ans in choices:
			return ans
		print(f"Enter one of: {', '.join(choices)}")
