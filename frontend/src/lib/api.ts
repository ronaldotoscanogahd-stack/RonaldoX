import axios from "axios";
import type { Job, Candidate, Interview } from "@/types";

const api = axios.create({ baseURL: "/api" });

// Auth
export const login = (email: string, password: string) =>
  api.post("/auth/login", { email, password });

// Jobs
export const getJobs = () => api.get<Job[]>("/jobs/");
export const getJob = (id: number) => api.get<Job>(`/jobs/${id}`);
export const createJob = (data: {
  title: string;
  description: string;
  criteria: { name: string; weight: number }[];
}) => api.post<Job>("/jobs/", data);
export const deleteJob = (id: number) => api.delete(`/jobs/${id}`);

// Candidates
export const getCandidates = (jobId: number) =>
  api.get<Candidate[]>(`/jobs/${jobId}/candidates/`);

export const evaluateCandidates = (
  jobId: number,
  candidates: { name: string; profile_text: string }[]
) => api.post<Candidate[]>(`/jobs/${jobId}/candidates/evaluate`, { candidates });

// Interviews
export const getInterviews = (jobId: number) =>
  api.get<Interview[]>(`/jobs/${jobId}/interviews/`);

export const scheduleInterview = (
  jobId: number,
  data: { candidate_id: number; scheduled_at: string; notes?: string }
) => api.post<Interview>(`/jobs/${jobId}/interviews/`, data);

export const deleteInterview = (jobId: number, interviewId: number) =>
  api.delete(`/jobs/${jobId}/interviews/${interviewId}`);
