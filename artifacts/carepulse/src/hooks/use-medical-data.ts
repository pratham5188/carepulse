import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

// === HOSPITALS ===
export function useHospitals() {
  return useQuery({
    queryKey: [api.hospitals.list.path],
    queryFn: async () => {
      const res = await fetch(api.hospitals.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch hospitals");
      return api.hospitals.list.responses[200].parse(await res.json());
    },
    refetchInterval: 10000, // Real-time updates for occupancy
  });
}

export function useHospital(id: number) {
  return useQuery({
    queryKey: [api.hospitals.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.hospitals.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch hospital");
      return api.hospitals.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// === PATIENTS ===
export function usePatients() {
  return useQuery({
    queryKey: [api.patients.list.path],
    queryFn: async () => {
      const res = await fetch(api.patients.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch patients");
      return api.patients.list.responses[200].parse(await res.json());
    },
  });
}

export function usePatient(id: number) {
  return useQuery({
    queryKey: [api.patients.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.patients.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch patient");
      return api.patients.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function usePatientVitals(id: number) {
  return useQuery({
    queryKey: [api.patients.vitals.path, id],
    queryFn: async () => {
      const url = buildUrl(api.patients.vitals.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch vitals");
      return api.patients.vitals.responses[200].parse(await res.json());
    },
    enabled: !!id,
    refetchInterval: 5000, // Real-time updates
  });
}

// === ANALYTICS ===
export function useAnalyticsTrends() {
  return useQuery({
    queryKey: [api.analytics.trends.path],
    queryFn: async () => {
      const res = await fetch(api.analytics.trends.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch trends");
      return api.analytics.trends.responses[200].parse(await res.json());
    },
  });
}

export function useAnalyticsStats() {
  return useQuery({
    queryKey: [api.analytics.stats.path],
    queryFn: async () => {
      const res = await fetch(api.analytics.stats.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return api.analytics.stats.responses[200].parse(await res.json());
    },
    refetchInterval: 10000, // Real-time updates for dashboard
  });
}

// === KNOWLEDGE BASE ===
export function useKnowledgeSearch() {
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.knowledge.search.input>) => {
      const res = await fetch(api.knowledge.search.path, {
        method: api.knowledge.search.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to search knowledge base");
      return api.knowledge.search.responses[200].parse(await res.json());
    },
  });
}
