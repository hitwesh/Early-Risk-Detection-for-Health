import json

from sqlalchemy.orm import Session

from app.repositories.diagnosis_repo import create_history, list_history_by_user


def create_history_for_user(
	db: Session,
	user_id: int,
	symptoms: list[str],
	prediction: dict,
):
	diseases = prediction.get("diseases", [])
	probabilities = prediction.get("probabilities", [])
	top_prediction = diseases[0] if diseases else "Unknown"
	risk_factors = prediction.get("risk_factors", [])

	return create_history(
		db=db,
		user_id=user_id,
		symptoms=symptoms,
		top_prediction=top_prediction,
		diseases=diseases,
		probabilities=probabilities,
		risk_factors=risk_factors,
	)


def get_history_for_user(db: Session, user_id: int):
	records = list_history_by_user(db, user_id)
	results = []
	for record in records:
		results.append(
			{
				"id": record.id,
				"symptoms": json.loads(record.symptoms),
				"top_prediction": record.top_prediction,
				"diseases": json.loads(record.diseases),
				"probabilities": json.loads(record.probabilities),
				"risk_factors": json.loads(record.risk_factors)
				if record.risk_factors
				else None,
				"created_at": record.created_at.isoformat(),
			}
		)
	return results
