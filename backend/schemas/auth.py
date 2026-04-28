from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class LoginRequest(BaseModel):
    email: str
    password: str


class SignupRequest(BaseModel):
    email: str
    password: str
    name: str
    phone: str
    role: Optional[str] = "user"
    district: Optional[str] = ""
    state: Optional[str] = ""
    pincode: Optional[str] = ""


class UserResponse(BaseModel):
    _id: str
    email: str
    name: str
    phone: str
    role: str
    address: dict
    createdAt: Optional[str] = None

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    user: UserResponse
