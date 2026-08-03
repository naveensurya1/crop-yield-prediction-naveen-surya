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


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
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