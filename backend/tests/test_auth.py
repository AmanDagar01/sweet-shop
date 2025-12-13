from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_register_user():
    payload = {
        "username": "Aman",
        "email": "test@example.com",
        "password": "password123"
    }
    
    response = client.post("/api/auth/register", json=payload)
    
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "Aman"
    assert "id" in data
    assert "password" not in data