import ClearDataButton from "@/components/ClearDataButton";
import { db } from "../../../lib/db";
import { sites } from "../../../lib/db/schema";
import { eq } from "drizzle-orm";
import ZoomableViewsChart from "@/components/ZoomableViewsChart";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { summarizeSite } from "@/lib/analytics/summarize";
import RealtimeCounter from "@/components/RealtimeCounter";

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

  return (
    <div>
      <Link href="/dashboard">← Back to all sites</Link>
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
      <h3>Top Referrers</h3>
      <ul>
        {Object.entries(viewsByReferrer).map(([referrer, count]) => (
          <li key={referrer}>
            {referrer}: {count}
          </li>
        ))}
      </ul>
      <ClearDataButton siteId={siteId} />
      <ZoomableViewsChart siteId={siteId} />
      <RealtimeCounter siteId={siteId} />
    </div>
  );
}
