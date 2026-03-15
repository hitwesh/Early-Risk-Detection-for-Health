from datetime import timezone

from fastapi import APIRouter, Depends
from sqlalchemy import distinct, func
from sqlalchemy.orm import Session

from app.core.security import get_current_admin
from app.db.deps import get_db
from app.models.diagnosis import DiagnosisHistory
from app.models.user import User
from app.schemas.diagnosis_schema import AdminStatsOut, AdminUserHistoryOut
from app.services.diagnosis_service import get_history_for_user

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats", response_model=AdminStatsOut)
def get_admin_stats(
	current_admin: User = Depends(get_current_admin),
	db: Session = Depends(get_db),
):
	total_users = db.query(User).count()
	total_diagnoses = db.query(DiagnosisHistory).count()
	users_with_diagnoses = db.query(distinct(DiagnosisHistory.user_id)).count()
	latest = db.query(func.max(DiagnosisHistory.created_at)).scalar()
	latest_iso = None
	if latest is not None:
		if latest.tzinfo is None:
			latest = latest.replace(tzinfo=timezone.utc)
		latest_iso = latest.isoformat()

	return {
		"total_users": total_users,
		"total_diagnoses": total_diagnoses,
		"users_with_diagnoses": users_with_diagnoses,
		"latest_diagnosis_at": latest_iso,
	}


@router.get("/users", response_model=list[AdminUserHistoryOut])
def get_admin_users(
	current_admin: User = Depends(get_current_admin),
	db: Session = Depends(get_db),
):
	users = db.query(User).order_by(User.id).all()
	results = []
	for user in users:
		history = get_history_for_user(db, user.id)
		latest = history[0]["created_at"] if history else None
		results.append(
			{
				"id": user.id,
				"email": user.email,
				"role": user.role,
				"total_diagnoses": len(history),
				"latest_diagnosis_at": latest,
				"history": history,
			}
		)

	return results
