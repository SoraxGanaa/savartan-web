"use client";

import { useState } from "react";
import { login } from "../lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const r = useRouter();
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState<string | null>(null);

  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <h1>Login</h1>

      <input placeholder="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <br />
      <input placeholder="password" type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
      <br />

      <button
        onClick={async () => {
          try {
            setErr(null);
            await login(phone, pass);
            r.push("/pets");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (e: any) {
            setErr(e?.message ?? "Login failed");
          }
        }}
      >
        Login
      </button>

      {err && <p style={{ color: "red" }}>{err}</p>}
    </div>
  );
}
