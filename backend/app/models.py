from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(50), default="open")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    criteria = relationship("Criterion", back_populates="job", cascade="all, delete-orphan")
    candidates = relationship("Candidate", back_populates="job", cascade="all, delete-orphan")
    interviews = relationship("Interview", back_populates="job", cascade="all, delete-orphan")


class Criterion(Base):
    __tablename__ = "criteria"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    name = Column(String(255), nullable=False)
    weight = Column(Integer, nullable=False)  # 1 to 5

    job = relationship("Job", back_populates="criteria")
    scores = relationship("CriterionScore", back_populates="criterion", cascade="all, delete-orphan")


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    name = Column(String(255), nullable=False)
    profile_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    job = relationship("Job", back_populates="candidates")
    evaluation = relationship("Evaluation", back_populates="candidate", uselist=False, cascade="all, delete-orphan")
    interview = relationship("Interview", back_populates="candidate", uselist=False, cascade="all, delete-orphan")


class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"), nullable=False, unique=True)
    overall_score = Column(Float, nullable=False)
    justification = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    candidate = relationship("Candidate", back_populates="evaluation")
    criterion_scores = relationship("CriterionScore", back_populates="evaluation", cascade="all, delete-orphan")


class CriterionScore(Base):
    __tablename__ = "criterion_scores"

    id = Column(Integer, primary_key=True, index=True)
    evaluation_id = Column(Integer, ForeignKey("evaluations.id"), nullable=False)
    criterion_id = Column(Integer, ForeignKey("criteria.id"), nullable=False)
    score = Column(Float, nullable=False)  # 0 to 10
    justification = Column(Text, nullable=False)

    evaluation = relationship("Evaluation", back_populates="criterion_scores")
    criterion = relationship("Criterion", back_populates="scores")


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("candidates.id"), nullable=False, unique=True)
    scheduled_at = Column(DateTime, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    job = relationship("Job", back_populates="interviews")
    candidate = relationship("Candidate", back_populates="interview")
