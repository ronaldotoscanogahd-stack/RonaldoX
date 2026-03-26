from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from ..database import get_db
from ..models import Job, Candidate, Evaluation, CriterionScore
from ..schemas import (
    EvaluateRequest,
    CandidateOut,
    EvaluationOut,
    CriterionScoreOut,
)
from ..services.ai_evaluation import evaluate_candidates

router = APIRouter(prefix="/jobs/{job_id}/candidates", tags=["candidates"])


def _build_candidate_out(candidate: Candidate) -> CandidateOut:
    evaluation_out = None
    if candidate.evaluation:
        ev = candidate.evaluation
        criterion_scores_out = [
            CriterionScoreOut(
                criterion_id=cs.criterion_id,
                criterion_name=cs.criterion.name,
                criterion_weight=cs.criterion.weight,
                score=cs.score,
                justification=cs.justification,
            )
            for cs in ev.criterion_scores
        ]
        evaluation_out = EvaluationOut(
            overall_score=ev.overall_score,
            justification=ev.justification,
            criterion_scores=criterion_scores_out,
        )

    return CandidateOut(
        id=candidate.id,
        name=candidate.name,
        profile_text=candidate.profile_text,
        created_at=candidate.created_at,
        evaluation=evaluation_out,
        has_interview=candidate.interview is not None,
    )


@router.get("/", response_model=list[CandidateOut])
def list_candidates(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Vaga não encontrada")

    candidates = (
        db.query(Candidate)
        .options(
            joinedload(Candidate.evaluation).joinedload(Evaluation.criterion_scores).joinedload(CriterionScore.criterion),
            joinedload(Candidate.interview),
        )
        .filter(Candidate.job_id == job_id)
        .all()
    )
    return [_build_candidate_out(c) for c in candidates]


@router.post("/evaluate", response_model=list[CandidateOut])
def evaluate(job_id: int, body: EvaluateRequest, db: Session = Depends(get_db)):
    job = (
        db.query(Job)
        .options(joinedload(Job.criteria))
        .filter(Job.id == job_id)
        .first()
    )
    if not job:
        raise HTTPException(status_code=404, detail="Vaga não encontrada")
    if not job.criteria:
        raise HTTPException(status_code=400, detail="Vaga sem critérios de avaliação")
    if not body.candidates:
        raise HTTPException(status_code=400, detail="Nenhum candidato enviado")

    # Persist candidates (or update existing)
    db_candidates: list[Candidate] = []
    for c_in in body.candidates:
        existing = (
            db.query(Candidate)
            .filter(Candidate.job_id == job_id, Candidate.name == c_in.name)
            .first()
        )
        if existing:
            existing.profile_text = c_in.profile_text
            db.flush()
            db_candidates.append(existing)
        else:
            candidate = Candidate(job_id=job_id, name=c_in.name, profile_text=c_in.profile_text)
            db.add(candidate)
            db.flush()
            db_candidates.append(candidate)

    db.commit()

    # Call AI
    criteria_payload = [{"id": c.id, "name": c.name, "weight": c.weight} for c in job.criteria]
    candidates_payload = [{"name": c.name, "profile_text": c.profile_text} for c in db_candidates]

    try:
        ai_results = evaluate_candidates(
            job_title=job.title,
            job_description=job.description,
            criteria=criteria_payload,
            candidates=candidates_payload,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Erro na avaliação com IA: {str(e)}")

    # Map AI results back to candidates
    name_to_candidate = {c.name: c for c in db_candidates}

    for ai_eval in ai_results:
        candidate = name_to_candidate.get(ai_eval["candidate_name"])
        if not candidate:
            continue

        # Delete existing evaluation
        if candidate.evaluation:
            db.delete(candidate.evaluation)
            db.flush()

        evaluation = Evaluation(
            candidate_id=candidate.id,
            overall_score=ai_eval["overall_score"],
            justification=ai_eval["justification"],
        )
        db.add(evaluation)
        db.flush()

        criterion_id_map = {c.id: c for c in job.criteria}
        for cs in ai_eval.get("criterion_scores", []):
            criterion_id = cs.get("criterion_id")
            if criterion_id not in criterion_id_map:
                continue
            score_obj = CriterionScore(
                evaluation_id=evaluation.id,
                criterion_id=criterion_id,
                score=cs["score"],
                justification=cs["justification"],
            )
            db.add(score_obj)

    db.commit()

    # Reload with relationships
    candidates_out = (
        db.query(Candidate)
        .options(
            joinedload(Candidate.evaluation).joinedload(Evaluation.criterion_scores).joinedload(CriterionScore.criterion),
            joinedload(Candidate.interview),
        )
        .filter(Candidate.job_id == job_id)
        .all()
    )
    result = [_build_candidate_out(c) for c in candidates_out]
    result.sort(key=lambda x: (x.evaluation.overall_score if x.evaluation else 0), reverse=True)
    return result
