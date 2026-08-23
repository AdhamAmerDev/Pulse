async function getEvents(siteId: string) {
  const res = await fetch(`http://localhost:3000/api/events?siteId=${siteId}`, {
    cache: "no-store",
  });
  return res.json();
}

function summarize(events: any[]) {
  const totalViews = events.length;

  const viewsByUrl: Record<string, number> = {};
  for (const event of events) {
    viewsByUrl[event.url] = (viewsByUrl[event.url] || 0) + 1;
  }

  const viewsByDevice: Record<string, number> = {};
  for (const event of events) {
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
  const events = await getEvents(siteId);
  const { totalViews, viewsByUrl, viewsByDevice } = summarize(events);

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
    </div>
  );
}
