async function getEvents() {
  const res = await fetch("http://localhost:3000/api/events", {
    cache: "no-store",
  });
  return res.json();
}

function summarize(events: any[]) {
  const totalViews = events.length;

  // count views per URL
  const viewsByUrl: Record<string, number> = {};
  for (const event of events) {
    viewsByUrl[event.url] = (viewsByUrl[event.url] || 0) + 1;
  }

  // count views per device
  const viewsByDevice: Record<string, number> = {};
  for (const event of events) {
    viewsByDevice[event.device] = (viewsByDevice[event.device] || 0) + 1;
  }

  return { totalViews, viewsByUrl, viewsByDevice };
}

export default async function Dashboard() {
  const events = await getEvents();
  const { totalViews, viewsByUrl, viewsByDevice } = summarize(events);

  return (
    <div>
      <h1>Pulse Dashboard</h1>

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
