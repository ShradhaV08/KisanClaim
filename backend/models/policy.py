from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, func
from backend.database import Base


class Policy(Base):
    __tablename__ = "policies"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    plan_id = Column(String, ForeignKey("plans.id"), nullable=False)
    status = Column(String, default="active")  # active, expired, cancelled
    premium = Column(Float, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    crop_type = Column(String, nullable=False)
    land_size = Column(Float, nullable=False)
    location = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
