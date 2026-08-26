"use client";

import { useRouter } from "next/navigation";

export default function ClearDataButton({ siteId }: { siteId: string }) {
  const router = useRouter();

  async function handleClear() {
    const confirmed = confirm(
      "This will permanently delete all events for this site. Continue?",
    );
    if (!confirmed) return;

    await fetch(`/api/sites/${siteId}/events`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button
      onClick={handleClear}
      className="text-[13px] text-muted transition-colors hover:text-danger"
    >
      Clear data
    </button>
  );
}
