from sqlalchemy.orm import Session

from app.core.exceptions import APIException
from app.core.security import create_access_token, hash_password, verify_password
from app.repositories.user_repo import create_user, get_user_by_email


def register_user(db: Session, email: str, password: str):
	existing = get_user_by_email(db, email)
	if existing:
		raise APIException("User already exists", 409)

	try:
		hashed = hash_password(password)
	except ValueError as exc:
		raise APIException(str(exc), 400) from exc
	return create_user(db, email, hashed)


def login_user(db: Session, email: str, password: str):
	user = get_user_by_email(db, email)
	if not user:
		raise APIException("User not found", 404)

	if not verify_password(password, user.password):
		raise APIException("Invalid password", 401)

	token = create_access_token({"user_id": user.id})
	return {"access_token": token}
