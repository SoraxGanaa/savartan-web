/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthGate from "@/app/components/AuthGate";
import { apiFetch } from "@/app/lib/api";
import { uploadFile } from "@/app/lib/upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type Uploaded = { url: string; media_type: "IMAGE" | "VIDEO" };

export default function EditPetPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [type, setType] = useState<"DOG" | "CAT">("DOG");
  const [category, setCategory] = useState<"STRAY" | "OWNED">("STRAY");

  const [birthDate, setBirthDate] = useState("");
  const [age, setAge] = useState<string>("");
  const [sex, setSex] = useState<"" | "MALE" | "FEMALE">("");
  const [breed, setBreed] = useState("");
  const [adoptionFee, setAdoptionFee] = useState<string>("0");

  const [location, setLocation] = useState("");
  const [about, setAbout] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const [vaccinated, setVaccinated] = useState(false);
  const [dewormed, setDewormed] = useState(false);
  const [sprayed, setSprayed] = useState(false);

  const [currentMedia, setCurrentMedia] = useState<any[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [uploads, setUploads] = useState<Uploaded[]>([]);

  const canSave = useMemo(() => name.trim().length > 0, [name]);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const res = await apiFetch(`/pets/${id}`, { method: "GET" });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      const p = data.pet;
      setName(p.name ?? "");
      setType(p.type ?? "DOG");
      setCategory(p.category ?? "STRAY");
      setBirthDate(p.birth_date ? String(p.birth_date).slice(0, 10) : "");
      setAge(p.age !== null && p.age !== undefined ? String(p.age) : "");
      setSex(p.sex ?? "");
      setBreed(p.breed ?? "");
      setAdoptionFee(p.adoption_fee !== null && p.adoption_fee !== undefined ? String(p.adoption_fee) : "0");
      setLocation(p.location ?? "");
      setAbout(p.about ?? "");
      setContactInfo(p.contact_info ?? "");

      setVaccinated(Boolean(p.vaccinated));
      setDewormed(Boolean(p.dewormed));
      setSprayed(Boolean(p.sprayed));

      setCurrentMedia(data.media ?? []);
      setUploads([]);
      setFiles([]);
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

  async function uploadSelected() {
    setErr(null);
    if (files.length === 0) return;

    setSaving(true);
    try {
      const list: Uploaded[] = [];
      for (const f of files) {
        const r = await uploadFile(f);
        list.push({ url: r.url, media_type: r.media_type });
      }
      setUploads((prev) => [...prev, ...list]);
      setFiles([]);
    } catch (e: any) {
      setErr(e?.message ?? "Upload failed");
    } finally {
      setSaving(false);
    }
  }

  async function save() {
    setErr(null);
    if (!canSave) return;

    setSaving(true);
    try {
      // updatePetBodySchema allows nullable fields. We'll send only what you changed, but sending all is OK too.
      const patchBody: any = {
        name: name.trim(),
        type,
        category,
        birth_date: birthDate.trim() ? birthDate.trim() : null,
        age: age === "" ? null : Number(age),
        sex: sex ? sex : null,
        breed: breed.trim() ? breed.trim() : null,
        adoption_fee: adoptionFee === "" ? null : Number(adoptionFee),
        location: location.trim() ? location.trim() : null,
        about: about.trim() ? about.trim() : null,
        contact_info: contactInfo.trim() ? contactInfo.trim() : null,
        vaccinated,
        dewormed,
        sprayed,
      };

      const patchRes = await apiFetch(`/pets/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patchBody),
      });
      if (!patchRes.ok) throw new Error(await patchRes.text());

      // replace media only if user uploaded new ones
      if (uploads.length > 0) {
        const media = uploads.map((u, i) => ({
          media_type: u.media_type,
          url: u.url,
          is_profile: i === 0,
        }));

        const putRes = await apiFetch(`/pets/${id}/media`, {
          method: "PUT",
          body: JSON.stringify({ media }),
        });
        if (!putRes.ok) throw new Error(await putRes.text());
      }

      router.push(`/pets/${id}`);
    } catch (e: any) {
      setErr(e?.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AuthGate>
      <div className="min-h-screen bg-linear-to-b from-emerald-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => router.push(`/pets/${id}`)}>
              Back
            </Button>
            <Button variant="outline" onClick={load} disabled={saving}>
              Reload
            </Button>
          </div>

          <Card className="mt-6 rounded-2xl">
            <CardHeader>
              <CardTitle>Edit pet</CardTitle>
              <CardDescription>Edit details and (optionally) replace media.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {err && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {err}
                </div>
              )}

              {loading ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Name *</Label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={type}
                          onChange={(e) => setType(e.target.value as any)}>
                          <option value="DOG">DOG</option>
                          <option value="CAT">CAT</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label>Category</Label>
                        <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={category}
                          onChange={(e) => setCategory(e.target.value as any)}>
                          <option value="STRAY">STRAY</option>
                          <option value="OWNED">OWNED</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Birth date</Label>
                      <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Age</Label>
                      <Input type="number" min={0} value={age} onChange={(e) => setAge(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Sex</Label>
                      <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                        value={sex} onChange={(e) => setSex(e.target.value as any)}>
                        <option value="">Select</option>
                        <option value="MALE">MALE</option>
                        <option value="FEMALE">FEMALE</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Breed</Label>
                      <Input value={breed} onChange={(e) => setBreed(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Adoption fee</Label>
                      <Input type="number" min={0} value={adoptionFee} onChange={(e) => setAdoptionFee(e.target.value)} />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input value={location} onChange={(e) => setLocation(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact info</Label>
                      <Input value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>About</Label>
                    <Textarea value={about} onChange={(e) => setAbout(e.target.value)} />
                  </div>

                  <div className="rounded-2xl border p-4">
                    <p className="font-medium">Health</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={vaccinated} onChange={(e) => setVaccinated(e.target.checked)} />
                        Vaccinated
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={dewormed} onChange={(e) => setDewormed(e.target.checked)} />
                        Dewormed
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={sprayed} onChange={(e) => setSprayed(e.target.checked)} />
                        Sprayed
                      </label>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      {vaccinated && <Badge variant="secondary">Vaccinated</Badge>}
                      {dewormed && <Badge variant="secondary">Dewormed</Badge>}
                      {sprayed && <Badge className="bg-emerald-600 hover:bg-emerald-600">Sprayed</Badge>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Current media</Label>
                    {currentMedia.length === 0 ? (
                      <div className="text-xs text-muted-foreground">No media</div>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-3">
                        {currentMedia.map((m) => (
                          <div key={m.id} className="rounded-xl border p-2">
                            {m.media_type === "IMAGE" ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={m.url} alt="pet" className="h-28 w-full rounded-lg object-cover" />
                            ) : (
                              <div className="flex h-28 items-center justify-center rounded-lg bg-muted text-xs">VIDEO</div>
                            )}
                            <p className="mt-2 text-xs text-muted-foreground">{m.is_profile ? "Profile" : "Media"}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border p-4 space-y-3">
                    <div>
                      <p className="font-medium">Replace media (optional)</p>
                      <p className="text-xs text-muted-foreground">Upload new images/videos. Saving will replace all old media.</p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <input type="file" multiple accept="image/*,video/*" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
                      <Button type="button" variant="outline" onClick={uploadSelected} disabled={saving || files.length === 0}>
                        Upload selected
                      </Button>
                    </div>

                    {uploads.length > 0 && (
                      <div className="grid gap-3 sm:grid-cols-3">
                        {uploads.map((u, idx) => (
                          <div key={idx} className="rounded-xl border p-2">
                            {u.media_type === "IMAGE" ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={u.url} alt="new" className="h-28 w-full rounded-lg object-cover" />
                            ) : (
                              <div className="flex h-28 items-center justify-center rounded-lg bg-muted text-xs">VIDEO</div>
                            )}
                            <p className="mt-2 text-xs text-muted-foreground">{idx === 0 ? "New profile" : "New media"}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={save} disabled={saving || !canSave}>
                      {saving ? "Saving..." : "Save"}
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/profile")} disabled={saving}>
                      Profile
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGate>
  );
}