from typing import Optional

from pydantic import BaseModel, Field


class DiagnosisRequest(BaseModel):
	symptoms: list[str] = Field(..., min_length=1)
	age: int = Field(..., ge=0, le=120)
	sex: str
	bmi: float = Field(..., ge=10, le=60)
	bp: Optional[int] = Field(None, ge=70, le=220)
	blood_sugar: Optional[int] = Field(None, ge=40, le=600)
	diabetes: Optional[bool] = None
	hypertension: Optional[bool] = None
	smoking: bool
	alcohol: bool
	family_heart_disease: Optional[bool] = None
	recent_infection: Optional[bool] = None
	pregnancy: Optional[bool] = None
	chronic_disease: Optional[bool] = None


class DiagnosisResponse(BaseModel):
	diseases: list[str]
	probabilities: list[float]
	key_symptoms: Optional[list[str]] = None
	risk_factors: Optional[list[str]] = None
	elapsed_seconds: Optional[float] = None


class DiagnosisAnswerRequest(BaseModel):
	session_id: str
	symptom: str
	answer: bool


class DiagnosisStartRequest(BaseModel):
	age: Optional[int] = Field(None, ge=0, le=120)
	sex: Optional[str] = None
	bmi: Optional[float] = Field(None, ge=10, le=60)
	bp: Optional[int] = Field(None, ge=70, le=220)
	blood_sugar: Optional[int] = Field(None, ge=40, le=600)
	diabetes: Optional[bool] = None
	hypertension: Optional[bool] = None
	smoking: Optional[bool] = None
	alcohol: Optional[bool] = None
	family_heart_disease: Optional[bool] = None
	recent_infection: Optional[bool] = None
	pregnancy: Optional[bool] = None
	chronic_disease: Optional[bool] = None
	use_bayes_engine: bool = False
	max_questions: int = Field(12, ge=1, le=50)
	min_cases: int = Field(40, ge=1)
	confidence_stop: float = Field(0.95, ge=0.5, le=1.0)


class DiagnosisAnswerResponse(BaseModel):
	finished: bool
	question: Optional[str] = None
	symptom: Optional[str] = None
	step: int
	remaining_cases: int
	engine: Optional[str] = None
	predictions: Optional[DiagnosisResponse] = None
	positive_symptoms: Optional[list[str]] = None
	elapsed_seconds: Optional[float] = None
