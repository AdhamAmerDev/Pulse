import ClearDataButton from "@/components/ClearDataButton";
import { db } from "../../../lib/db";
import { events } from "../../../lib/db/schema";
import { eq } from "drizzle-orm";
import ZoomableViewsChart from "@/components/ZoomableViewsChart";

function summarize(allEvents: any[]) {
  const totalViews = allEvents.length;

  const viewsByUrl: Record<string, number> = {};
  for (const event of allEvents) {
    viewsByUrl[event.url] = (viewsByUrl[event.url] || 0) + 1;
  }

  const viewsByDevice: Record<string, number> = {};
  for (const event of allEvents) {
    viewsByDevice[event.device] = (viewsByDevice[event.device] || 0) + 1;
  }

  return { totalViews, viewsByUrl, viewsByDevice };
}

export default async function SiteDashboard({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;

  const siteEvents = await db
    .select()
    .from(events)
    .where(eq(events.siteId, siteId));
  const { totalViews, viewsByUrl, viewsByDevice } = summarize(siteEvents);

  return (
    <div>
      <a href="/dashboard">← Back to all sites</a>
      <h1>Site Stats</h1>

      <h2>Total Views: {totalViews}</h2>

      <h3>Views per Page</h3>
      <ul>
        {Object.entries(viewsByUrl).map(([url, count]) => (
          <li key={url}>
            {url}: {count}
          </li>
        ))}
      </ul>

      <h3>Device Breakdown</h3>
      <ul>
        {Object.entries(viewsByDevice).map(([device, count]) => (
          <li key={device}>
            {device}: {count}
          </li>
        ))}
      </ul>
      <ClearDataButton siteId={siteId} />
      <ZoomableViewsChart siteId={siteId} />
    </div>
  );
}
