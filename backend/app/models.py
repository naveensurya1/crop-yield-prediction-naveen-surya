from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base

from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, TIMESTAMP

class Role(Base):
    __tablename__ = "roles"

    role_id = Column(Integer, primary_key=True, index=True)

    role_name = Column(String(50), unique=True, nullable=False)

    description = Column(String)

    can_self_register = Column(Boolean, default=False)

    users = relationship("User", back_populates="role")


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=True)

    google_id = Column(String(255), unique=True, nullable=True)
    auth_provider = Column(String(20), nullable=False, server_default="local")
    avatar_url = Column(String(500), nullable=True)
    email_verified = Column(Boolean, nullable=False, server_default="false")

    role_id = Column(Integer, ForeignKey("roles.role_id"))

    is_active = Column(Boolean, nullable=False, server_default="true")
    
    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now()
    )

    role = relationship("Role", back_populates="users")