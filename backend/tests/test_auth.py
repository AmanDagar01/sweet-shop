from fastapi.testclient import TestClient
from main import app
import uuid
import uuid

client = TestClient(app)

def test_register_user():
    random_email = f"test_{uuid.uuid4()}@example.com"
    
    payload = {
        "username": f"user_{uuid.uuid4()}",
        "email": random_email,
        "password": "password123"
    }

    response = client.post("/api/auth/register", json=payload)

    assert response.status_code == 201
    data = response.json()
    assert data["email"] == random_email
    assert "id" in data
    assert "password" not in data
    
def test_login_user():
    unique_email = f"login_{uuid.uuid4()}@example.com"
    unique_user = f"login_{uuid.uuid4()}"
    
    register_payload = {
        "username": unique_user,
        "email": unique_email,
        "password": "mypassword"
    }
    client.post("/api/auth/register", json=register_payload)

    login_payload = {
        "username": unique_user,
        "password": "mypassword"
    }
    
    response = client.post("/api/auth/login", json=login_payload)
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"