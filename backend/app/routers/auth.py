from fastapi import APIRouter
from ..schemas import LoginRequest, LoginResponse

router = APIRouter(prefix="/auth", tags=["auth"])

FAKE_USERS = {
    "admin@hireflow.ai": "admin123",
    "demo@hireflow.ai": "demo123",
}


@router.post("/login", response_model=LoginResponse)
def login(body: LoginRequest):
    # Fake auth — always succeeds for MVP
    return LoginResponse(token="fake-jwt-token", email=body.email)
