def test_health(client):
	response = client.get("/health")

	assert response.status_code == 200

	data = response.json()

	assert data["success"] is True
	assert data["data"]["status"] == "ok"
