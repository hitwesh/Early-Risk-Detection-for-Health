from fastapi import APIRouter

from app.ai.diagnosis_engine import run_diagnosis
from app.schemas.diagnosis_schema import DiagnosisRequest, DiagnosisResponse

router = APIRouter(prefix="/diagnosis", tags=["Diagnosis"])


@router.post("/predict", response_model=DiagnosisResponse)
def predict_disease(data: DiagnosisRequest):
	result = run_diagnosis(
		symptoms=data.symptoms,
		risk_factors=data.dict(),
	)

	return result
