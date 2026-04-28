from sqlalchemy import Column, String, Float, DateTime, Text, ForeignKey, func
from backend.database import Base
import json


class MLResult(Base):
    __tablename__ = "ml_results"

    id = Column(String, primary_key=True)
    claim_id = Column(String, ForeignKey("claims.id"), nullable=False, index=True)
    model_name = Column(String, nullable=False)  # fraud_scorer, pattern_detector, photo_verifier
    score = Column(Float, nullable=True)
    risk_level = Column(String, nullable=True)  # low, medium, high
    flags_json = Column(Text, default="[]")  # JSON array of flags
    details_json = Column(Text, default="{}")  # JSON object with model-specific details
    created_at = Column(DateTime, server_default=func.now())

    @property
    def flags(self):
        return json.loads(self.flags_json) if self.flags_json else []

    @flags.setter
    def flags(self, value):
        self.flags_json = json.dumps(value)

    @property
    def details(self):
        return json.loads(self.details_json) if self.details_json else {}

    @details.setter
    def details(self, value):
        self.details_json = json.dumps(value)
