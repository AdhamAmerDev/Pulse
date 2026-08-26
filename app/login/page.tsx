"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper font-sans text-ink">
      <div className="w-full max-w-sm px-5">
        <p className="mb-8 font-mono text-[15px] font-medium tracking-[0.5px]">
          PULSE
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block font-mono text-[11px] tracking-[0.5px] text-muted">
              EMAIL
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border-[0.5px] border-border bg-paper px-3 py-2 text-[13px] text-ink outline-none focus:border-pulse"
            />
          </div>

          <div>
            <label className="mb-1 block font-mono text-[11px] tracking-[0.5px] text-muted">
              PASSWORD
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border-[0.5px] border-border bg-paper px-3 py-2 text-[13px] text-ink outline-none focus:border-pulse"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-danger-bg px-3 py-2 text-[13px] text-danger">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-pulse py-2 text-[13px] font-medium text-paper"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}
