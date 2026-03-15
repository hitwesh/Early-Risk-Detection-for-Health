import time
import uuid

from app.ai.bayesian_engine import (
	build_symptom_disease_matrix,
	initialize_probs,
	select_next_symptom,
	update_probabilities,
)
from app.ai.dataset_cache import load_cached_dataset
from app.ai.symptom_engine import next_best_question, update_dataset

MAX_QUESTIONS = 12
MIN_CASES = 40
CONFIDENCE_STOP = 0.95
BAYESIAN_SWITCH_THRESHOLD = 50000
sessions = {}


def create_session(
	symptom_names,
	disease_labels,
	use_bayes_engine=True,
	max_questions=MAX_QUESTIONS,
	min_cases=MIN_CASES,
	confidence_stop=CONFIDENCE_STOP,
	risk_factors=None,
):
	X, y, _ = load_cached_dataset()
	session_id = str(uuid.uuid4())
	if risk_factors is None:
		risk_factors = {}

	bayes_matrix = None
	bayes_probs = None
	if use_bayes_engine:
		bayes_matrix = build_symptom_disease_matrix(X, y, disease_labels, symptom_names)
		bayes_probs = initialize_probs(len(disease_labels))

	sessions[session_id] = {
		"vector": [0] * len(symptom_names),
		"asked": set(),
		"questions_asked": 0,
		"max_questions": max_questions,
		"min_cases": min_cases,
		"confidence_stop": confidence_stop,
		"risk_factors": risk_factors,
		"positive_symptoms": [],
		"X": X,
		"y": y,
		"use_bayes_engine": use_bayes_engine,
		"bayes_matrix": bayes_matrix,
		"bayes_probs": bayes_probs,
		"last_engine": None,
		"started_at": time.time(),
	}
	return session_id


def get_session(session_id):
	return sessions.get(session_id)


def update_symptom(session_id, symptom_index, symptom_name, answer):
	session = sessions[session_id]
	answer_value = 1 if answer else 0
	if answer:
		session["vector"][symptom_index] = 1
	else:
		session["vector"][symptom_index] = 0
	session["asked"].add(symptom_index)
	session["questions_asked"] += 1
	session["X"], session["y"] = update_dataset(session["X"], session["y"], symptom_index, answer_value)
	if answer:
		session["positive_symptoms"].append(symptom_name)
	if session["use_bayes_engine"] and session["bayes_probs"] is not None:
		session["bayes_probs"] = update_probabilities(
			session["bayes_probs"],
			symptom_index,
			answer,
			session["bayes_matrix"],
		)


def is_session_finished(session, total_symptoms, max_probability=None):
	if session["questions_asked"] >= session["max_questions"]:
		return True
	if len(session["asked"]) >= total_symptoms:
		return True
	if len(session["X"]) < session["min_cases"]:
		return True
	if max_probability is not None and max_probability >= session["confidence_stop"]:
		return True
	return False


def get_next_symptom(session, symptom_names):
	if len(session["X"]) == 0:
		return None, None, None

	engine = "entropy"
	if session["use_bayes_engine"] and session["bayes_probs"] is not None:
		engine = "bayesian+entropy"

	symptom_counts = session["X"].sum(axis=0)
	question, idx = next_best_question(
		session["X"],
		session["y"],
		symptom_names,
		session["asked"],
		symptom_counts,
	)

	session["last_engine"] = engine
	return idx, question, engine
