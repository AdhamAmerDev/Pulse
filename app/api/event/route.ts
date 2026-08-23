import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { events, sites } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const [site] = await db.select().from(sites).where(eq(sites.id, body.siteId));

  if (!site) {
    return NextResponse.json({ error: "unknown site" }, { status: 404 });
  }

  await db.insert(events).values({
    siteId: body.siteId,
    type: body.type,
    url: body.url,
    referrer: body.referrer,
    device: body.device,
  });

  return NextResponse.json({ ok: true });
}
