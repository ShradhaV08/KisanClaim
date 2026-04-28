from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, func
from backend.database import Base
import json


class Plan(Base):
    __tablename__ = "plans"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    crop_types_json = Column(Text, default="[]")  # JSON array
    regions_json = Column(Text, default="[]")  # JSON array
    premium_min = Column(Float, nullable=False)
    premium_max = Column(Float, nullable=False)
    coverage_amount = Column(Float, nullable=False)
    benefits_json = Column(Text, default="[]")  # JSON array
    duration = Column(Integer, default=12)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    @property
    def crop_types(self):
        return json.loads(self.crop_types_json) if self.crop_types_json else []

    @crop_types.setter
    def crop_types(self, value):
        self.crop_types_json = json.dumps(value)

    @property
    def regions(self):
        return json.loads(self.regions_json) if self.regions_json else []

    @regions.setter
    def regions(self, value):
        self.regions_json = json.dumps(value)

    @property
    def benefits(self):
        return json.loads(self.benefits_json) if self.benefits_json else []

    @benefits.setter
    def benefits(self, value):
        self.benefits_json = json.dumps(value)
