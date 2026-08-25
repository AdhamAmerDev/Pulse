import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { events, sites } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

function isValidEvent(body: any) {
  if (typeof body !== "object" || body === null) return false;
  if (typeof body.siteId !== "string" || body.siteId.length === 0) return false;
  if (typeof body.type !== "string" || body.type.length === 0) return false;
  if (
    typeof body.url !== "string" ||
    body.url.length === 0 ||
    body.url.length > 2048
  )
    return false;
  if (
    body.referrer !== undefined &&
    body.referrer !== null &&
    typeof body.referrer !== "string"
  )
    return false;
  if (
    body.device !== undefined &&
    body.device !== null &&
    typeof body.device !== "string"
  )
    return false;
  return true;
}

export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
  } catch {
    const response = NextResponse.json(
      { error: "invalid JSON" },
      { status: 400 },
    );
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  }

  if (!isValidEvent(body)) {
    const response = NextResponse.json(
      { error: "invalid payload" },
      { status: 400 },
    );
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  }

  const [site] = await db.select().from(sites).where(eq(sites.id, body.siteId));

  if (!site) {
    const response = NextResponse.json(
      { error: "unknown site" },
      { status: 404 },
    );
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  }

  await db.insert(events).values({
    siteId: body.siteId,
    type: body.type,
    url: body.url,
    referrer: body.referrer,
    device: body.device,
  });

  const response = NextResponse.json({ ok: true });
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}
