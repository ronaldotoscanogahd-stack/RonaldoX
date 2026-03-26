"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getJob, getCandidates, getInterviews, scheduleInterview, deleteInterview } from "@/lib/api";
import type { Job, Candidate, Interview } from "@/types";

export default function SchedulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const jobId = Number(id);

  const [job, setJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | "">("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    Promise.all([getJob(jobId), getCandidates(jobId), getInterviews(jobId)])
      .then(([jobRes, candidatesRes, interviewsRes]) => {
        setJob(jobRes.data);
        // Only show evaluated candidates
        const evaluated = candidatesRes.data.filter((c) => c.evaluation);
        evaluated.sort(
          (a, b) => (b.evaluation?.overall_score ?? 0) - (a.evaluation?.overall_score ?? 0)
        );
        setCandidates(evaluated);
        setInterviews(interviewsRes.data);
      })
      .finally(() => setLoading(false));
  }, [jobId]);

  async function handleSchedule(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCandidateId) {
      setFormError("Selecione um candidato.");
      return;
    }
    if (!date) {
      setFormError("Selecione uma data.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const scheduled_at = new Date(`${date}T${time}:00`).toISOString();
      const res = await scheduleInterview(jobId, {
        candidate_id: Number(selectedCandidateId),
        scheduled_at,
        notes: notes.trim() || undefined,
      });
      setInterviews((prev) => {
        const filtered = prev.filter((i) => i.candidate_id !== Number(selectedCandidateId));
        return [...filtered, res.data].sort(
          (a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
        );
      });
      // Update candidate has_interview flag
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === Number(selectedCandidateId) ? { ...c, has_interview: true } : c
        )
      );
      setSelectedCandidateId("");
      setDate("");
      setTime("10:00");
      setNotes("");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setFormError(msg ?? "Erro ao agendar entrevista.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteInterview(interviewId: number, candidateId: number) {
    if (!confirm("Remover este agendamento?")) return;
    await deleteInterview(jobId, interviewId);
    setInterviews((prev) => prev.filter((i) => i.id !== interviewId));
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, has_interview: false } : c))
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex h-64 items-center justify-center text-gray-400">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <Link href={`/jobs/${jobId}`} className="text-sm text-gray-500 hover:text-gray-700 transition">
            ← Voltar para candidatos
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">Agendamento de Entrevistas</h1>
          {job && <p className="mt-1 text-sm text-gray-500">{job.title}</p>}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: schedule form */}
          <div className="card p-6">
            <h2 className="mb-4 font-semibold text-gray-900">Agendar nova entrevista</h2>

            {candidates.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">
                <p>Nenhum candidato avaliado ainda.</p>
                <Link href={`/jobs/${jobId}`} className="mt-2 inline-block text-blue-600 hover:underline">
                  Ir para triagem
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSchedule} className="space-y-4">
                <div>
                  <label className="label">Candidato *</label>
                  <select
                    className="input"
                    value={selectedCandidateId}
                    onChange={(e) => setSelectedCandidateId(e.target.value ? Number(e.target.value) : "")}
                  >
                    <option value="">Selecione um candidato...</option>
                    {candidates.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} — nota {c.evaluation?.overall_score.toFixed(1)}
                        {c.has_interview ? " (já agendado)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Data *</label>
                    <input
                      type="date"
                      className="input"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label className="label">Horário</label>
                    <input
                      type="time"
                      className="input"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Observações</label>
                  <textarea
                    className="input resize-none"
                    placeholder="Link da videochamada, instruções, etc."
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                {formError && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</p>
                )}

                <button type="submit" className="btn-primary w-full" disabled={saving}>
                  {saving ? "Agendando..." : "Confirmar agendamento"}
                </button>
              </form>
            )}
          </div>

          {/* Right: interviews list */}
          <div className="card p-6">
            <h2 className="mb-4 font-semibold text-gray-900">
              Entrevistas agendadas ({interviews.length})
            </h2>

            {interviews.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">
                Nenhuma entrevista agendada ainda.
              </p>
            ) : (
              <div className="space-y-3">
                {interviews.map((interview) => {
                  const dt = new Date(interview.scheduled_at);
                  const dateStr = dt.toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  });
                  const timeStr = dt.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return (
                    <div
                      key={interview.id}
                      className="flex items-start justify-between rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100">
                          <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{interview.candidate_name}</p>
                          <p className="text-sm text-gray-500 capitalize">{dateStr}</p>
                          <p className="text-sm text-blue-600 font-medium">{timeStr}</p>
                          {interview.notes && (
                            <p className="mt-1 text-xs text-gray-400 italic">{interview.notes}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteInterview(interview.id, interview.candidate_id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition"
                        title="Cancelar entrevista"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
