export async function uploadFile(file: File) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`${API_BASE}/uploads`, {
    method: "POST",
    credentials: "include",
    // do NOT set Content-Type manually
    body: fd
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
