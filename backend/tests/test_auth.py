from fastapi.testclient import TestClient
from main import app
import uuid

client = TestClient(app)

import uuid # Add this import

def test_register_user():
    # Generate a random email so the test always passes
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
    # 1. Register a user first
    unique_email = f"login_{uuid.uuid4()}@example.com"
    unique_user = f"login_{uuid.uuid4()}"
    
    register_payload = {
        "username": unique_user,
        "email": unique_email,
        "password": "mypassword"
    }
    client.post("/api/auth/register", json=register_payload)

    # 2. Try to log in
    login_payload = {
        "username": unique_user,
        "password": "mypassword"
    }
    
    response = client.post("/api/auth/login", json=login_payload)
    
    # 3. Assertions
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"