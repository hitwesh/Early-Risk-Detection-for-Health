from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.schemas.user_schema import UserLogin, UserRegister
from app.services.user_service import login_user, register_user

router = APIRouter()


@router.post("/register")
def register(data: UserRegister, db: Session = Depends(get_db)):
	return register_user(db, data.email, data.password)


@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
	return login_user(db, data.email, data.password)
