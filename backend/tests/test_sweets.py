from fastapi.testclient import TestClient
from main import app
import uuid

client = TestClient(app)

def get_auth_token():
    username = f"admin_{uuid.uuid4()}"
    client.post("/api/auth/register", json={
        "username": username,
        "email": f"{username}@example.com",
        "password": "password"
    })
    response = client.post("/api/auth/login", json={
        "username": username,
        "password": "password"
    })
    return response.json()["access_token"]

def test_create_sweet():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    payload = {
        "name": "Super Sour Gummy",
        "category": "Gummies",
        "price": 2.50,
        "quantity": 100
    }

    response = client.post("/api/sweets", json=payload, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Super Sour Gummy"
    assert data["quantity"] == 100

def test_create_sweet_unauthorized():
    payload = {"name": "Candy", "category": "Test", "price": 1.0, "quantity": 10}
    response = client.post("/api/sweets", json=payload)
    assert response.status_code == 401