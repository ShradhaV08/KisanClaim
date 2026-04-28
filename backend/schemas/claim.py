from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime


class ClaimCreateRequest(BaseModel):
    policyId: str
    type: str  # crop_damage, weather, pest, other
    description: str
    amount: float
    documents: Optional[List[str]] = []


class ClaimResubmitRequest(BaseModel):
    description: Optional[str] = None
    amount: Optional[float] = None
    documents: Optional[List[str]] = None


class ClaimReviewRequest(BaseModel):
    status: str  # approved, rejected
    notes: Optional[str] = None


class ClaimEventResponse(BaseModel):
    id: str
    event_type: str
    description: Optional[str] = None
    old_status: Optional[str] = None
    new_status: Optional[str] = None
    created_by: Optional[str] = None
    created_at: str


class MLResultResponse(BaseModel):
    model_name: str
    score: Optional[float] = None
    risk_level: Optional[str] = None
    flags: List[Any] = []
    details: dict = {}
    created_at: str


class ClaimResponse(BaseModel):
    _id: str
    policyId: str
    userId: str
    assignedAgentId: Optional[str] = None
    type: str
    description: str
    amount: float
    status: str
    documents: List[str] = []
    fraudScore: Optional[float] = None
    attemptCount: int = 0
    scorePenalty: int = 0
    isLocked: bool = False
    lockedReason: Optional[str] = None
    tier: Optional[str] = None
    sentBackReasons: Optional[List[dict]] = None
    submittedAt: Optional[str] = None
    assignedAt: Optional[str] = None
    resolvedAt: Optional[str] = None
    updatedAt: Optional[str] = None
    timeline: Optional[List[ClaimEventResponse]] = None
    mlResults: Optional[List[MLResultResponse]] = None
