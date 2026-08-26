import Link from "next/link";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { sites } from "@/lib/db/schema";

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const allSites = await db
    .select()
    .from(sites)
    .where(eq(sites.userId, session.user.id));

  return (
    <>
      <div className="flex items-center justify-between px-5 py-4">
        <p className="font-mono text-[11px] tracking-[0.5px] text-muted">
          YOUR SITES
        </p>
        <Link
          href="/dashboard/sites/new"
          className="rounded-xl bg-pulse px-3.5 py-1.5 text-[13px] font-medium text-paper"
        >
          Add site
        </Link>
      </div>

      {allSites.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-[15px] font-medium">No sites yet</p>
          <p className="mt-1 text-[13px] text-muted">
            Add your first site to start tracking its traffic.
          </p>
          <Link
            href="/dashboard/sites/new"
            className="mt-4 inline-block rounded-xl bg-pulse px-3.5 py-1.5 text-[13px] font-medium text-paper"
          >
            Add site
          </Link>
        </div>
      ) : (
        <ul className="border-t-[0.5px] border-border">
          {allSites.map((site) => (
            <li key={site.id} className="border-b-[0.5px] border-border">
              <Link
                href={`/dashboard/${site.id}`}
                className="flex items-center justify-between px-5 py-3.5 text-[13px] transition-colors hover:bg-paper-grid"
              >
                <span>{site.domain}</span>
                <span className="font-mono text-muted">→</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
