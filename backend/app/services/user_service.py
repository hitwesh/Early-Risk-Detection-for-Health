from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.repositories.user_repo import create_user, get_user_by_email


def register_user(db: Session, email: str, password: str):
	existing = get_user_by_email(db, email)
	if existing:
		raise Exception("User already exists")

	hashed = hash_password(password)
	return create_user(db, email, hashed)


def login_user(db: Session, email: str, password: str):
	user = get_user_by_email(db, email)
	if not user:
		raise Exception("User not found")

	if not verify_password(password, user.password):
		raise Exception("Invalid password")

	token = create_access_token({"user_id": user.id})
	return {"access_token": token}
