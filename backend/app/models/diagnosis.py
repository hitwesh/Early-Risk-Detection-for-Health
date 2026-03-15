from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text

from app.db.base import Base


class DiagnosisHistory(Base):
	__tablename__ = "diagnosis_history"

	id = Column(Integer, primary_key=True, index=True)
	user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
	created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
	symptoms = Column(Text, nullable=False)
	top_prediction = Column(String, nullable=False)
	diseases = Column(Text, nullable=False)
	probabilities = Column(Text, nullable=False)
	risk_factors = Column(Text, nullable=True)
