
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator
import re

class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    password: str
    role: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, value):
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters.")

        if not re.search(r"[A-Z]", value):
            raise ValueError("Password must contain an uppercase letter.")

        if not re.search(r"[a-z]", value):
            raise ValueError("Password must contain a lowercase letter.")

        if not re.search(r"\d", value):
            raise ValueError("Password must contain a number.")

        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
            raise ValueError("Password must contain a special character.")

        return value

    

class UserResponse(BaseModel):
    user_id: int
    full_name: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True


class RoleResponse(BaseModel):
    role_id: int
    role_name: str

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleLoginRequest(BaseModel):
    token: str

class GoogleCompleteRequest(BaseModel):
    token: str
    role: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str



class AdminUserCreate(BaseModel):
    full_name: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    password: str
    role: str = "Admin"
 
    @field_validator("password")
    @classmethod
    def validate_password(cls, value):
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters.")
        if not re.search(r"[A-Z]", value):
            raise ValueError("Password must contain an uppercase letter.")
        if not re.search(r"[a-z]", value):
            raise ValueError("Password must contain a lowercase letter.")
        if not re.search(r"\d", value):
            raise ValueError("Password must contain a number.")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
            raise ValueError("Password must contain a special character.")
        return value
 
 
class AdminUserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    status: str
    registered: str
 
 
class DashboardStats(BaseModel):
    totalFarmers: int
    farmersDelta: str
    predictionsToday: int
    predictionsDelta: str
    registeredCrops: int
    cropsDelta: str
    weatherAlerts: int
    alertsDelta: str
 
 
class ActivityItem(BaseModel):
    id: int
    tag: str
    label: str
    time: str
