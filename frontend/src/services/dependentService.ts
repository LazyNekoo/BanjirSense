import { apiFetch } from "../lib/api";
import type { Dependent } from "../types/profile";

export async function listDependents() {
  return apiFetch<{ ok: true; dependents: Dependent[] }>("/dependents");
}

export async function createDependent(data: Partial<Dependent>) {
  return apiFetch<{ ok: true; dependent: Dependent }>("/dependents", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateDependent(id: string, data: Partial<Dependent>) {
  return apiFetch<{ ok: true; dependent: Dependent }>(`/dependents/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteDependent(id: string) {
  return apiFetch<{ ok: true }>(`/dependents/${id}`, { method: "DELETE" });
}