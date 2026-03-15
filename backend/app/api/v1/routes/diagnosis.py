import time

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.ai.diagnosis_engine import normalize_symptom, predict_from_vector, run_diagnosis
from app.ai.model_loader import get_model
from app.schemas.diagnosis_schema import (
	DiagnosisAnswerRequest,
	DiagnosisAnswerResponse,
	DiagnosisRequest,
	DiagnosisResponse,
	DiagnosisStartRequest,
)
from app.services.diagnosis_session import (
	CONFIDENCE_STOP,
	MAX_QUESTIONS,
	MIN_CASES,
	create_session,
	get_next_symptom,
	get_session,
	is_session_finished,
	update_symptom,
)
from app.services.report_service import generate_diagnosis_report

router = APIRouter(prefix="/diagnosis", tags=["Diagnosis"])


@router.post("/predict", response_model=DiagnosisResponse)
def predict_disease(data: DiagnosisRequest):
	if len(data.symptoms) == 0:
		raise HTTPException(status_code=400, detail="At least one symptom must be provided")
	normalized_symptoms = [normalize_symptom(symptom) for symptom in data.symptoms]
	result = run_diagnosis(
		symptoms=normalized_symptoms,
		risk_factors=data.dict(),
	)

	return result


@router.post("/start")
def start_diagnosis(payload: DiagnosisStartRequest | None = None):
	artifacts = get_model()
	risk_factors = {}
	use_bayes_engine = False
	max_questions = None
	min_cases = None
	confidence_stop = None
	if payload is not None:
		payload_data = payload.dict(exclude_none=True)
		use_bayes_engine = payload_data.pop("use_bayes_engine", False)
		max_questions = payload_data.pop("max_questions", None)
		min_cases = payload_data.pop("min_cases", None)
		confidence_stop = payload_data.pop("confidence_stop", None)
		risk_factors = payload_data

	session_id = create_session(
		artifacts.symptom_names,
		artifacts.disease_labels,
		use_bayes_engine=use_bayes_engine,
		max_questions=max_questions if max_questions is not None else MAX_QUESTIONS,
		min_cases=min_cases if min_cases is not None else MIN_CASES,
		confidence_stop=confidence_stop if confidence_stop is not None else CONFIDENCE_STOP,
		risk_factors=risk_factors,
	)
	session = get_session(session_id)
	idx, symptom, _engine = get_next_symptom(session, artifacts.symptom_names)
	if symptom is None:
		raise HTTPException(status_code=400, detail="No symptoms available")
	question = f"Do you have {symptom.replace('_', ' ')}?"

	return {
		"session_id": session_id,
		"question": question,
		"symptom": symptom,
	}


@router.post("/answer", response_model=DiagnosisAnswerResponse)
def answer_question(req: DiagnosisAnswerRequest):
	artifacts = get_model()
	session = get_session(req.session_id)
	if session is None:
		raise HTTPException(status_code=404, detail="Session not found")

	try:
		normalized_symptom = normalize_symptom(req.symptom)
		symptom_index = artifacts.symptom_names.index(normalized_symptom)
	except ValueError as exc:
		raise HTTPException(status_code=400, detail="Unknown symptom") from exc

	if symptom_index in session["asked"]:
		raise HTTPException(status_code=400, detail="Symptom already answered")

	update_symptom(req.session_id, symptom_index, normalized_symptom, req.answer)
	prediction = predict_from_vector(session["vector"], session["risk_factors"])
	max_probability = max(prediction["probabilities"]) if prediction["probabilities"] else 0.0
	if is_session_finished(session, len(artifacts.symptom_names), max_probability=max_probability):
		return {
			"finished": True,
			"step": session["questions_asked"],
			"remaining_cases": len(session["X"]),
			"engine": session.get("last_engine"),
			"predictions": prediction,
			"positive_symptoms": session["positive_symptoms"],
			"elapsed_seconds": time.time() - session["started_at"],
		}

	idx, symptom, engine = get_next_symptom(session, artifacts.symptom_names)
	if symptom is None:
		return {
			"finished": True,
			"step": session["questions_asked"],
			"remaining_cases": len(session["X"]),
			"engine": session.get("last_engine"),
			"predictions": prediction,
			"positive_symptoms": session["positive_symptoms"],
			"elapsed_seconds": time.time() - session["started_at"],
		}

	question = f"Do you have {symptom.replace('_', ' ')}?"
	return {
		"finished": False,
		"question": question,
		"symptom": symptom,
		"step": session["questions_asked"],
		"remaining_cases": len(session["X"]),
		"engine": engine,
		"predictions": prediction,
		"positive_symptoms": session["positive_symptoms"],
		"elapsed_seconds": time.time() - session["started_at"],
	}


@router.get("/result", response_model=DiagnosisResponse)
def get_result(session_id: str):
	session = get_session(session_id)
	if session is None:
		raise HTTPException(status_code=404, detail="Session not found")

	result = predict_from_vector(session["vector"], session["risk_factors"])
	result["elapsed_seconds"] = time.time() - session["started_at"]
	return result


@router.post("/report")
def generate_report(result: dict):
	try:
		pdf = generate_diagnosis_report(result)
	except ValueError as exc:
		raise HTTPException(status_code=400, detail=str(exc)) from exc

	return StreamingResponse(
		pdf,
		media_type="application/pdf",
		headers={
			"Content-Disposition": "attachment; filename=diagnosis_report.pdf",
		},
	)
