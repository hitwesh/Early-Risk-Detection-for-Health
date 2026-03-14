from fastapi import APIRouter, HTTPException

from app.ai.diagnosis_engine import run_diagnosis
from app.schemas.diagnosis_schema import DiagnosisRequest, DiagnosisResponse

router = APIRouter(prefix="/diagnosis", tags=["Diagnosis"])


@router.post("/predict", response_model=DiagnosisResponse)
def predict_disease(data: DiagnosisRequest):
	if len(data.symptoms) == 0:
		raise HTTPException(status_code=400, detail="At least one symptom must be provided")
	result = run_diagnosis(
		symptoms=data.symptoms,
		risk_factors=data.dict(),
	)

	return result
