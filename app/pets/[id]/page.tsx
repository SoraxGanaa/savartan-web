/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthGate from "@/app/pets/components/AuthGate";
import { apiFetch } from "@/app/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PetDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const res = await apiFetch(`/pets/${id}`, { method: "GET" });
      if (!res.ok) throw new Error(await res.text());
      setData(await res.json());
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load pet");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleDelete() {
    if (!confirm("Delete this pet? This will also delete media from S3.")) return;
    const res = await apiFetch(`/pets/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert(await res.text());
      return;
    }
    router.push("/pets");
  }

  return (
    <AuthGate>
      <div className="min-h-screen bg-linear-to-b from-emerald-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => router.push("/pets")}>
              Back
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>

          {err && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {err}
            </div>
          )}

          {loading ? (
            <div className="mt-10 text-sm text-muted-foreground">Loading...</div>
          ) : !data ? null : (
            <Card className="mt-6 rounded-2xl">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-2xl">{data.pet.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {data.pet.location || "No location"}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{data.pet.type}</Badge>
                    <Badge className="bg-emerald-600 hover:bg-emerald-600">{data.pet.category}</Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                {data.media?.length > 0 && (
                  <div className="grid gap-3 sm:grid-cols-3">
                    {data.media.map((m: any) => (
                      <div key={m.id} className="rounded-xl border p-2">
                        {m.media_type === "IMAGE" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={m.url} alt="pet" className="h-32 w-full rounded-lg object-cover" />
                        ) : (
                          <div className="flex h-32 items-center justify-center rounded-lg bg-muted text-xs">
                            VIDEO
                          </div>
                        )}
                        <p className="mt-2 text-xs text-muted-foreground">
                          {m.is_profile ? "Profile" : "Media"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium">About</p>
                  <p className="mt-1 text-sm text-muted-foreground">{data.pet.about || "—"}</p>
                </div>

                <div>
                  <p className="text-sm font-medium">Contact</p>
                  <p className="mt-1 text-sm text-muted-foreground">{data.pet.contact_info || "—"}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AuthGate>
  );
}
