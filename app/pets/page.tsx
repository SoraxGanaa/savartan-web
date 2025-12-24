"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../lib/api";

export default function PetsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pets, setPets] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await apiFetch("/pets", { method: "GET" });
      if (!res.ok) {
        setErr(await res.text());
        return;
      }
      setPets(await res.json());
    })();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <h1>Pets</h1>
      <Link href="/pets/new">Create new</Link>

      {err && <p style={{ color: "red" }}>{err}</p>}

      <ul>
        {pets.map((p) => (
          <li key={p.id}>
            <Link href={`/pets/${p.id}`}>{p.name} ({p.type}/{p.category})</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
