/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/app/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(phone.trim(), password);
      router.push("/pets"); // we'll build pets page next
    } catch (e: any) {
      setErr(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-emerald-50 to-white">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
        <Card className="w-full rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Use your phone number and password.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {err && (
              <Alert variant="destructive">
                <AlertDescription className="wrap-break-word">{err}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  placeholder="99112233"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="********"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground">
              No account?{" "}
              <Link className="font-medium text-emerald-700 hover:underline" href="/register">
                Register
              </Link>
            </p>

            <p className="text-xs text-muted-foreground">
              Tip: If you get CORS/cookie errors, backend must allow{" "}
              <span className="font-medium">credentials</span> for localhost:3000.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
