from datetime import timezone

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy import distinct, func
from sqlalchemy.orm import Session

from app.core.security import get_current_admin
from app.db.deps import get_db
from app.models.diagnosis import DiagnosisHistory
from app.models.user import User
from app.schemas.diagnosis_schema import AdminStatsOut, AdminUserHistoryOut
from app.services.diagnosis_service import (
	get_history_entry_for_user,
	get_history_for_user,
)
from app.repositories.user_repo import delete_user
from app.services.report_service import (
	generate_history_bundle_report,
	generate_history_report,
)

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats", response_model=AdminStatsOut)
def get_admin_stats(
	current_admin: User = Depends(get_current_admin),
	db: Session = Depends(get_db),
):
	total_users = db.query(User).filter(User.is_active == True).count()
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
	users = db.query(User).filter(User.is_active == True).order_by(User.id).all()
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


@router.delete("/users/{user_id}")
def delete_admin_user(
	user_id: int,
	current_admin: User = Depends(get_current_admin),
	db: Session = Depends(get_db),
):
	if user_id == current_admin.id:
		raise HTTPException(status_code=400, detail="Cannot delete your own account")

	user = db.query(User).filter(User.id == user_id).first()
	if user is None:
		raise HTTPException(status_code=404, detail="User not found")
	if not user.is_active:
		raise HTTPException(status_code=400, detail="User already deleted")

	delete_user(db, user)
	return {"status": "soft_deleted", "user_id": user_id}


@router.get("/users/{user_id}/report/all")
def get_admin_user_history_report(
	user_id: int,
	current_admin: User = Depends(get_current_admin),
	db: Session = Depends(get_db),
):
	user = db.query(User).filter(User.id == user_id).first()
	if user is None:
		raise HTTPException(status_code=404, detail="User not found")

	histories = get_history_for_user(db, user_id)
	if not histories:
		raise HTTPException(status_code=404, detail="No history available")

	user_label = f"{user.email} (ID {user.id})"
	pdf = generate_history_bundle_report(histories, user_label=user_label)
	filename = f"user_{user_id}_history.pdf"
	return StreamingResponse(
		pdf,
		media_type="application/pdf",
		headers={"Content-Disposition": f"attachment; filename={filename}"},
	)


@router.get("/users/{user_id}/report/{history_id}")
def get_admin_user_report(
	user_id: int,
	history_id: int,
	current_admin: User = Depends(get_current_admin),
	db: Session = Depends(get_db),
):
	user = db.query(User).filter(User.id == user_id).first()
	if user is None:
		raise HTTPException(status_code=404, detail="User not found")

	history = get_history_entry_for_user(db, user_id, history_id)
	if history is None:
		raise HTTPException(status_code=404, detail="History record not found")

	user_label = f"{user.email} (ID {user.id})"
	pdf = generate_history_report(history, user_label=user_label)
	filename = f"user_{user_id}_report_{history_id}.pdf"
	return StreamingResponse(
		pdf,
		media_type="application/pdf",
		headers={"Content-Disposition": f"attachment; filename={filename}"},
	)
