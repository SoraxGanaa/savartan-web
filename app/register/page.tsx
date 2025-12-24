/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { registerUser, login } from "@/app/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [sex, setSex] = useState<"MALE" | "FEMALE" | "">("");
  const [age, setAge] = useState<string>("");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return name.trim().length > 0 && phone.trim().length >= 6 && password.length >= 8;
  }, [name, phone, password]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!canSubmit) return;

    setLoading(true);
    try {
      await registerUser({
        name: name.trim(),
        phone_number: phone.trim(),
        email: email.trim() ? email.trim() : undefined,
        password,
        location: location.trim() ? location.trim() : undefined,
        sex: sex ? (sex as any) : undefined,
        age: age ? Number(age) : undefined,
      });

      // auto-login after register (nice UX)
      await login(phone.trim(), password);

      router.push("/pets");
    } catch (e: any) {
      setErr(e?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
        <Card className="w-full rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Create an account to post pets.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {err && (
              <Alert variant="destructive">
                <AlertDescription className="break-words">{err}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone number *</Label>
                <Input
                  id="phone"
                  placeholder="99112233"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  placeholder="you@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="age">Age (optional)</Label>
                  <Input
                    id="age"
                    type="number"
                    min={0}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sex">Sex (optional)</Label>
                  <select
                    id="sex"
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

              <div className="space-y-2">
                <Label htmlFor="location">Location (optional)</Label>
                <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="min 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={loading || !canSubmit}
              >
                {loading ? "Creating..." : "Create account"}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground">
              Already have account?{" "}
              <Link className="font-medium text-emerald-700 hover:underline" href="/login">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
