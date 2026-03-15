from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Integer, String

from app.db.base import Base


class User(Base):
	__tablename__ = "users"

	id = Column(Integer, primary_key=True, index=True)
	email = Column(String, unique=True, index=True)
	password = Column(String)
	role = Column(String, default="user")
	is_active = Column(Boolean, default=True)
	deleted_at = Column(DateTime(timezone=True), nullable=True)
