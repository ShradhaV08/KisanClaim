from sqlalchemy import Column, String, DateTime, func
from backend.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String, default="")
    role = Column(String, default="user")  # user, agent, admin
    assigned_region = Column(String, nullable=True)  # for agents
    district = Column(String, default="")
    state = Column(String, default="")
    pincode = Column(String, default="")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
