from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import Optional


# --- Auth ---
class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    token: str
    email: str


# --- Criterion ---
class CriterionCreate(BaseModel):
    name: str
    weight: int

    @field_validator("weight")
    @classmethod
    def weight_range(cls, v: int) -> int:
        if not 1 <= v <= 5:
            raise ValueError("Weight must be between 1 and 5")
        return v


class CriterionOut(BaseModel):
    id: int
    name: str
    weight: int

    model_config = {"from_attributes": True}


# --- Job ---
class JobCreate(BaseModel):
    title: str
    description: str
    criteria: list[CriterionCreate]


class JobOut(BaseModel):
    id: int
    title: str
    description: str
    status: str
    created_at: datetime
    criteria: list[CriterionOut] = []
    candidate_count: int = 0
    interview_count: int = 0

    model_config = {"from_attributes": True}


class JobListOut(BaseModel):
    id: int
    title: str
    status: str
    created_at: datetime
    candidate_count: int = 0
    interview_count: int = 0

    model_config = {"from_attributes": True}


# --- Candidate ---
class CandidateCreate(BaseModel):
    name: str
    profile_text: str


class CriterionScoreOut(BaseModel):
    criterion_id: int
    criterion_name: str
    criterion_weight: int
    score: float
    justification: str

    model_config = {"from_attributes": True}


class EvaluationOut(BaseModel):
    overall_score: float
    justification: str
    criterion_scores: list[CriterionScoreOut] = []

    model_config = {"from_attributes": True}


class CandidateOut(BaseModel):
    id: int
    name: str
    profile_text: str
    created_at: datetime
    evaluation: Optional[EvaluationOut] = None
    has_interview: bool = False

    model_config = {"from_attributes": True}


# --- Evaluate ---
class EvaluateRequest(BaseModel):
    candidates: list[CandidateCreate]


# --- Interview ---
class InterviewCreate(BaseModel):
    candidate_id: int
    scheduled_at: datetime
    notes: Optional[str] = None


class InterviewOut(BaseModel):
    id: int
    candidate_id: int
    candidate_name: str
    scheduled_at: datetime
    notes: Optional[str] = None

    model_config = {"from_attributes": True}
