import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
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
