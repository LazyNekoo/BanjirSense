import { apiFetch } from "../lib/api";
import type { UserProfile } from "../types/profile";

export async function getMe() {
  return apiFetch<{ ok: true; profile: UserProfile | null }>("/me");
}

export async function updateMe(data: Partial<UserProfile>) {
  return apiFetch<{ ok: true; profile: UserProfile }>("/me", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}