/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AuthGate from "@/app/components/AuthGate";
import { apiFetch } from "@/app/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type Pet = {
  id: string;
  name: string;
  type: "DOG" | "CAT";
  category: "STRAY" | "OWNED";
  location: string | null;
  age?: number | null;
  breed?: string | null;

  sprayed?: boolean;
  vaccinated?: boolean;
  dewormed?: boolean;

  created_at: string;
  is_active: boolean;

  profile_img?: string | null;
};

export default function PetsPage() {
  // Top search inputs
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  // Left filters
  const [typeDog, setTypeDog] = useState(true);
  const [typeCat, setTypeCat] = useState(true);

  const [category, setCategory] = useState<"" | "STRAY" | "OWNED">("");
  const [isActive, setIsActive] = useState<"" | "true" | "false">("true");

  const [sprayedOnly, setSprayedOnly] = useState(false);
  const [vaccinatedOnly, setVaccinatedOnly] = useState(false);
  const [dewormedOnly, setDewormedOnly] = useState(false);

  // Applied filters
  const [applied, setApplied] = useState({
    search: "",
    location: "",
    typeDog: true,
    typeCat: true,
    category: "" as "" | "STRAY" | "OWNED",
    isActive: "true" as "" | "true" | "false",
    sprayedOnly: false,
    vaccinatedOnly: false,
    dewormedOnly: false,
  });

  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const q = new URLSearchParams();
    q.set("limit", "60");

    if (applied.search.trim()) q.set("search", applied.search.trim());
    if (applied.location.trim()) q.set("location", applied.location.trim());

    if (applied.category) q.set("category", applied.category);
    if (applied.isActive) q.set("is_active", applied.isActive);

    if (applied.typeDog && !applied.typeCat) q.set("type", "DOG");
    if (!applied.typeDog && applied.typeCat) q.set("type", "CAT");

    if (applied.sprayedOnly) q.set("sprayed", "true");
    if (applied.vaccinatedOnly) q.set("vaccinated", "true");
    if (applied.dewormedOnly) q.set("dewormed", "true");

    return q.toString();
  }, [applied]);

  async function load() {
    setErr(null);

    if (!applied.typeDog && !applied.typeCat) {
      setPets([]);
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch(`/pets?${queryString}`, { method: "GET" });
      if (!res.ok) throw new Error(await res.text());
      setPets(await res.json());
    } catch (e: any) {
      setErr(e?.message ?? "Амьтдын мэдээллийг ачааллахад алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  function applyFilters() {
    setApplied({
      search,
      location,
      typeDog,
      typeCat,
      category,
      isActive,
      sprayedOnly,
      vaccinatedOnly,
      dewormedOnly,
    });
  }

  function resetAll() {
    setSearch("");
    setLocation("");
    setTypeDog(true);
    setTypeCat(true);
    setCategory("");
    setIsActive("true");
    setSprayedOnly(false);
    setVaccinatedOnly(false);
    setDewormedOnly(false);

    setApplied({
      search: "",
      location: "",
      typeDog: true,
      typeCat: true,
      category: "",
      isActive: "true",
      sprayedOnly: false,
      vaccinatedOnly: false,
      dewormedOnly: false,
    });
  }

  return (
    <AuthGate>
      <div className="min-h-screen bg-white">
        {/* Top bar */}
        <div className="border-b bg-white">
          <div className="mx-auto max-w-6xl px-4 py-6">
            {/* Search bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex w-full items-center gap-2 rounded-2xl border bg-white px-3 py-2">
                <span className="text-muted-foreground"></span>
                <Input
                  className="border-0 shadow-none focus-visible:ring-0"
                  placeholder="Амьтнаар хайх..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <Button
                className="h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700"
                onClick={applyFilters}
              >
                Хайх
              </Button>

              <Button
                variant="outline"
                className="h-11 rounded-2xl"
                onClick={resetAll}
              >
                Цэвэрлэх
              </Button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold">
                  Үрчлүүлэх боломжтой амьтад
                </h1>
                <p className="text-sm text-muted-foreground">
                  {loading
                    ? "Ачаалж байна..."
                    : `${pets.length} амьтан олдлоо`}
                </p>
              </div>

              <Button
                asChild
                className="rounded-2xl bg-emerald-600 hover:bg-emerald-700"
              >
                <Link href="/pets/new">Амьтан нийтлэх</Link>
              </Button>
            </div>

            {err && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {err}
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[280px_1fr]">
          {/* Filters */}
          <aside className="h-fit rounded-2xl border bg-white p-4">
            <h2 className="text-sm font-semibold">Шүүлтүүр</h2>

            <div className="mt-5 space-y-5">
              <div className="space-y-2">
                <Label>Байршил</Label>
                <Input
                  placeholder="УБ, Баянзүрх..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Ангилал</Label>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                >
                  <option value="">Бүгд</option>
                  <option value="STRAY">Эзэнгүй</option>
                  <option value="OWNED">Эзэнтэй</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Амьтны төрөл</Label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={typeDog}
                    onChange={(e) => setTypeDog(e.target.checked)}
                    className="h-4 w-4"
                  />
                  Нохой
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={typeCat}
                    onChange={(e) => setTypeCat(e.target.checked)}
                    className="h-4 w-4"
                  />
                  Муур
                </label>

                {!typeDog && !typeCat && (
                  <p className="text-xs text-red-600">
                    Дор хаяж нэг төрлийг сонгоно уу.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Төлөв</Label>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={isActive}
                  onChange={(e) => setIsActive(e.target.value as any)}
                >
                  <option value="">Бүгд</option>
                  <option value="true">Идэвхтэй</option>
                  <option value="false">Идэвхгүй</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Эрүүл мэнд</Label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={sprayedOnly}
                    onChange={(e) => setSprayedOnly(e.target.checked)}
                    className="h-4 w-4"
                  />
                  Ариутгасан
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={vaccinatedOnly}
                    onChange={(e) => setVaccinatedOnly(e.target.checked)}
                    className="h-4 w-4"
                  />
                  Вакцинд хамрагдсан
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={dewormedOnly}
                    onChange={(e) => setDewormedOnly(e.target.checked)}
                    className="h-4 w-4"
                  />
                  Туулга хийлгэсэн
                </label>
              </div>

              <Button
                variant="outline"
                className="w-full rounded-2xl"
                onClick={applyFilters}
              >
                Шүүлтүүр хэрэгжүүлэх
              </Button>
            </div>
          </aside>

          {/* Cards */}
          <section>
            {loading ? (
              <div className="text-sm text-muted-foreground">
                Амьтдын мэдээллийг ачаалж байна...
              </div>
            ) : pets.length === 0 ? (
              <Card className="rounded-2xl">
                <CardContent className="p-6 text-sm text-muted-foreground">
                  Тохирох амьтан олдсонгүй. Хайлтаа өөрчилж үзнэ үү.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {pets.map((p) => (
                  <Card key={p.id} className="rounded-2xl border shadow-sm">
                    <CardContent className="p-3">
                      <div className="relative">
                        {p.profile_img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.profile_img}
                            alt={p.name}
                            className="h-44 w-full rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-44 w-full items-center justify-center rounded-xl bg-muted text-xs text-muted-foreground">
                            Зураг байхгүй
                          </div>
                        )}

                        <div className="absolute left-2 top-2 flex flex-wrap gap-2">
                          {p.sprayed && (
                            <span className="rounded-full bg-emerald-600 px-2 py-1 text-xs text-white">
                              Ариутгасан
                            </span>
                          )}
                          {p.vaccinated && (
                            <span className="rounded-full bg-white/90 px-2 py-1 text-xs">
                              Вакцинтай
                            </span>
                          )}
                          {p.dewormed && (
                            <span className="rounded-full bg-white/90 px-2 py-1 text-xs">
                              Туулгатай
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-base font-semibold">
                            {p.name}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {p.location || "Байршил тодорхойгүй"}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="secondary">
                            {p.type === "DOG" ? "Нохой" : "Муур"}
                          </Badge>
                          <Badge className="bg-emerald-600 hover:bg-emerald-600">
                            {p.category === "STRAY" ? "Эзэнгүй" : "Эзэнтэй"}
                          </Badge>
                        </div>
                      </div>

                      <Button
                        asChild
                        className="mt-3 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Link href={`/pets/${p.id}`}>
                          Дэлгэрэнгүй үзэх
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </AuthGate>
  );
}
