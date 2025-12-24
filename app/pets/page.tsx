/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AuthGate from "@/app/pets/components/AuthGate";
import { apiFetch } from "@/app/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Pet = {
  id: string;
  name: string;
  type: "DOG" | "CAT";
  category: "STRAY" | "OWNED";
  location: string | null;
  created_at: string;
  is_active: boolean;
  profile_img?: string | null;
};

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // filters
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"" | "DOG" | "CAT">("");
  const [category, setCategory] = useState<"" | "STRAY" | "OWNED">("");
  const [isActive, setIsActive] = useState<"" | "true" | "false">("true");

  const queryString = useMemo(() => {
    const q = new URLSearchParams();
    if (search.trim()) q.set("search", search.trim());
    if (type) q.set("type", type);
    if (category) q.set("category", category);
    if (isActive) q.set("is_active", isActive);
    q.set("limit", "60");
    return q.toString();
  }, [search, type, category, isActive]);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const res = await apiFetch(`/pets?${queryString}`, { method: "GET" });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setPets(data);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load pets");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  return (
    <AuthGate>
      <div className="min-h-screen bg-linear-to-b from-emerald-50 to-white">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Pets</h1>
              <p className="text-sm text-muted-foreground">
                Filter and browse. Upload media when posting.
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={load} disabled={loading}>
                Refresh
              </Button>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/pets/new">Post pet</Link>
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="mt-6 rounded-2xl">
            <CardContent className="grid gap-4 p-4 sm:grid-cols-4">
              <div className="space-y-2 sm:col-span-2">
                <Label>Search</Label>
                <Input
                  placeholder="name, breed, location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                >
                  <option value="">All</option>
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
                  <option value="">All</option>
                  <option value="STRAY">STRAY</option>
                  <option value="OWNED">OWNED</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={isActive}
                  onChange={(e) => setIsActive(e.target.value as any)}
                >
                  <option value="">All</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="flex items-end gap-2 sm:col-span-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setType("");
                    setCategory("");
                    setIsActive("true");
                  }}
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {err && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {err}
            </div>
          )}

          {loading ? (
            <div className="mt-10 text-sm text-muted-foreground">Loading...</div>
          ) : pets.length === 0 ? (
            <Card className="mt-8 rounded-2xl">
              <CardHeader>
                <CardTitle>No pets found</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Try clearing filters or post the first pet.
              </CardContent>
            </Card>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pets.map((p) => (
                <Link key={p.id} href={`/pets/${p.id}`}>
                  <Card className="rounded-2xl transition hover:shadow-sm">
                    <CardContent className="p-3">
                      {p.profile_img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.profile_img}
                          alt={p.name}
                          className="h-44 w-full rounded-xl object-cover"
                        />
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
                        <Badge className="bg-emerald-600 hover:bg-emerald-600">
                          {p.category}
                        </Badge>
                        {p.location && <Badge variant="outline">{p.location}</Badge>}
                      </div>

                      <p className="mt-2 text-xs text-muted-foreground">
                        {new Date(p.created_at).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGate>
  );
}
