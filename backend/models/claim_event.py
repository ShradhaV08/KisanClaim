from sqlalchemy import Column, String, DateTime, Text, ForeignKey, func
from backend.database import Base


class ClaimEvent(Base):
    __tablename__ = "claim_events"

    id = Column(String, primary_key=True)
    claim_id = Column(String, ForeignKey("claims.id"), nullable=False, index=True)
    event_type = Column(String, nullable=False)  # submitted, ml_scored, sent_back, escalated, approved, rejected, resubmitted, locked
    description = Column(Text, nullable=True)
    old_status = Column(String, nullable=True)
    new_status = Column(String, nullable=True)
    created_by = Column(String, nullable=True)  # user_id or "system"
    created_at = Column(DateTime, server_default=func.now())
