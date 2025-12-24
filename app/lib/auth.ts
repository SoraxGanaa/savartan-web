import { setAccessToken } from "./api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

export async function login(phone_number: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone_number, password }),
  });

  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  setAccessToken(data.accessToken);
  return data;
}

export async function registerUser(payload: {
  name: string;
  phone_number: string;
  email?: string;
  password: string;
  age?: number;
  sex?: "MALE" | "FEMALE";
  location?: string;
}) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
