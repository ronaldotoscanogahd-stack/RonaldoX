from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from ..database import get_db
from ..models import Job, Candidate, Interview
from ..schemas import InterviewCreate, InterviewOut

router = APIRouter(prefix="/jobs/{job_id}/interviews", tags=["interviews"])


@router.get("/", response_model=list[InterviewOut])
def list_interviews(job_id: int, db: Session = Depends(get_db)):
    interviews = (
        db.query(Interview)
        .options(joinedload(Interview.candidate))
        .filter(Interview.job_id == job_id)
        .order_by(Interview.scheduled_at)
        .all()
    )
    return [
        InterviewOut(
            id=i.id,
            candidate_id=i.candidate_id,
            candidate_name=i.candidate.name,
            scheduled_at=i.scheduled_at,
            notes=i.notes,
        )
        for i in interviews
    ]


@router.post("/", response_model=InterviewOut, status_code=201)
def schedule_interview(job_id: int, body: InterviewCreate, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Vaga não encontrada")

    candidate = db.query(Candidate).filter(
        Candidate.id == body.candidate_id,
        Candidate.job_id == job_id,
    ).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidato não encontrado nesta vaga")

    existing = db.query(Interview).filter(Interview.candidate_id == body.candidate_id).first()
    if existing:
        existing.scheduled_at = body.scheduled_at
        existing.notes = body.notes
        db.commit()
        db.refresh(existing)
        return InterviewOut(
            id=existing.id,
            candidate_id=existing.candidate_id,
            candidate_name=candidate.name,
            scheduled_at=existing.scheduled_at,
            notes=existing.notes,
        )

    interview = Interview(
        job_id=job_id,
        candidate_id=body.candidate_id,
        scheduled_at=body.scheduled_at,
        notes=body.notes,
    )
    db.add(interview)
    db.commit()
    db.refresh(interview)
    return InterviewOut(
        id=interview.id,
        candidate_id=interview.candidate_id,
        candidate_name=candidate.name,
        scheduled_at=interview.scheduled_at,
        notes=interview.notes,
    )


@router.delete("/{interview_id}", status_code=204)
def delete_interview(job_id: int, interview_id: int, db: Session = Depends(get_db)):
    interview = db.query(Interview).filter(
        Interview.id == interview_id,
        Interview.job_id == job_id,
    ).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Entrevista não encontrada")
    db.delete(interview)
    db.commit()
