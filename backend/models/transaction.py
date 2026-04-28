from sqlalchemy import Column, String, Float, DateTime, ForeignKey, func
from backend.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    policy_id = Column(String, ForeignKey("policies.id"), nullable=False)
    type = Column(String, nullable=False)  # premium, claim_payout
    amount = Column(Float, nullable=False)
    status = Column(String, default="completed")  # pending, completed, failed
    created_at = Column(DateTime, server_default=func.now())
