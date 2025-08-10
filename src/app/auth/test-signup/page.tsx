
"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase-client";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function TestSignupPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
      setMsg("✅ Signed up!");
    } catch (err: any) {
      setMsg(`❌ ${err?.message || String(err)}`);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1>Test Signup</h1>
      <form onSubmit={onSubmit}>
        <label>Email<br />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </label>
        <br /><br />
        <label>Password<br />
          <input
            type="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </label>
        <br /><br />
        <button type="submit">Create Account</button>
      </form>
      {msg && <p style={{ marginTop: 16 }}>{msg}</p>}
    </div>
  );
}
