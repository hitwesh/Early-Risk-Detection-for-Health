from pydantic import BaseModel, Field


class DiagnosisRequest(BaseModel):
	symptoms: list[str] = Field(..., min_items=1)
	age: int = Field(..., ge=0, le=120)
	sex: str
	bmi: float = Field(..., ge=10, le=60)
	smoking: bool
	alcohol: bool


class DiagnosisResponse(BaseModel):
	diseases: list[str]
	probabilities: list[float]


class DiagnosisAnswerRequest(BaseModel):
	session_id: str
	symptom: str
	answer: bool
