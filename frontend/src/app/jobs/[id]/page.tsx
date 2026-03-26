"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getJob, getCandidates, evaluateCandidates } from "@/lib/api";
import type { Job, Candidate } from "@/types";

interface CandidateInput {
  id: number;
  name: string;
  profile_text: string;
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 7.5 ? "bg-green-100 text-green-700" :
    score >= 5 ? "bg-yellow-100 text-yellow-700" :
    "bg-red-100 text-red-700";
  return (
    <span className={`badge text-base font-bold px-3 py-1 ${color}`}>
      {score.toFixed(1)}
    </span>
  );
}

function CandidateCard({ candidate, rank }: { candidate: Candidate; rank: number }) {
  const [expanded, setExpanded] = useState(false);
  const ev = candidate.evaluation;

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
            #{rank}
          </span>
          <div>
            <p className="font-semibold text-gray-900">{candidate.name}</p>
            {candidate.has_interview && (
              <span className="badge bg-purple-100 text-purple-700 text-xs mt-0.5">
                Entrevista agendada
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {ev && <ScoreBadge score={ev.overall_score} />}
          <button
            onClick={() => setExpanded((p) => !p)}
            className="btn-secondary py-1.5 text-xs"
          >
            {expanded ? "Ocultar" : "Ver detalhes"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-4">
          {ev ? (
            <>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1">
                  Justificativa Geral
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">{ev.justification}</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">
                  Pontuação por Critério
                </p>
                <div className="space-y-2">
                  {ev.criterion_scores.map((cs) => (
                    <div key={cs.criterion_id} className="rounded-lg bg-gray-50 p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{cs.criterion_name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">Peso {cs.criterion_weight}</span>
                          <span className="text-sm font-bold text-blue-600">{cs.score.toFixed(1)}/10</span>
                        </div>
                      </div>
                      {/* Score bar */}
                      <div className="mb-2 h-1.5 rounded-full bg-gray-200">
                        <div
                          className="h-1.5 rounded-full bg-blue-500 transition-all"
                          style={{ width: `${(cs.score / 10) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{cs.justification}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1">
                Perfil
              </p>
              <p className="whitespace-pre-wrap text-sm text-gray-700">{candidate.profile_text}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function JobCandidatesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const jobId = Number(id);

  const [job, setJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [inputs, setInputs] = useState<CandidateInput[]>([
    { id: 1, name: "", profile_text: "" },
  ]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState("");

  let nextId = 2;

  useEffect(() => {
    Promise.all([getJob(jobId), getCandidates(jobId)])
      .then(([jobRes, candidatesRes]) => {
        setJob(jobRes.data);
        const sorted = [...candidatesRes.data].sort(
          (a, b) => (b.evaluation?.overall_score ?? -1) - (a.evaluation?.overall_score ?? -1)
        );
        setCandidates(sorted);
      })
      .finally(() => setLoading(false));
  }, [jobId]);

  function addInput() {
    setInputs((prev) => [...prev, { id: nextId++, name: "", profile_text: "" }]);
  }

  function removeInput(id: number) {
    setInputs((prev) => prev.filter((i) => i.id !== id));
  }

  function updateInput(id: number, field: keyof CandidateInput, value: string) {
    setInputs((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  }

  async function handleEvaluate() {
    const validInputs = inputs.filter((i) => i.name.trim() && i.profile_text.trim());
    if (validInputs.length === 0) {
      setError("Preencha nome e perfil de pelo menos um candidato.");
      return;
    }
    setEvaluating(true);
    setError("");
    try {
      const res = await evaluateCandidates(
        jobId,
        validInputs.map((i) => ({ name: i.name.trim(), profile_text: i.profile_text.trim() }))
      );
      setCandidates(res.data);
      setInputs([{ id: 1, name: "", profile_text: "" }]);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg ?? "Erro ao avaliar candidatos.");
    } finally {
      setEvaluating(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex h-64 items-center justify-center text-gray-400">Carregando...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex h-64 items-center justify-center text-gray-500">Vaga não encontrada.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 transition">
            ← Voltar ao dashboard
          </Link>
          <div className="mt-2 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">{job.description}</p>
            </div>
            <Link href={`/jobs/${jobId}/schedule`} className="btn-secondary ml-4 shrink-0">
              Ver entrevistas
            </Link>
          </div>
        </div>

        {/* Criteria chips */}
        <div className="mb-6 card p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
            Critérios de avaliação
          </p>
          <div className="flex flex-wrap gap-2">
            {job.criteria.map((c) => (
              <span key={c.id} className="badge bg-blue-50 text-blue-700 px-3 py-1">
                {c.name} · peso {c.weight}
              </span>
            ))}
          </div>
        </div>

        {/* Input section */}
        <div className="mb-8 card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">Adicionar candidatos para triagem</h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Cole o perfil de cada candidato (currículo, LinkedIn, texto livre) e clique em Avaliar
              </p>
            </div>
            <button type="button" onClick={addInput} className="btn-secondary py-1.5 text-xs">
              + Candidato
            </button>
          </div>

          <div className="space-y-4">
            {inputs.map((input, index) => (
              <div key={input.id} className="rounded-lg border border-gray-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Candidato {index + 1}</span>
                  {inputs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInput(input.id)}
                      className="text-xs text-gray-400 hover:text-red-500 transition"
                    >
                      Remover
                    </button>
                  )}
                </div>
                <input
                  className="input"
                  placeholder="Nome do candidato"
                  value={input.name}
                  onChange={(e) => updateInput(input.id, "name", e.target.value)}
                />
                <textarea
                  className="input min-h-28 resize-y text-sm"
                  placeholder="Cole aqui o perfil do candidato: experiência, habilidades, formação, etc."
                  value={input.profile_text}
                  onChange={(e) => updateInput(input.id, "profile_text", e.target.value)}
                  rows={4}
                />
              </div>
            ))}
          </div>

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleEvaluate}
              disabled={evaluating}
              className="btn-primary"
            >
              {evaluating ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Avaliando com IA...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Avaliar com IA
                </>
              )}
            </button>
          </div>
        </div>

        {/* Rankings */}
        {candidates.length > 0 && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">
                Ranking de candidatos ({candidates.length})
              </h2>
              <Link href={`/jobs/${jobId}/schedule`} className="text-sm text-blue-600 hover:underline">
                Agendar entrevistas →
              </Link>
            </div>
            <div className="space-y-3">
              {candidates.map((c, i) => (
                <CandidateCard key={c.id} candidate={c} rank={i + 1} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
