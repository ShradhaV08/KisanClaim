from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class PlanResponse(BaseModel):
    _id: str
    name: str
    description: str
    cropTypes: List[str]
    regions: List[str]
    premiumRange: dict
    coverageAmount: float
    benefits: List[str]
    duration: int
    isActive: bool
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None


class PlanCreateRequest(BaseModel):
    name: str
    description: str
    cropTypes: List[str]
    regions: List[str]
    premiumRange: dict
    coverageAmount: float
    benefits: List[str]
    duration: int = 12
    isActive: bool = True


class PlanUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    cropTypes: Optional[List[str]] = None
    regions: Optional[List[str]] = None
    premiumRange: Optional[dict] = None
    coverageAmount: Optional[float] = None
    benefits: Optional[List[str]] = None
    duration: Optional[int] = None
    isActive: Optional[bool] = None
