from pydantic import BaseModel


class DiagnosisRequest(BaseModel):
	symptoms: list[str]
	age: int
	sex: str
	bmi: float
	smoking: bool
	alcohol: bool


class DiagnosisResponse(BaseModel):
	diseases: list[str]
	probabilities: list[float]
