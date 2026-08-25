"use client";
import { useState } from "react";

export default function NewSite() {
  const [domain, setDomain] = useState("");
  const [createdSite, setCreatedSite] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain }),
    });

    const site = await res.json();
    setCreatedSite(site);
  }

  return (
    <div>
      <h1>Add a Site</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="mycoolstore.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <button type="submit">Create Site</button>
      </form>

      {createdSite && (
        <div>
          <h2>Site created!</h2>
          <p>Site ID: {createdSite.id}</p>
          <p>Embed this on your website:</p>
          <pre>
            {`<script src="http://localhost:3000/pulse.js" data-site="${createdSite.id}"></script>`}
          </pre>
        </div>
      )}
    </div>
  );
}
