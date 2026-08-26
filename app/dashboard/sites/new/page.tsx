"use client";

import { useState } from "react";
import Link from "next/link";

type CreatedSite = { id?: string; ingestKey?: string; error?: string };

export default function NewSite() {
  const [domain, setDomain] = useState("");
  const [createdSite, setCreatedSite] = useState<CreatedSite | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain }),
    });

    const site = await res.json();

    if (!res.ok) {
      setError(site.error || "Couldn't create the site. Try again.");
      return;
    }

    setCreatedSite(site);
  }

  const embedSnippet = createdSite
    ? `<script src="${process.env.NEXT_PUBLIC_APP_URL || ""}/pulse.js" data-site="${createdSite.id}" data-key="${createdSite.ingestKey}"></script>`
    : "";

  return (
    <div className="mx-auto max-w-md px-5 py-8">
      <Link href="/dashboard" className="text-[13px] text-muted hover:text-ink">
        ← Back to sites
      </Link>
      <div className="pt-6">
        <p className="mb-4 font-mono text-[11px] tracking-[0.5px] text-muted">
          ADD A SITE
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            required
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="mycoolstore.com"
            className="flex-1 rounded-xl border-[0.5px] border-border bg-paper px-3 py-2 text-[13px] text-ink outline-none focus:border-pulse"
          />
          <button
            type="submit"
            className="rounded-xl bg-pulse px-4 py-2 text-[13px] font-medium text-paper"
          >
            Create
          </button>
        </form>

        {error && (
          <p className="mt-3 rounded-xl bg-danger-bg px-3 py-2 text-[13px] text-danger">
            {error}
          </p>
        )}

        {createdSite && (
          <div className="mt-6 border-t-[0.5px] border-border pt-6">
            <p className="text-[13px] font-medium text-vital">Site created</p>
            <p className="mt-3 font-mono text-[11px] tracking-[0.5px] text-muted">
              EMBED THIS ON YOUR SITE
            </p>
            <pre className="mt-2 overflow-x-auto rounded-xl border-[0.5px] border-border bg-paper-grid px-3 py-2.5 font-mono text-[12px] text-ink">
              {embedSnippet}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
