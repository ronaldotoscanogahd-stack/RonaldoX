from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Job, Criterion
from ..schemas import JobCreate, JobOut, JobListOut, CriterionOut

router = APIRouter(prefix="/jobs", tags=["jobs"])


def _build_job_out(job: Job) -> JobOut:
    return JobOut(
        id=job.id,
        title=job.title,
        description=job.description,
        status=job.status,
        created_at=job.created_at,
        criteria=[CriterionOut(id=c.id, name=c.name, weight=c.weight) for c in job.criteria],
        candidate_count=len(job.candidates),
        interview_count=len(job.interviews),
    )


@router.get("/", response_model=list[JobListOut])
def list_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).order_by(Job.created_at.desc()).all()
    return [
        JobListOut(
            id=j.id,
            title=j.title,
            status=j.status,
            created_at=j.created_at,
            candidate_count=len(j.candidates),
            interview_count=len(j.interviews),
        )
        for j in jobs
    ]


@router.post("/", response_model=JobOut, status_code=201)
def create_job(body: JobCreate, db: Session = Depends(get_db)):
    job = Job(title=body.title, description=body.description)
    db.add(job)
    db.flush()

    for c in body.criteria:
        criterion = Criterion(job_id=job.id, name=c.name, weight=c.weight)
        db.add(criterion)

    db.commit()
    db.refresh(job)
    return _build_job_out(job)


@router.get("/{job_id}", response_model=JobOut)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Vaga não encontrada")
    return _build_job_out(job)


@router.delete("/{job_id}", status_code=204)
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Vaga não encontrada")
    db.delete(job)
    db.commit()
