from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import User, Role
from app.schemas import AdminUserCreate, AdminUserOut, DashboardStats, ActivityItem
from app.security import hash_password
from app.role_checker import require_role

# Every route in this router requires an authenticated Admin — the
# dependency runs before any handler below, so individual routes don't
# need to repeat it.
router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    dependencies=[Depends(require_role("Admin"))],
)


def _user_status(user: User) -> str:
    if not user.is_active:
        return "suspended"
    if user.auth_provider == "local" and not user.email_verified:
        return "pending"
    return "active"


def _to_admin_user_out(user: User) -> AdminUserOut:
    return AdminUserOut(
        id=user.user_id,
        name=user.full_name,
        email=user.email,
        role=user.role.role_name.lower(),
        status=_user_status(user),
        registered=user.created_at.date().isoformat() if user.created_at else "",
    )


@router.get("/users", response_model=list[AdminUserOut])
def list_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [_to_admin_user_out(u) for u in users]


@router.post("/users", response_model=AdminUserOut)
def create_admin_user(payload: AdminUserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered.")

    role = (
        db.query(Role)
        .filter(func.lower(Role.role_name) == payload.role.lower())
        .first()
    )
    if role is None:
        raise HTTPException(status_code=404, detail="Role not found.")

    new_user = User(
        full_name=payload.full_name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role_id=role.role_id,
        auth_provider="local",
        # Admin sets the password directly (no email invite flow), so
        # there's nothing left for the new admin to verify.
        email_verified=True,
        is_active=True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return _to_admin_user_out(new_user)


@router.get("/dashboard/stats", response_model=DashboardStats)
def dashboard_stats(db: Session = Depends(get_db)):
    total_farmers = (
        db.query(User)
        .join(Role)
        .filter(func.lower(Role.role_name) == "farmer")
        .count()
    )

    # Predictions / crops / weather alerts don't have tables yet in this
    # codebase — returning 0 rather than inventing numbers. Wire these up
    # for real once those models exist.
    return DashboardStats(
        totalFarmers=total_farmers,
        farmersDelta="",
        predictionsToday=0,
        predictionsDelta="Not tracked yet",
        registeredCrops=0,
        cropsDelta="Not tracked yet",
        weatherAlerts=0,
        alertsDelta="Not tracked yet",
    )


@router.get("/dashboard/activity", response_model=list[ActivityItem])
def dashboard_activity(db: Session = Depends(get_db)):
    # No activity/audit-log table yet — empty list until one exists,
    # rather than fabricating entries.
    return []