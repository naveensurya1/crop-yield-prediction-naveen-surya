from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Role
from app.schemas import RoleResponse

router = APIRouter(
    prefix="/roles",
    tags=["Roles"]
)


@router.get(
    "/",
    response_model=list[RoleResponse]
)
def get_roles(db: Session = Depends(get_db)):

    roles = (
        db.query(Role)
        .filter(Role.can_self_register == True)
        .all()
    )

    return roles