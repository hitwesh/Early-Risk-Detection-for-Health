from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.user import User


def get_user_by_email(db: Session, email: str):
	return (
		db.query(User)
		.filter(User.email == email, User.is_active == True)
		.first()
	)


def create_user(db: Session, email: str, password: str):
	user = User(email=email, password=password)
	db.add(user)
	db.commit()
	db.refresh(user)
	return user


def delete_user(db: Session, user: User):
	user.is_active = False
	user.deleted_at = datetime.now(timezone.utc)
	db.add(user)
	db.commit()
