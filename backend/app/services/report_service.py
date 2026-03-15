import io

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


def generate_diagnosis_report(data: dict) -> io.BytesIO:
	if "diseases" not in data or "probabilities" not in data:
		raise ValueError("diseases and probabilities are required")

	diseases = data["diseases"]
	probabilities = data["probabilities"]
	if not isinstance(diseases, list) or not isinstance(probabilities, list):
		raise ValueError("diseases and probabilities must be lists")
	if len(diseases) != len(probabilities):
		raise ValueError("diseases and probabilities length mismatch")

	buffer = io.BytesIO()
	pdf = canvas.Canvas(buffer, pagesize=letter)
	y = 750

	pdf.setFont("Helvetica-Bold", 16)
	pdf.drawString(200, y, "Medical Diagnosis Report")
	y -= 40

	pdf.setFont("Helvetica", 12)
	for disease, probability in zip(diseases, probabilities):
		try:
			percentage = round(float(probability) * 100, 2)
		except (TypeError, ValueError):
			raise ValueError("probabilities must be numeric") from None
		pdf.drawString(100, y, f"{disease} : {percentage}%")
		y -= 20

	pdf.save()
	buffer.seek(0)
	return buffer
