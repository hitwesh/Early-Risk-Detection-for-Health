import json
from datetime import timezone

from sqlalchemy.orm import Session

from app.repositories.diagnosis_repo import (
	create_history,
	get_history_by_user_and_id,
	list_history_by_user,
)


RISK_FACTOR_KEYS = [
	"diabetes",
	"hypertension",
	"smoking",
	"alcohol",
	"family_heart_disease",
	"recent_infection",
	"pregnancy",
	"chronic_disease",
]


def build_risk_factor_map(risk_factor_data: dict | None):
	if not risk_factor_data:
		return {key: False for key in RISK_FACTOR_KEYS}
	return {key: bool(risk_factor_data.get(key, False)) for key in RISK_FACTOR_KEYS}


def _normalize_risk_factors(raw_value):
	if raw_value is None:
		return None
	if isinstance(raw_value, dict):
		return {key: bool(raw_value.get(key, False)) for key in RISK_FACTOR_KEYS}
	if isinstance(raw_value, list):
		raw_set = set(raw_value)
		return {key: key in raw_set for key in RISK_FACTOR_KEYS}
	return None


def create_history_for_user(
	db: Session,
	user_id: int,
	symptoms: list[str],
	prediction: dict,
	risk_factor_data: dict | None = None,
):
	diseases = prediction.get("diseases", [])
	probabilities = prediction.get("probabilities", [])
	top_prediction = diseases[0] if diseases else "Unknown"
	risk_factors = build_risk_factor_map(risk_factor_data)

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
		created_at = record.created_at
		if created_at.tzinfo is None:
			created_at = created_at.replace(tzinfo=timezone.utc)
		results.append(
			{
				"id": record.id,
				"symptoms": json.loads(record.symptoms),
				"top_prediction": record.top_prediction,
				"diseases": json.loads(record.diseases),
				"probabilities": json.loads(record.probabilities),
				"risk_factors": _normalize_risk_factors(
					json.loads(record.risk_factors) if record.risk_factors else None
				),
				"created_at": created_at.isoformat(),
			}
		)
	return results


def get_history_entry_for_user(db: Session, user_id: int, history_id: int):
	record = get_history_by_user_and_id(db, user_id, history_id)
	if record is None:
		return None
	created_at = record.created_at
	if created_at.tzinfo is None:
		created_at = created_at.replace(tzinfo=timezone.utc)
	return {
		"id": record.id,
		"symptoms": json.loads(record.symptoms),
		"top_prediction": record.top_prediction,
		"diseases": json.loads(record.diseases),
		"probabilities": json.loads(record.probabilities),
		"risk_factors": _normalize_risk_factors(
			json.loads(record.risk_factors) if record.risk_factors else None
		),
		"created_at": created_at.isoformat(),
	}
