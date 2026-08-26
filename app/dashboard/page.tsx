import { db } from "@/lib/db";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { sites } from "@/lib/db/schema";
import LogoutButton from "@/components/LogoutButton";

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const allSites = await db
    .select()
    .from(sites)
    .where(eq(sites.userId, session!.user.id));

  return (
    <div>
      <h1>Pulse Dashboard</h1>
      <LogoutButton />
      <p>
        <Link href="/dashboard/sites/new">+ Add a new site</Link>
      </p>

      <h2>Your Sites</h2>
      <ul>
        {allSites.map((site) => (
          <li key={site.id}>
            <Link href={`/dashboard/${site.id}`}>{site.domain}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
