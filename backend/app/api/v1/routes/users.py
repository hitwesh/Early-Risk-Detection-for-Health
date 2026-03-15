from fastapi import APIRouter, Depends

from app.core.security import get_current_user
from app.models.user import User
from app.schemas.diagnosis_schema import DiagnosisHistoryOut
from app.services.diagnosis_service import get_history_for_user
from app.db.deps import get_db
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
	return {
		"id": current_user.id,
		"email": current_user.email,
		"role": current_user.role,
	}


@router.get("/me/history", response_model=list[DiagnosisHistoryOut])
def get_my_history(
	current_user: User = Depends(get_current_user),
	db: Session = Depends(get_db),
):
	return get_history_for_user(db, current_user.id)
