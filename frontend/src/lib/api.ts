// src/lib/api.ts
import { auth } from "./firebase";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function getIdTokenOrNull() {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken(true);
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getIdTokenOrNull();

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  let json: any = null;
  try { json = text ? JSON.parse(text) : null; } catch {}

  if (!res.ok) {
    const message = json?.error || json?.message || text || `HTTP ${res.status}`;
    throw new Error(message);
  }

  return json as T;
}