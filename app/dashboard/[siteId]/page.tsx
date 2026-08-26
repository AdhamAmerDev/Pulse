import Link from "next/link";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { sites } from "@/lib/db/schema";
import { summarizeSite } from "@/lib/analytics/summarize";
import ClearDataButton from "@/components/ClearDataButton";
import { getVisitorCount } from "@/lib/analytics/summarize";
import RealtimeCounter from "@/components/RealtimeCounter";
import ZoomableViewsChart from "@/components/ZoomableViewsChart";

function topEntries(counts: Record<string, number>, limit = 5) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function percentage(count: number, total: number) {
  return total === 0 ? 0 : Math.round((count / total) * 100);
}

export default async function SiteDashboard({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { siteId } = await params;
  const [site] = await db.select().from(sites).where(eq(sites.id, siteId));
  if (!site || site.userId !== session.user.id) notFound();

  const { totalViews, viewsByUrl, viewsByDevice, viewsByReferrer } =
    await summarizeSite(siteId);

  const topPages = topEntries(viewsByUrl);
  const topDevices = topEntries(viewsByDevice);
  const topReferrers = topEntries(viewsByReferrer);
  const visitorCount = await getVisitorCount(siteId);

  return (
    <>
      <div className="flex items-center justify-between border-b-[0.5px] border-border px-5 py-3">
        <div className="flex items-center gap-2 text-[13px] text-muted">
          <Link href="/dashboard" className="hover:text-ink">
            Your sites
          </Link>
          <span>/</span>
          <span>{site.domain}</span>
        </div>
        <div className="flex items-center gap-3">
          <RealtimeCounter siteId={siteId} />
          <ClearDataButton siteId={siteId} />
        </div>
      </div>

      <section className="grid grid-cols-2 divide-x-[0.5px] divide-border border-b-[0.5px] border-border sm:grid-cols-4">
        <StatCell label="Total views" value={totalViews.toLocaleString()} />
        <StatCell label="Visitors" value={visitorCount.toLocaleString()} />
        <StatCell
          label="Pages"
          value={Object.keys(viewsByUrl).length.toString()}
        />
        <StatCell
          label="Referrers"
          value={Object.keys(viewsByReferrer).length.toString()}
        />
      </section>

      <section className="px-5 py-5">
        <ZoomableViewsChart siteId={siteId} />
      </section>

      <section className="grid grid-cols-1 divide-y-[0.5px] divide-border border-t-[0.5px] border-border sm:grid-cols-3 sm:divide-x-[0.5px] sm:divide-y-0">
        <BreakdownPanel title="Top pages" entries={topPages} />
        <BreakdownPanel
          title="Devices"
          entries={topDevices.map(([label, count]) => [
            label,
            `${percentage(count, totalViews)}%`,
          ])}
        />
        <BreakdownPanel
          title="Referrers"
          entries={topReferrers.map(([label, count]) => [
            label,
            `${percentage(count, totalViews)}%`,
          ])}
        />
      </section>
    </>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-5 py-4">
      <p className="font-mono text-[11px] tracking-[0.5px] text-muted">
        {label.toUpperCase()}
      </p>
      <p className="mt-1 truncate font-mono text-[26px] font-medium">{value}</p>
    </div>
  );
}

function BreakdownPanel({
  title,
  entries,
}: {
  title: string;
  entries: [string, string | number][];
}) {
  return (
    <div className="px-5 py-4">
      <p className="mb-2.5 font-mono text-[11px] tracking-[0.5px] text-muted">
        {title.toUpperCase()}
      </p>
      {entries.length === 0 ? (
        <p className="text-[13px] text-muted">No data yet.</p>
      ) : (
        <ul>
          {entries.map(([label, value]) => (
            <li
              key={label}
              className="flex items-center justify-between border-t-[0.5px] border-paper-grid py-1.5 text-[13px] first:border-t-0"
            >
              <span className="truncate">{label}</span>
              <span className="font-mono text-muted">{value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
