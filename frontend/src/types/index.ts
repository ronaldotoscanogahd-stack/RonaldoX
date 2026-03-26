export interface Criterion {
  id: number;
  name: string;
  weight: number;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  criteria: Criterion[];
  candidate_count: number;
  interview_count: number;
}

export interface CriterionScore {
  criterion_id: number;
  criterion_name: string;
  criterion_weight: number;
  score: number;
  justification: string;
}

export interface Evaluation {
  overall_score: number;
  justification: string;
  criterion_scores: CriterionScore[];
}

export interface Candidate {
  id: number;
  name: string;
  profile_text: string;
  created_at: string;
  evaluation: Evaluation | null;
  has_interview: boolean;
}

export interface Interview {
  id: number;
  candidate_id: number;
  candidate_name: string;
  scheduled_at: string;
  notes: string | null;
}
