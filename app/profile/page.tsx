/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthGate from "@/app/components/AuthGate";
import { apiFetch } from "@/app/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [user, setUser] = useState<any>(null);
  const [pets, setPets] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const res = await apiFetch("/profile", { method: "GET" });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setUser(data.user);
      setPets(data.pets || []);
      setName(data.user?.name || "");
      setPhone(data.user?.phone_number || "");
      setLocation(data.user?.location || "");
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    setErr(null);
    setSaving(true);
    try {
      const res = await apiFetch("/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name: name.trim(),
          phone_number: phone.trim(),
          location: location.trim(),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      await load();
    } catch (e: any) {
      setErr(e?.message ?? "Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function deletePet(petId: string) {
    if (!confirm("Delete this pet? Media will be deleted from S3 too.")) return;
    const res = await apiFetch(`/pets/${petId}`, { method: "DELETE" });
    if (!res.ok) {
      alert(await res.text());
      return;
    }
    await load();
  }

  return (
    <AuthGate>
      <div className="min-h-screen bg-linear-to-b from-emerald-50 to-white">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Profile</h1>
              <p className="text-sm text-muted-foreground">Edit your info and manage your pets.</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/pets">Back to pets</Link>
            </Button>
          </div>

          {err && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {err}
            </div>
          )}

          {loading ? (
            <div className="mt-8 text-sm text-muted-foreground">Loading...</div>
          ) : (
            <>
              <Card className="mt-6 rounded-2xl">
                <CardHeader>
                  <CardTitle>My info</CardTitle>
                  <CardDescription>Update name, phone, and location.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input value={location} onChange={(e) => setLocation(e.target.value)} />
                  </div>

                  <div className="sm:col-span-3">
                    <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={save} disabled={saving}>
                      {saving ? "Saving..." : "Save changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-10 flex items-center justify-between">
                <h2 className="text-xl font-semibold">My pets</h2>
                <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                  <Link href="/pets/new">Post pet</Link>
                </Button>
              </div>

              {pets.length === 0 ? (
                <Card className="mt-4 rounded-2xl">
                  <CardHeader>
                    <CardTitle>No pets yet</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Post your first pet and it will appear here.
                  </CardContent>
                </Card>
              ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {pets.map((p) => (
                    <Card key={p.id} className="rounded-2xl">
                      <CardContent className="p-3">
                        {p.profile_img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.profile_img} alt={p.name} className="h-44 w-full rounded-xl object-cover" />
                        ) : (
                          <div className="flex h-44 w-full items-center justify-center rounded-xl bg-muted text-xs text-muted-foreground">
                            No image
                          </div>
                        )}

                        <div className="mt-3 flex items-center justify-between">
                          <p className="truncate text-base font-semibold">{p.name}</p>
                          <Badge variant="secondary">{p.type}</Badge>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge className="bg-emerald-600 hover:bg-emerald-600">{p.category}</Badge>
                          {p.location && <Badge variant="outline">{p.location}</Badge>}
                        </div>

                        <div className="mt-3 flex gap-2 w-fit">
                          <Button asChild variant="outline" className="w-full">
                            <Link href={`/pets/${p.id}/edit`}>Edit</Link>
                          </Button>
                          <Button variant="destructive" className="w-full" onClick={() => deletePet(p.id)}>
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AuthGate>
  );
}
