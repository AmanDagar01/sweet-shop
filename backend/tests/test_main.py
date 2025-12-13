from fastapi.testclient import TestClient

from main import app 

client = TestClient(app)

def test_health_check():
    """
    Test that the health check endpoint returns 200 OK and correct JSON.
    """
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}