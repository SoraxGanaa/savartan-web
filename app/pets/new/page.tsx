/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGate from "../../components/AuthGate";
import { apiFetch } from "@/app/lib/api";
import { uploadFile } from "@/app/lib/upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type Uploaded = { url: string; media_type: "IMAGE" | "VIDEO" };

export default function NewPetPage() {
  const router = useRouter();

  // required
  const [name, setName] = useState("");
  const [type, setType] = useState<"DOG" | "CAT">("DOG");
  const [category, setCategory] = useState<"STRAY" | "OWNED">("STRAY");

  // optional (schema fields)
  const [birthDate, setBirthDate] = useState(""); // "YYYY-MM-DD"
  const [age, setAge] = useState<string>("");
  const [sex, setSex] = useState<"" | "MALE" | "FEMALE">("");
  const [breed, setBreed] = useState("");
  const [adoptionFee, setAdoptionFee] = useState<string>("0");
  const [location, setLocation] = useState("");
  const [about, setAbout] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  // booleans
  const [vaccinated, setVaccinated] = useState(false);
  const [dewormed, setDewormed] = useState(false);
  const [sprayed, setSprayed] = useState(false);

  // media
  const [files, setFiles] = useState<File[]>([]);
  const [uploads, setUploads] = useState<Uploaded[]>([]);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const canSubmit = useMemo(() => name.trim().length > 0, [name]);

  async function uploadSelected() {
    setErr(null);
    if (files.length === 0) return;

    setLoading(true);
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
      setLoading(false);
    }
  }

  async function createPet() {
    setErr(null);
    if (!canSubmit) return;

    setLoading(true);
    try {
      const body: any = {
        name: name.trim(),
        category,
        type,
      };

      // match schema: nullable fields should be omitted OR set null
      if (birthDate.trim()) body.birth_date = birthDate.trim();
      if (age !== "") body.age = Number(age);
      if (sex) body.sex = sex;
      if (breed.trim()) body.breed = breed.trim();
      if (adoptionFee !== "") body.adoption_fee = Number(adoptionFee);
      if (location.trim()) body.location = location.trim();
      if (about.trim()) body.about = about.trim();
      if (contactInfo.trim()) body.contact_info = contactInfo.trim();

      body.vaccinated = vaccinated;
      body.dewormed = dewormed;
      body.sprayed = sprayed;

      if (uploads.length > 0) {
        body.media = uploads.map((u, i) => ({
          media_type: u.media_type,
          url: u.url,
          is_profile: i === 0,
        }));
      }

      const res = await apiFetch("/pets", {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      router.push(`/pets/${data.pet.id}`);
    } catch (e: any) {
      setErr(e?.message ?? "Create failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthGate>
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Post a pet</CardTitle>
              <CardDescription>Fill details and upload media (optional).</CardDescription>
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
                    <Label>Type *</Label>
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
                    <Label>Category *</Label>
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

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Birth date</Label>
                  <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input
                    type="number"
                    min={0}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="2"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sex</Label>
                  <select
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={sex}
                    onChange={(e) => setSex(e.target.value as any)}
                  >
                    <option value="">Select</option>
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Breed</Label>
                  <Input value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="Golden Retriever" />
                </div>
                <div className="space-y-2">
                  <Label>Adoption fee</Label>
                  <Input
                    type="number"
                    min={0}
                    value={adoptionFee}
                    onChange={(e) => setAdoptionFee(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="UB" />
                </div>
                <div className="space-y-2">
                  <Label>Contact info</Label>
                  <Input value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} placeholder="99112233" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>About</Label>
                <Textarea value={about} onChange={(e) => setAbout(e.target.value)} placeholder="Friendly..." />
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

              <div className="rounded-2xl border p-4 space-y-3">
                <div>
                  <p className="font-medium">Media</p>
                  <p className="text-xs text-muted-foreground">First uploaded becomes profile.</p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input type="file" multiple accept="image/*,video/*" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
                  <Button variant="outline" type="button" onClick={uploadSelected} disabled={loading || files.length === 0}>
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
                          <div className="flex h-28 items-center justify-center rounded-lg bg-muted text-xs">VIDEO</div>
                        )}
                        <p className="mt-2 text-xs text-muted-foreground">
                          {idx === 0 ? "Profile" : "Media"} • {u.media_type}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={createPet} disabled={loading || !canSubmit}>
                  {loading ? "Saving..." : "Create"}
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
