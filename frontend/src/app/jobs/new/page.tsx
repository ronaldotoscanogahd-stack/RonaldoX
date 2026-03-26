"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createJob } from "@/lib/api";

interface CriterionField {
  id: number;
  name: string;
  weight: number;
}

export default function NewJobPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [criteria, setCriteria] = useState<CriterionField[]>([
    { id: 1, name: "", weight: 3 },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  let nextId = criteria.length + 1;

  function addCriterion() {
    setCriteria((prev) => [...prev, { id: nextId++, name: "", weight: 3 }]);
  }

  function removeCriterion(id: number) {
    setCriteria((prev) => prev.filter((c) => c.id !== id));
  }

  function updateCriterion(id: number, field: keyof CriterionField, value: string | number) {
    setCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validCriteria = criteria.filter((c) => c.name.trim());
    if (validCriteria.length === 0) {
      setError("Adicione pelo menos um critério de avaliação.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await createJob({
        title,
        description,
        criteria: validCriteria.map((c) => ({ name: c.name.trim(), weight: c.weight })),
      });
      router.push(`/jobs/${res.data.id}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg ?? "Erro ao criar vaga. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const weightLabels: Record<number, string> = {
    1: "Baixo",
    2: "Médio-baixo",
    3: "Médio",
    4: "Médio-alto",
    5: "Alto",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 transition">
            ← Voltar ao dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">Criar nova vaga</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic info */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Informações da vaga</h2>
            <div>
              <label className="label">Título da vaga *</label>
              <input
                className="input"
                placeholder="Ex: Desenvolvedor Full Stack Senior"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Descrição da vaga *</label>
              <textarea
                className="input min-h-32 resize-y"
                placeholder="Descreva as responsabilidades, requisitos técnicos, cultura da empresa..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
              />
            </div>
          </div>

          {/* Criteria */}
          <div className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">Critérios de avaliação</h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  Defina o que importa para a vaga e o peso de cada critério (1 = baixo, 5 = alto)
                </p>
              </div>
              <button type="button" onClick={addCriterion} className="btn-secondary py-1.5 text-xs">
                + Adicionar critério
              </button>
            </div>

            <div className="space-y-3">
              {criteria.map((criterion) => (
                <div key={criterion.id} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <div className="flex-1">
                    <input
                      className="input bg-white"
                      placeholder="Ex: Experiência técnica em React"
                      value={criterion.name}
                      onChange={(e) => updateCriterion(criterion.id, "name", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1 min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-500">Peso:</label>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={criterion.weight}
                        onChange={(e) => updateCriterion(criterion.id, "weight", Number(e.target.value))}
                        className="w-20 accent-blue-600"
                      />
                      <span className="w-6 text-center text-sm font-semibold text-blue-600">
                        {criterion.weight}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">{weightLabels[criterion.weight]}</span>
                  </div>
                  {criteria.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCriterion(criterion.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          <div className="flex gap-3 justify-end">
            <Link href="/dashboard" className="btn-secondary">
              Cancelar
            </Link>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Criando..." : "Criar vaga"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
