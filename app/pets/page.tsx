"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/app/lib/api";
import AuthGate from "@/app/pets/components/AuthGate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Pet = {
  id: string;
  name: string;
  type: "DOG" | "CAT";
  category: "STRAY" | "OWNED";
  location: string | null;
  created_at: string;
  is_active: boolean;
};

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const res = await apiFetch("/pets", { method: "GET" });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setPets(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load pets");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AuthGate>
      <div className="min-h-screen bg-linear-to-b from-emerald-50 to-white">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Pets</h1>
              <p className="text-sm text-muted-foreground">
                Post a pet to start filling the feed.
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
                <CardTitle>No pets yet</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Create 2–3 users, login, then post the first pet.
              </CardContent>
            </Card>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pets.map((p) => (
                <Link key={p.id} href={`/pets/${p.id}`}>
                  <Card className="rounded-2xl transition hover:shadow-sm">
                    <CardHeader className="space-y-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{p.name}</CardTitle>
                        <Badge variant="secondary">{p.type}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="bg-emerald-600 hover:bg-emerald-600">
                          {p.category}
                        </Badge>
                        {p.location && <Badge variant="outline">{p.location}</Badge>}
                      </div>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                      {new Date(p.created_at).toLocaleString()}
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
