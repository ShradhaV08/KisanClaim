from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Text, ForeignKey, func
from backend.database import Base
import json


class Claim(Base):
    __tablename__ = "claims"

    id = Column(String, primary_key=True)
    policy_id = Column(String, ForeignKey("policies.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    assigned_agent_id = Column(String, ForeignKey("users.id"), nullable=True, index=True)
    type = Column(String, nullable=False)  # crop_damage, weather, pest, other
    description = Column(Text, nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String, default="pending")  # pending, under_review, approved, rejected, sent_back, locked
    documents_json = Column(Text, default="[]")  # JSON array of file paths
    fraud_score = Column(Float, nullable=True)
    attempt_count = Column(Integer, default=0)
    score_penalty = Column(Integer, default=0)
    is_locked = Column(Boolean, default=False)
    locked_reason = Column(String, nullable=True)
    tier = Column(String, nullable=True)  # auto_approved, sent_back, escalated
    sent_back_reasons_json = Column(Text, nullable=True)  # JSON: issues to fix
    submitted_at = Column(DateTime, server_default=func.now())
    assigned_at = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    @property
    def documents(self):
        return json.loads(self.documents_json) if self.documents_json else []

    @documents.setter
    def documents(self, value):
        self.documents_json = json.dumps(value)

    @property
    def sent_back_reasons(self):
        return json.loads(self.sent_back_reasons_json) if self.sent_back_reasons_json else []

    @sent_back_reasons.setter
    def sent_back_reasons(self, value):
        self.sent_back_reasons_json = json.dumps(value)
