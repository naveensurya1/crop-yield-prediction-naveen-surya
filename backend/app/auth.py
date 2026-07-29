from datetime import datetime, timedelta

from fastapi import APIRouter, HTTPException
from jose import jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "change-this-to-a-real-secret"  
ALGORITHM = "HS256"
TOKEN_EXPIRE_MINUTES = 60


fake_users_db = {
    "farmer@example.com": {
        "email": "farmer@example.com",
        "hashed_password": pwd_context.hash("password123"),
    }
}


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str


def create_access_token(email: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=TOKEN_EXPIRE_MINUTES)
    payload = {"sub": email, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/login")
def login(data: LoginRequest):
    user = fake_users_db.get(data.email)
    if not user or not pwd_context.verify(data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(user["email"])
    return {"access_token": token, "token_type": "bearer"}


@router.post("/register")
def register(data: RegisterRequest):
    if data.email in fake_users_db:
        raise HTTPException(status_code=400, detail="Email already registered")

    fake_users_db[data.email] = {
        "email": data.email,
        "hashed_password": pwd_context.hash(data.password),
    }
    return {"message": "Account created"}