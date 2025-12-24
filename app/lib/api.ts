const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;
const ACCESS_KEY = "savartan_access_token";

let accessToken: string | null =
  typeof window !== "undefined" ? localStorage.getItem(ACCESS_KEY) : null;

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (typeof window !== "undefined") {
    if (token) localStorage.setItem(ACCESS_KEY, token);
    else localStorage.removeItem(ACCESS_KEY);
  }
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

  const hasBody = opts.body !== undefined && opts.body !== null;
  const isForm = typeof FormData !== "undefined" && opts.body instanceof FormData;

  // ✅ only set JSON content-type when you actually send a JSON body
  if (hasBody && !isForm && !headers.get("Content-Type")) {
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

  if (res.status === 401) {
    const next = await refreshAccessToken();
    if (next) {
      setAccessToken(next);
      headers.set("Authorization", `Bearer ${next}`);
      res = await doReq();
    }
  }

  return res;
}
