from fastapi.testclient import TestClient
from main import app
import uuid

client = TestClient(app)

def get_auth_token():
    username = f"buyer_{uuid.uuid4()}"
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

def test_purchase_sweet():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}

    sweet_payload = {
        "name": "Limited Edition Chocolate",
        "category": "Chocolates",
        "price": 5.0,
        "quantity": 1
    }
    create_res = client.post("/api/sweets", json=sweet_payload, headers=headers)
    sweet_id = create_res.json()["id"]

    purchase_res = client.post(f"/api/sweets/{sweet_id}/purchase", headers=headers)
    assert purchase_res.status_code == 200
    assert purchase_res.json()["message"] == "Purchase successful"
    assert purchase_res.json()["remaining_quantity"] == 0

    fail_res = client.post(f"/api/sweets/{sweet_id}/purchase", headers=headers)
    assert fail_res.status_code == 400
    assert "Out of stock" in fail_res.json()["detail"]