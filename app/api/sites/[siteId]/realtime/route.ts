import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { events, sites } from "@/lib/db/schema";
import { sql, eq, and, gte } from "drizzle-orm";
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

  const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000);

  const [{ count }] = await db
    .select({ count: sql<number>`count(distinct ${events.visitorHash})` })
    .from(events)
    .where(and(eq(events.siteId, siteId), gte(events.createdAt, oneMinuteAgo)));

  return NextResponse.json({ count: Number(count) });
}
