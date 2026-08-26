import { sql, eq, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";

export type AnalyticsSummary = {
  totalViews: number;
  viewsByUrl: Record<string, number>;
  viewsByDevice: Record<string, number>;
  viewsByReferrer: Record<string, number>;
};

type CountRow = { value: string | null; count: number };

export async function getVisitorCount(siteId: string): Promise<number> {
  const [{ count }] = await db
    .select({ count: sql<number>`count(distinct ${events.visitorHash})` })
    .from(events)
    .where(eq(events.siteId, siteId));

  return Number(count);
}

async function getCounts(
  siteId: string,
  column: typeof events.url | typeof events.device | typeof events.referrer,
): Promise<CountRow[]> {
  const rows = await db
    .select({ value: column, count: count() })
    .from(events)
    .where(eq(events.siteId, siteId))
    .groupBy(column);

  return rows.map((row) => ({ value: row.value, count: Number(row.count) }));
}

export async function summarizeSite(siteId: string): Promise<AnalyticsSummary> {
  const [totalRow, urls, devices, referrers] = await Promise.all([
    db.select({ count: count() }).from(events).where(eq(events.siteId, siteId)),
    getCounts(siteId, events.url),
    getCounts(siteId, events.device),
    getCounts(siteId, events.referrer),
  ]);

  return {
    totalViews: Number(totalRow[0]?.count ?? 0),
    viewsByUrl: toCountRecord(urls),
    viewsByDevice: toCountRecord(devices),
    viewsByReferrer: toCountRecord(referrers, "(direct)"),
  };
}

function toCountRecord(rows: CountRow[], nullLabel = "(not set)") {
  return rows.reduce<Record<string, number>>((result, row) => {
    result[row.value ?? nullLabel] = row.count;
    return result;
  }, {});
}
