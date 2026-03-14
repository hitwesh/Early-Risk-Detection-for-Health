from dataset_cache import load_cached_dataset
from question_engine import next_best_question, update_dataset

X, y, symptom_names = load_cached_dataset()

asked = set()

print("Initial dataset size:", len(X))

for i in range(6):
	question, idx = next_best_question(X, y, symptom_names, asked)

	print("\nQuestion:", question)

	answer = input("yes/no: ").strip().lower()

	answer = 1 if answer in ["yes", "y"] else 0

	X, y = update_dataset(X, y, idx, answer)

	asked.add(idx)

	print("Remaining cases:", len(X))
