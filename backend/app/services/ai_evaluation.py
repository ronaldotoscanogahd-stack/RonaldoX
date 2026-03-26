import os
import json
import anthropic
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

SYSTEM_PROMPT = """Você é um especialista em recrutamento e seleção.
Sua tarefa é avaliar candidatos para uma vaga de emprego com base em critérios específicos.
Seja objetivo, justo e forneça justificativas detalhadas para cada avaliação.
Responda SEMPRE em JSON válido, sem texto adicional fora do JSON."""


def evaluate_candidates(
    job_title: str,
    job_description: str,
    criteria: list[dict],  # [{"id": int, "name": str, "weight": int}]
    candidates: list[dict],  # [{"name": str, "profile_text": str}]
) -> list[dict]:
    """
    Returns a list of evaluations, one per candidate.
    Each evaluation: {
        "candidate_name": str,
        "overall_score": float (0-10, weighted),
        "justification": str,
        "criterion_scores": [{"criterion_id": int, "score": float, "justification": str}]
    }
    """
    criteria_text = "\n".join(
        f"- {c['name']} (peso {c['weight']}/5)" for c in criteria
    )

    candidates_text = "\n\n".join(
        f"### Candidato: {c['name']}\n{c['profile_text']}" for c in candidates
    )

    criteria_json_schema = json.dumps(
        [{"criterion_id": c["id"], "score": "float 0-10", "justification": "string"} for c in criteria],
        ensure_ascii=False,
        indent=2,
    )

    prompt = f"""Avalie os candidatos abaixo para a vaga de **{job_title}**.

## Descrição da Vaga
{job_description}

## Critérios de Avaliação
{criteria_text}

## Candidatos
{candidates_text}

## Instruções
Para cada candidato, avalie cada critério com uma nota de 0 a 10 e forneça uma justificativa.
Calcule a pontuação geral como a média ponderada (score * weight / soma_dos_pesos).
Forneça também uma justificativa geral sobre o candidato.

## Formato de Resposta (JSON)
Responda EXATAMENTE neste formato JSON, sem texto fora do JSON:
{{
  "evaluations": [
    {{
      "candidate_name": "Nome do Candidato",
      "overall_score": 7.5,
      "justification": "Justificativa geral sobre o candidato...",
      "criterion_scores": {criteria_json_schema}
    }}
  ]
}}
"""

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=4096,
        messages=[{"role": "user", "content": prompt}],
        system=SYSTEM_PROMPT,
    )

    raw = message.content[0].text.strip()

    # Strip markdown code fences if present
    if raw.startswith("```"):
        raw = raw.split("```", 2)[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.rsplit("```", 1)[0].strip()

    result = json.loads(raw)
    return result["evaluations"]
