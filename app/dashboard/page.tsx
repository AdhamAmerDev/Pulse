async function getSites() {
  const res = await fetch("http://localhost:3000/api/sites", {
    cache: "no-store",
  });
  return res.json();
}

export default async function Dashboard() {
  const sites = await getSites();

  return (
    <div>
      <h1>Pulse Dashboard</h1>
      <p>
        <a href="/dashboard/sites/new">+ Add a new site</a>
      </p>

      <h2>Your Sites</h2>
      <ul>
        {sites.map((site: any) => (
          <li key={site.id}>
            <a href={`/dashboard/${site.id}`}>{site.domain}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
