"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/app/lib/api";
import { useRouter } from "next/navigation";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const res = await apiFetch("/me", { method: "GET" });
      if (!res.ok) {
        router.replace("/login");
        return;
      }
      setOk(true);
    })();
  }, [router]);

  if (ok === null) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-sm text-muted-foreground">
        Checking session...
      </div>
    );
  }

  return <>{children}</>;
}
