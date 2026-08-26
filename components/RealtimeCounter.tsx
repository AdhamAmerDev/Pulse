"use client";

import { useEffect, useState } from "react";

export default function RealtimeCounter({ siteId }: { siteId: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCount() {
      const res = await fetch(`/api/sites/${siteId}/realtime`);
      const data = await res.json();
      setCount(data.count);
    }

    fetchCount();
    const interval = setInterval(fetchCount, 5000);

    return () => clearInterval(interval);
  }, [siteId]);

  return (
    <div>
      {count === null ? "..." : count} visitor{count !== 1 ? "s" : ""} in the
      last 5 minutes
    </div>
  );
}
