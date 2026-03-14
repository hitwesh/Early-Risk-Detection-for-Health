import uuid

sessions = {}


def create_session(symptom_names):
	session_id = str(uuid.uuid4())
	sessions[session_id] = {
		"vector": [0] * len(symptom_names),
		"asked": set(),
	}
	return session_id


def get_session(session_id):
	return sessions.get(session_id)


def update_symptom(session_id, symptom_index, answer):
	session = sessions[session_id]
	if answer:
		session["vector"][symptom_index] = 1
	else:
		session["vector"][symptom_index] = 0
	session["asked"].add(symptom_index)


def get_next_symptom(symptom_names, asked):
	for idx, name in enumerate(symptom_names):
		if idx not in asked:
			return idx, name
	return None, None
