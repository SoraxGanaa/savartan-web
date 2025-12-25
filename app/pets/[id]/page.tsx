/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthGate from "@/app/components/AuthGate";
import { apiFetch } from "@/app/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [pet, setPet] = useState<any>(null);
  const [media, setMedia] = useState<any[]>([]);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const res = await apiFetch(`/pets/${id}`, { method: "GET" });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setPet(data.pet);
      setMedia(data.media || []);
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

  return (
    <AuthGate>
      <div className="min-h-screen bg-linear-to-b from-emerald-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => router.push("/pets")}>
              Back
            </Button>
          </div>

          {err && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {err}
            </div>
          )}

          {loading ? (
            <div className="mt-8 text-sm text-muted-foreground">Loading...</div>
          ) : !pet ? (
            <div className="mt-8 text-sm text-muted-foreground">Not found</div>
          ) : (
            <Card className="mt-6 rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{pet.name}</span>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{pet.type}</Badge>
                    <Badge className="bg-emerald-600 hover:bg-emerald-600">{pet.category}</Badge>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Images */}
                {media.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {media
                      .filter((m) => m.media_type === "IMAGE")
                      .map((m) => (
                        <div key={m.id} className="rounded-2xl border p-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={m.url} alt="pet" className="h-64 w-full rounded-xl object-cover" />
                          {m.is_profile && (
                            <div className="mt-2 text-xs text-muted-foreground">Profile image</div>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border bg-white p-6 text-sm text-muted-foreground">
                    No images uploaded.
                  </div>
                )}

                {/* Info */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Info label="Location" value={pet.location} />
                  <Info label="Breed" value={pet.breed} />
                  <Info label="Age" value={pet.age != null ? `${pet.age}` : null} />
                  <Info label="Sex" value={pet.sex} />
                  <Info label="Adoption fee" value={pet.adoption_fee != null ? `${pet.adoption_fee}` : null} />
                  <Info label="Contact" value={pet.contact_info} />
                </div>

                <div>
                  <div className="text-sm font-medium">About</div>
                  <div className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
                    {pet.about || "—"}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {pet.vaccinated && <Badge variant="secondary">Vaccinated</Badge>}
                  {pet.dewormed && <Badge variant="secondary">Dewormed</Badge>}
                  {pet.sprayed && <Badge className="bg-emerald-600 hover:bg-emerald-600">Sprayed</Badge>}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AuthGate>
  );
}

function Info({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium">{value || "—"}</div>
    </div>
  );
}

