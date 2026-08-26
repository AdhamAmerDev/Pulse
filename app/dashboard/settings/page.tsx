import Link from "next/link";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { sites } from "@/lib/db/schema";
import RetentionSettings from "@/components/RetentionSettings";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) notFound();

  const userSites = await db
    .select({ id: sites.id, domain: sites.domain })
    .from(sites)
    .where(eq(sites.userId, session.user.id));

  return (
    <main className="mx-auto max-w-2xl px-5 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] tracking-[0.5px] text-muted">
            SETTINGS
          </p>
          <h1 className="mt-2 text-[20px] font-medium">Site settings</h1>
        </div>
        <Link
          href="/dashboard"
          className="text-[13px] text-muted hover:text-ink"
        >
          ← Back
        </Link>
      </div>

      {userSites.length === 0 ? (
        <p className="text-[13px] text-muted">
          Add a site before changing its settings.
        </p>
      ) : (
        <div className="divide-y-[0.5px] divide-border border-y-[0.5px] border-border">
          {userSites.map((site) => (
            <section key={site.id} className="py-5">
              <h2 className="mb-4 text-[15px] font-medium">{site.domain}</h2>
              <RetentionSettings siteId={site.id} />
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
