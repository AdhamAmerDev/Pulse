import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import { events, sites } from "../../../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "../../../../../auth";

export async function DELETE(
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

  await db.delete(events).where(eq(events.siteId, siteId));

  return NextResponse.json({ ok: true });
}
