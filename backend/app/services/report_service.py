import io

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


def _coerce_percentage(value) -> float:
	try:
		probability = float(value)
	except (TypeError, ValueError):
		raise ValueError("probabilities must be numeric") from None
	if probability <= 1:
		return round(probability * 100, 2)
	return round(probability, 2)


def _validate_predictions(diseases, probabilities):
	if not isinstance(diseases, list) or not isinstance(probabilities, list):
		raise ValueError("diseases and probabilities must be lists")
	if len(diseases) != len(probabilities):
		raise ValueError("diseases and probabilities length mismatch")


def _ensure_space(pdf, y, required):
	if y - required < 70:
		pdf.showPage()
		return 750
	return y


def _draw_header(pdf, title: str, user_label: str | None, created_at: str | None):
	y = 760
	pdf.setFont("Helvetica-Bold", 16)
	pdf.drawString(60, y, title)
	y -= 24
	pdf.setFont("Helvetica", 11)
	if user_label:
		pdf.drawString(60, y, f"User: {user_label}")
		y -= 16
	if created_at:
		pdf.drawString(60, y, f"Generated: {created_at}")
		y -= 16
	return y


def _draw_symptoms(pdf, y, symptoms: list[str] | None):
	if not symptoms:
		return y
	y = _ensure_space(pdf, y, 40)
	pdf.setFont("Helvetica-Bold", 12)
	pdf.drawString(60, y, "Symptoms")
	y -= 18
	pdf.setFont("Helvetica", 11)
	wrapped = ", ".join(symptoms)
	pdf.drawString(60, y, wrapped)
	y -= 18
	return y


def _draw_risk_factors(pdf, y, risk_factors: list[str] | None):
	if not risk_factors:
		return y
	y = _ensure_space(pdf, y, 40)
	pdf.setFont("Helvetica-Bold", 12)
	pdf.drawString(60, y, "Risk Factors")
	y -= 18
	pdf.setFont("Helvetica", 11)
	pdf.drawString(60, y, ", ".join(risk_factors))
	y -= 18
	return y


def _draw_predictions(pdf, y, diseases: list[str], probabilities: list[float]):
	y = _ensure_space(pdf, y, 60)
	pdf.setFont("Helvetica-Bold", 12)
	pdf.drawString(60, y, "Predictions")
	y -= 18
	pdf.setFont("Helvetica", 11)
	for disease, probability in zip(diseases, probabilities):
		percentage = _coerce_percentage(probability)
		pdf.drawString(70, y, f"{disease}: {percentage}%")
		y -= 16
		y = _ensure_space(pdf, y, 24)
	return y


def generate_diagnosis_report(data: dict) -> io.BytesIO:
	if "diseases" not in data or "probabilities" not in data:
		raise ValueError("diseases and probabilities are required")

	diseases = data["diseases"]
	probabilities = data["probabilities"]
	_validate_predictions(diseases, probabilities)

	buffer = io.BytesIO()
	pdf = canvas.Canvas(buffer, pagesize=letter)
	y = _draw_header(pdf, "Medical Diagnosis Report", None, None)
	if data.get("symptoms"):
		y = _draw_symptoms(pdf, y, data.get("symptoms"))
	if data.get("risk_factors"):
		y = _draw_risk_factors(pdf, y, data.get("risk_factors"))
	_draw_predictions(pdf, y, diseases, probabilities)

	pdf.save()
	buffer.seek(0)
	return buffer


def generate_history_report(history: dict, user_label: str | None = None) -> io.BytesIO:
	if "diseases" not in history or "probabilities" not in history:
		raise ValueError("diseases and probabilities are required")

	diseases = history["diseases"]
	probabilities = history["probabilities"]
	_validate_predictions(diseases, probabilities)

	buffer = io.BytesIO()
	pdf = canvas.Canvas(buffer, pagesize=letter)
	y = _draw_header(
		pdf,
		"Medical Diagnosis Report",
		user_label,
		history.get("created_at"),
	)
	y = _draw_symptoms(pdf, y, history.get("symptoms"))
	y = _draw_risk_factors(pdf, y, history.get("risk_factors"))
	_draw_predictions(pdf, y, diseases, probabilities)

	pdf.save()
	buffer.seek(0)
	return buffer


def generate_history_bundle_report(
	histories: list[dict],
	user_label: str | None = None,
) -> io.BytesIO:
	buffer = io.BytesIO()
	pdf = canvas.Canvas(buffer, pagesize=letter)
	for idx, history in enumerate(histories):
		if "diseases" not in history or "probabilities" not in history:
			continue
		diseases = history["diseases"]
		probabilities = history["probabilities"]
		_validate_predictions(diseases, probabilities)
		y = _draw_header(
			pdf,
			f"Diagnosis Report #{idx + 1}",
			user_label,
			history.get("created_at"),
		)
		y = _draw_symptoms(pdf, y, history.get("symptoms"))
		y = _draw_risk_factors(pdf, y, history.get("risk_factors"))
		_draw_predictions(pdf, y, diseases, probabilities)
		if idx < len(histories) - 1:
			pdf.showPage()

	pdf.save()
	buffer.seek(0)
	return buffer
