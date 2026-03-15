import json

from sqlalchemy.orm import Session

from app.models.diagnosis import DiagnosisHistory


def create_history(
	db: Session,
	user_id: int,
	symptoms: list[str],
	top_prediction: str,
	diseases: list[str],
	probabilities: list[float],
	risk_factors: list[str] | None,
):
	record = DiagnosisHistory(
		user_id=user_id,
		symptoms=json.dumps(symptoms),
		top_prediction=top_prediction,
		diseases=json.dumps(diseases),
		probabilities=json.dumps(probabilities),
		risk_factors=json.dumps(risk_factors) if risk_factors is not None else None,
	)
	db.add(record)
	db.commit()
	db.refresh(record)
	return record


def list_history_by_user(db: Session, user_id: int):
	return (
		db.query(DiagnosisHistory)
		.filter(DiagnosisHistory.user_id == user_id)
		.order_by(DiagnosisHistory.created_at.desc())
		.all()
	)


def delete_history_by_user(db: Session, user_id: int):
	return (
		db.query(DiagnosisHistory)
		.filter(DiagnosisHistory.user_id == user_id)
		.delete(synchronize_session=False)
	)
