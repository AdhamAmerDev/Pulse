import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { events } from "../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "../../../auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const siteId = req.nextUrl.searchParams.get("siteId");

  if (!siteId) {
    return NextResponse.json({ error: "siteId is required" }, { status: 400 });
  }

  const siteEvents = await db
    .select()
    .from(events)
    .where(eq(events.siteId, siteId));
  return NextResponse.json(siteEvents);
}
