import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { events, sites } from "@/lib/db/schema";
import { eq, and, gte, count } from "drizzle-orm";
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

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  const [result] = await db
    .select({ count: count() })
    .from(events)
    .where(
      and(eq(events.siteId, siteId), gte(events.createdAt, fiveMinutesAgo)),
    );

  return NextResponse.json({ count: Number(result?.count ?? 0) });
}
