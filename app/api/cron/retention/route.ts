import { sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { events, sites } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

async function runRetention(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (
    !cronSecret ||
    cronSecret.startsWith("replace-with-") ||
    authorization !== `Bearer ${cronSecret}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deleted = await db.execute(sql`
    DELETE FROM ${events}
    USING ${sites}
    WHERE ${events.siteId} = ${sites.id}
      AND ${sites.retentionDays} IS NOT NULL
      AND ${events.createdAt} < NOW() - (${sites.retentionDays} * INTERVAL '1 day')
  `);

  return NextResponse.json({ deleted: deleted.count });
}

export const GET = runRetention;
export const POST = runRetention;
