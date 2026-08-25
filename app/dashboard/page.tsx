import { db } from "../../lib/db";
import { auth } from "../../auth";
import { eq } from "drizzle-orm";
import { sites } from "../../lib/db/schema";
import LogoutButton from "../../components/LogoutButton";

export default async function Dashboard() {
  const session = await auth();
  const allSites = await db
    .select()
    .from(sites)
    .where(eq(sites.userId, session!.user.id));

  return (
    <div>
      <h1>Pulse Dashboard</h1>
      <LogoutButton />
      <p>
        <a href="/dashboard/sites/new">+ Add a new site</a>
      </p>

      <h2>Your Sites</h2>
      <ul>
        {allSites.map((site) => (
          <li key={site.id}>
            <a href={`/dashboard/${site.id}`}>{site.domain}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
