/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGate from "@/app/pets/components/AuthGate";
import { apiFetch } from "@/app/lib/api";
import { uploadFile } from "@/app/lib/upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Uploaded = { url: string; media_type: "IMAGE" | "VIDEO" };

export default function NewPetPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [type, setType] = useState<"DOG" | "CAT">("DOG");
  const [category, setCategory] = useState<"STRAY" | "OWNED">("STRAY");
  const [location, setLocation] = useState("");
  const [about, setAbout] = useState("");
  const [contact, setContact] = useState("");

  const [files, setFiles] = useState<File[]>([]);
  const [uploads, setUploads] = useState<Uploaded[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const canSubmit = useMemo(() => name.trim().length > 0, [name]);

  async function handleUploadSelected() {
    setErr(null);
    if (files.length === 0) return;

    setLoading(true);
    try {
      const results: Uploaded[] = [];
      for (const f of files) {
        const r = await uploadFile(f);
        results.push({ url: r.url, media_type: r.media_type });
      }
      setUploads((prev) => [...prev, ...results]);
      setFiles([]);
    } catch (e: any) {
      setErr(e?.message ?? "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    setErr(null);
    if (!canSubmit) return;

    setLoading(true);
    try {
      const body = {
        name: name.trim(),
        type,
        category,
        location: location.trim() || null,
        about: about.trim() || null,
        contact_info: contact.trim() || null,
        media: uploads.map((u, i) => ({
          media_type: u.media_type,
          url: u.url,
          is_profile: i === 0
        }))
      };

      const res = await apiFetch("/pets", {
        method: "POST",
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      router.push(`/pets/${data.pet.id}`);
    } catch (e: any) {
      setErr(e?.message ?? "Create pet failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthGate>
      <div className="min-h-screen bg-linear-to-b from-emerald-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Post a pet</CardTitle>
              <CardDescription>
                Upload images first, then create the pet.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {err && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {err}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Lucky" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <select
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                    >
                      <option value="DOG">DOG</option>
                      <option value="CAT">CAT</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Category</Label>
                    <select
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                    >
                      <option value="STRAY">STRAY</option>
                      <option value="OWNED">OWNED</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="UB" />
                </div>
                <div className="space-y-2">
                  <Label>Contact info</Label>
                  <Input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="99112233" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>About</Label>
                <Textarea value={about} onChange={(e) => setAbout(e.target.value)} placeholder="Friendly..." />
              </div>

              <div className="space-y-3 rounded-2xl border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Media</p>
                    <p className="text-xs text-muted-foreground">
                      First uploaded item becomes profile image.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={(e) => setFiles(Array.from(e.target.files || []))}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleUploadSelected}
                    disabled={loading || files.length === 0}
                  >
                    Upload selected
                  </Button>
                </div>

                {uploads.length > 0 && (
                  <div className="grid gap-3 sm:grid-cols-3">
                    {uploads.map((u, idx) => (
                      <div key={idx} className="rounded-xl border p-2">
                        {u.media_type === "IMAGE" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={u.url} alt="pet" className="h-28 w-full rounded-lg object-cover" />
                        ) : (
                          <div className="flex h-28 items-center justify-center rounded-lg bg-muted text-xs">
                            VIDEO
                          </div>
                        )}
                        <p className="mt-2 truncate text-xs text-muted-foreground">
                          {idx === 0 ? "Profile" : "Media"} • {u.media_type}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleCreate}
                  disabled={loading || !canSubmit}
                >
                  {loading ? "Saving..." : "Create pet"}
                </Button>
                <Button variant="outline" onClick={() => router.push("/pets")} disabled={loading}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGate>
  );
}
