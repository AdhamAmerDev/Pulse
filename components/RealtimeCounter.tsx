"use client";

import { useEffect, useState } from "react";

export default function RealtimeCounter({ siteId }: { siteId: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchCount() {
      const res = await fetch(`/api/sites/${siteId}/realtime`);
      const data = await res.json();
      if (active) setCount(data.count);
    }

    fetchCount();
    const interval = setInterval(fetchCount, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [siteId]);

  return (
    <div className="flex items-center gap-1.5 text-[13px] text-vital">
      <span className="h-1.5 w-1.5 rounded-full bg-vital animate-pulse-beat" />
      {count === null ? "—" : count} live
    </div>
  );
}
