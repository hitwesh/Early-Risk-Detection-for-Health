def test_diagnosis_start(client):
	response = client.post("/diagnosis/start")

	assert response.status_code == 200

	data = response.json()

	assert "session_id" in data
	assert "question" in data
