from fastapi import APIRouter, HTTPException

from app.ai.diagnosis_engine import predict_from_vector, run_diagnosis
from app.ai.model_loader import get_model
from app.schemas.diagnosis_schema import DiagnosisAnswerRequest, DiagnosisRequest, DiagnosisResponse
from app.services.diagnosis_session import (
	create_session,
	get_next_symptom,
	get_session,
	update_symptom,
)

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


@router.post("/start")
def start_diagnosis():
	artifacts = get_model()
	idx, symptom = get_next_symptom(artifacts.symptom_names, set())
	if symptom is None:
		raise HTTPException(status_code=400, detail="No symptoms available")

	session_id = create_session(artifacts.symptom_names)
	question = f"Do you have {symptom.replace('_', ' ')}?"

	return {
		"session_id": session_id,
		"question": question,
		"symptom": symptom,
	}


@router.post("/answer")
def answer_question(req: DiagnosisAnswerRequest):
	artifacts = get_model()
	session = get_session(req.session_id)
	if session is None:
		raise HTTPException(status_code=404, detail="Session not found")

	try:
		symptom_index = artifacts.symptom_names.index(req.symptom)
	except ValueError as exc:
		raise HTTPException(status_code=400, detail="Unknown symptom") from exc

	if symptom_index in session["asked"]:
		raise HTTPException(status_code=400, detail="Symptom already answered")

	update_symptom(req.session_id, symptom_index, req.answer)

	idx, symptom = get_next_symptom(artifacts.symptom_names, session["asked"])
	if symptom is None:
		raise HTTPException(status_code=400, detail="No more questions available")

	question = f"Do you have {symptom.replace('_', ' ')}?"
	return {
		"question": question,
		"symptom": symptom,
	}


@router.get("/result", response_model=DiagnosisResponse)
def get_result(session_id: str):
	session = get_session(session_id)
	if session is None:
		raise HTTPException(status_code=404, detail="Session not found")

	return predict_from_vector(session["vector"], {})
