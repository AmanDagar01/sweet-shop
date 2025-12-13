from pydantic import BaseModel, ConfigDict

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    model_config = ConfigDict(from_attributes=True)
    
class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    
class SweetCreate(BaseModel):
    name: str
    category: str
    price: float
    quantity: int

class SweetResponse(SweetCreate):
    id: int
    
    model_config = ConfigDict(from_attributes=True)