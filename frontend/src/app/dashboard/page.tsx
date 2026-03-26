"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getJobs, deleteJob } from "@/lib/api";
import type { Job } from "@/types";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    open: "bg-green-100 text-green-700",
    closed: "bg-gray-100 text-gray-600",
  };
  const label: Record<string, string> = { open: "Aberta", closed: "Encerrada" };
  return (
    <span className={`badge ${map[status] ?? "bg-blue-100 text-blue-700"}`}>
      {label[status] ?? status}
    </span>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobs()
      .then((r) => setJobs(r.data))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Excluir a vaga "${title}"? Esta ação não pode ser desfeita.`)) return;
    await deleteJob(id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              {jobs.length} {jobs.length === 1 ? "vaga cadastrada" : "vagas cadastradas"}
            </p>
          </div>
          <Link href="/jobs/new" className="btn-primary">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova Vaga
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Vagas Abertas",
              value: jobs.filter((j) => j.status === "open").length,
              color: "text-green-600",
              bg: "bg-green-50",
            },
            {
              label: "Total de Candidatos",
              value: jobs.reduce((s, j) => s + j.candidate_count, 0),
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Entrevistas Agendadas",
              value: jobs.reduce((s, j) => s + j.interview_count, 0),
              color: "text-purple-600",
              bg: "bg-purple-50",
            },
          ].map((stat) => (
            <div key={stat.label} className={`card flex items-center gap-4 p-5 ${stat.bg}`}>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Jobs table */}
        {loading ? (
          <div className="card p-12 text-center text-gray-400">Carregando vagas...</div>
        ) : jobs.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-gray-500">Nenhuma vaga cadastrada ainda.</p>
            <Link href="/jobs/new" className="btn-primary mt-4">
              Criar primeira vaga
            </Link>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Vaga</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-center font-medium text-gray-500">Candidatos</th>
                  <th className="px-6 py-3 text-center font-medium text-gray-500">Entrevistas</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Criada em</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {job.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="px-6 py-4 text-center">{job.candidate_count}</td>
                    <td className="px-6 py-4 text-center">{job.interview_count}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(job.created_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/jobs/${job.id}`} className="btn-secondary py-1 text-xs">
                          Ver candidatos
                        </Link>
                        <Link href={`/jobs/${job.id}/schedule`} className="btn-secondary py-1 text-xs">
                          Entrevistas
                        </Link>
                        <button
                          onClick={() => handleDelete(job.id, job.title)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition"
                          title="Excluir vaga"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
