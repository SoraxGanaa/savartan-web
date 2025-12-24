import { apiFetch } from "./api";

export async function uploadFile(file: File) {
  const fd = new FormData();
  fd.append("file", file);

  const res = await apiFetch("/uploads", {
    method: "POST",
    body: fd,
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json() as Promise<{
    url: string;
    key: string;
    media_type: "IMAGE" | "VIDEO";
  }>;
}
