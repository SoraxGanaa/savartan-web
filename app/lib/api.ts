const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

type ApiOptions = RequestInit & { auth?: boolean };

async function refreshAccessToken(): Promise<string | null> {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include" // IMPORTANT: sends refresh cookie
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.accessToken ?? null;
}

export async function apiFetch(path: string, opts: ApiOptions = {}) {
  const url = `${API_BASE}${path}`;
  const headers = new Headers(opts.headers || {});
  headers.set("Content-Type", headers.get("Content-Type") || "application/json");

  if (opts.auth !== false && accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const doReq = () =>
    fetch(url, {
      ...opts,
      headers,
      credentials: "include" // IMPORTANT: keep cookies
    });

  let res = await doReq();

  // If access token expired, try refresh once and retry
  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (!newToken) return res;

    setAccessToken(newToken);
    headers.set("Authorization", `Bearer ${newToken}`);
    res = await doReq();
  }

  return res;
}
