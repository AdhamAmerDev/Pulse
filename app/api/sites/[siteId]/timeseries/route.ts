import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { events, sites } from "@/lib/db/schema";
import { eq, and, gte, lte, count, sql } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { siteId } = await params;
  const [site] = await db.select().from(sites).where(eq(sites.id, siteId));
  if (!site || site.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { searchParams } = req.nextUrl;
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const granularity = searchParams.get("granularity") || "day";
  const timeZone = searchParams.get("tz") || "UTC";

  if (!start || !end) {
    return NextResponse.json(
      { error: "start and end are required" },
      { status: 400 },
    );
  }

  const startDate = new Date(start);
  const endDate = new Date(end);
  if (
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime()) ||
    startDate >= endDate ||
    endDate.getTime() - startDate.getTime() > 366 * 24 * 60 * 60 * 1000 ||
    !["month", "day", "hour", "minute"].includes(granularity)
  ) {
    return NextResponse.json(
      { error: "invalid timeseries range" },
      { status: 400 },
    );
  }

  try {
    new Intl.DateTimeFormat("en-CA", { timeZone });
  } catch {
    return NextResponse.json({ error: "invalid timezone" }, { status: 400 });
  }

  const format = {
    month: "YYYY-MM",
    day: "YYYY-MM-DD",
    hour: 'YYYY-MM-DD"T"HH24',
    minute: 'YYYY-MM-DD"T"HH24:MI',
  }[granularity as "month" | "day" | "hour" | "minute"];
  const bucket = sql<string>`to_char(${events.createdAt} AT TIME ZONE ${timeZone}, ${format})`;

  const rows = await db
    .select({ bucket, count: count() })
    .from(events)
    .where(
      and(
        eq(events.siteId, siteId),
        gte(events.createdAt, startDate),
        lte(events.createdAt, endDate),
      ),
    )
    .groupBy(sql`1`)
    .orderBy(sql`1`);

  const data = rows.map((row) => ({
    bucket: row.bucket,
    count: Number(row.count),
  }));

  return NextResponse.json({ data });
}
