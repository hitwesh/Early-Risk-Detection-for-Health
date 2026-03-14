import uuid


def test_register(client):
	unique_email = f"pytest_user_{uuid.uuid4().hex}@test.com"
	payload = {
		"email": unique_email,
		"password": "test1234",
	}

	response = client.post("/auth/register", json=payload)

	assert response.status_code == 200

	data = response.json()

	assert data["email"] == payload["email"]


def test_login(client):
	unique_email = f"pytest_login_{uuid.uuid4().hex}@test.com"
	payload = {
		"email": unique_email,
		"password": "test1234",
	}

	client.post("/auth/register", json=payload)

	response = client.post("/auth/login", json=payload)

	assert response.status_code == 200

	data = response.json()

	assert "access_token" in data
