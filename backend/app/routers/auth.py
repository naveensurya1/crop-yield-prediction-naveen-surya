from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Role
from app.schemas import UserRegister, UserResponse
from app.security import hash_password


from fastapi import HTTPException
from app.schemas import UserLogin, TokenResponse
from app.security import verify_password
from app.jwt_handler import create_access_token
from app.models import User

from app.role_checker import require_role

from app.dependencies import get_current_user


import os
import secrets
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from app.schemas import GoogleLoginRequest


from app.schemas import GoogleLoginRequest, GoogleCompleteRequest

from app.config import settings

GOOGLE_CLIENT_ID = settings.GOOGLE_CLIENT_ID


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


def _verify_google_token(token: str):

    try:
        return id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            GOOGLE_CLIENT_ID
        )
    except ValueError:
        raise HTTPException(
            status_code=401,
            detail="Invalid Google token."
        )


@router.post("/register", response_model=UserResponse)
def register_user(
    user: UserRegister,
    db: Session = Depends(get_db)
):

    # Check whether email already exists
    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered."
        )

    # Find the selected role
    role = (
        db.query(Role)
        .filter(Role.role_name == user.role)
        .first()
    )

    if role is None:
        raise HTTPException(
            status_code=404,
            detail="Role not found."
        )

    # Check if the role is allowed for self registration
    if not role.can_self_register:
        raise HTTPException(
            status_code=403,
            detail="You cannot register with this role."
        )

    # Hash the password
    hashed_password = hash_password(user.password)

    # Create user
    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password_hash=hashed_password,
        role_id=role.role_id
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return UserResponse(
        user_id=new_user.user_id,
        full_name=new_user.full_name,
        email=new_user.email,
        role=role.role_name
    )


@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    db_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    if not verify_password(
        user.password,
        db_user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    access_token = create_access_token(
        {
            "sub": db_user.email,
            "role": db_user.role.role_name
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": db_user.role.role_name
    }


@router.post("/google")
def google_login(
    payload: GoogleLoginRequest,
    db: Session = Depends(get_db)
):

    idinfo = _verify_google_token(payload.token)

    email = idinfo.get("email")
    google_id = idinfo.get("sub")

    if not email:
        raise HTTPException(status_code=400, detail="Google account has no email.")

    # Look up by google_id first — the stable identifier
    db_user = db.query(User).filter(User.google_id == google_id).first()

    # Fall back to email — covers someone who registered normally, then later
    # signs in with Google using the same address. Link the accounts instead
    # of creating a duplicate (email is unique, so a duplicate would just error).
    if not db_user:

        db_user = db.query(User).filter(User.email == email).first()

        if db_user:
            db_user.google_id = google_id
            db_user.email_verified = True
            if not db_user.avatar_url:
                db_user.avatar_url = idinfo.get("picture")
            db.commit()

    if db_user:

        access_token = create_access_token(
            {"sub": db_user.email, "role": db_user.role.role_name}
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "role": db_user.role.role_name
        }

    # Genuinely new — ask the frontend to collect a role
    return {
        "new_user": True,
        "email": email,
        "full_name": idinfo.get("name", "")
    }

@router.post("/google/complete", response_model=TokenResponse)
def google_complete(
    payload: GoogleCompleteRequest,
    db: Session = Depends(get_db)
):

    idinfo = _verify_google_token(payload.token)

    email = idinfo.get("email")
    google_id = idinfo.get("sub")

    if not email:
        raise HTTPException(status_code=400, detail="Google account has no email.")

    existing_user = db.query(User).filter(
        (User.google_id == google_id) | (User.email == email)
    ).first()

    if existing_user:

        existing_user.google_id = google_id
        existing_user.email_verified = True
        db.commit()

        access_token = create_access_token(
            {"sub": existing_user.email, "role": existing_user.role.role_name}
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "role": existing_user.role.role_name
        }

    role = db.query(Role).filter(Role.role_name == payload.role).first()

    if role is None:
        raise HTTPException(status_code=404, detail="Role not found.")

    if not role.can_self_register:
        raise HTTPException(status_code=403, detail="You cannot register with this role.")

    new_user = User(
        full_name=idinfo.get("name") or email.split("@")[0],
        email=email,
        password_hash=None,
        google_id=google_id,
        auth_provider="google",
        avatar_url=idinfo.get("picture"),
        email_verified=True,
        role_id=role.role_id
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(
        {"sub": new_user.email, "role": role.role_name}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": role.role_name
    }

@router.get("/admin-dashboard")
def admin_dashboard(
    current_user=Depends(require_role("Admin"))
):

    return {
        "message": "Welcome Admin!"
    }


@router.get("/farmer-dashboard")
def farmer_dashboard(
    current_user=Depends(require_role("Farmer"))
):

    return {
        "message": f"Welcome {current_user.full_name}"
    }



@router.get("/me")
def get_me(current_user=Depends(get_current_user)):
    return {
        "id": current_user.user_id,
        "name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role.role_name
    }