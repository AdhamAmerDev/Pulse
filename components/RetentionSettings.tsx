"use client";

import { useEffect, useState } from "react";

const retentionOptions = [
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
  { value: "365", label: "1 year" },
  { value: "forever", label: "Keep forever" },
];

export default function RetentionSettings({ siteId }: { siteId: string }) {
  const [value, setValue] = useState("365");
  const [status, setStatus] = useState<"loading" | "saved" | "error">(
    "loading",
  );

  useEffect(() => {
    fetch(`/api/sites/${siteId}/settings`)
      .then(async (response) => {
        if (!response.ok) throw new Error();
        const settings = await response.json();
        setValue(
          settings.retentionDays === null
            ? "forever"
            : String(settings.retentionDays),
        );
        setStatus("saved");
      })
      .catch(() => setStatus("error"));
  }, [siteId]);

  async function saveRetention(nextValue: string) {
    const previousValue = value;
    setValue(nextValue);
    setStatus("loading");

    try {
      const response = await fetch(`/api/sites/${siteId}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          retentionDays: nextValue === "forever" ? null : Number(nextValue),
        }),
      });

      if (!response.ok) throw new Error("Retention setting failed");
      setStatus("saved");
    } catch {
      setValue(previousValue);
      setStatus("error");
    }
  }

  return (
    <div>
      <label
        htmlFor="retention"
        className="font-mono text-[11px] tracking-[0.5px] text-muted"
      >
        EVENT RETENTION
      </label>
      <p className="mt-2 text-[13px] text-muted">
        Older events are removed by the scheduled cleanup job.
      </p>
      <select
        id="retention"
        value={value}
        disabled={status === "loading" && value === "365"}
        onChange={(event) => saveRetention(event.target.value)}
        className="mt-4 rounded-xl border-[0.5px] border-border bg-paper px-3 py-2 text-[13px] text-ink outline-none focus:border-pulse"
      >
        {retentionOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <p
        className={`mt-2 text-[12px] ${status === "error" ? "text-danger" : "text-muted"}`}
      >
        {status === "loading"
          ? "Saving..."
          : status === "error"
            ? "Couldn't save this setting. Try again."
            : "Saved"}
      </p>
    </div>
  );
}
