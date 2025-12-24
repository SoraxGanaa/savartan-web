import { apiFetch, setAccessToken } from "./api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

export async function login(phone_number: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone_number, password })
  });

  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  setAccessToken(data.accessToken);
  return data;
}

export async function register(payload: unknown) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function logout() {
  await apiFetch("/auth/logout", { method: "POST" });
  setAccessToken(null);
}
