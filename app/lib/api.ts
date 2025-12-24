const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

async function refreshAccessToken(): Promise<string | null> {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.accessToken ?? null;
}

export async function apiFetch(path: string, opts: RequestInit = {}) {
  const headers = new Headers(opts.headers || {});
  if (!headers.get("Content-Type") && !(opts.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const doReq = () =>
    fetch(`${API_BASE}${path}`, {
      ...opts,
      headers,
      credentials: "include",
    });

  let res = await doReq();

  // retry once if access expired
  if (res.status === 401) {
    const next = await refreshAccessToken();
    if (next) {
      accessToken = next;
      headers.set("Authorization", `Bearer ${next}`);
      res = await doReq();
    }
  }

  return res;
}
