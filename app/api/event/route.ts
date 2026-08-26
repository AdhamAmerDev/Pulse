import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { events, sites } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { isRateLimited } from "@/lib/security/rateLimit";
import { createHash } from "crypto";

function getVisitorHash(req: NextRequest): string {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const userAgent = req.headers.get("user-agent") ?? "unknown";
  const dailySalt = new Date().toISOString().slice(0, 10); // rotates every day
  return createHash("sha256")
    .update(`${dailySalt}:${ip}:${userAgent}`)
    .digest("hex");
}

type EventPayload = {
  siteId: string;
  ingestKey: string;
  type: string;
  url: string;
  referrer?: string | null;
  device?: string | null;
};

function jsonWithCors<T>(body: T, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

function isValidEvent(body: unknown): body is EventPayload {
  if (typeof body !== "object" || body === null) return false;
  const payload = body as Record<string, unknown>;
  return (
    typeof payload.siteId === "string" &&
    payload.siteId.length > 0 &&
    typeof payload.ingestKey === "string" &&
    payload.ingestKey.length >= 32 &&
    typeof payload.type === "string" &&
    payload.type.length > 0 &&
    payload.type.length <= 100 &&
    typeof payload.url === "string" &&
    payload.url.length > 0 &&
    payload.url.length <= 2048 &&
    isValidUrl(payload.url) &&
    (payload.referrer === undefined ||
      payload.referrer === null ||
      (typeof payload.referrer === "string" &&
        payload.referrer.length <= 2048)) &&
    (payload.device === undefined ||
      payload.device === null ||
      (typeof payload.device === "string" && payload.device.length <= 32))
  );
}

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const clientKey =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(`event:${clientKey}`, 120, 60_000)) {
    return jsonWithCors({ error: "too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonWithCors({ error: "invalid JSON" }, { status: 400 });
  }

  if (!isValidEvent(body)) {
    return jsonWithCors({ error: "invalid payload" }, { status: 400 });
  }

  const [site] = await db.select().from(sites).where(eq(sites.id, body.siteId));
  if (!site || site.ingestKey !== body.ingestKey) {
    return jsonWithCors({ error: "unknown site" }, { status: 404 });
  }

  let normalizedUrl = body.url;
  let normalizedReferrer = body.referrer ?? null;

  try {
    const pageUrl = new URL(body.url);
    normalizedUrl = `${pageUrl.origin}${pageUrl.pathname}`.slice(0, 2048);
    if (normalizedReferrer && normalizedReferrer !== "direct") {
      const referrer = new URL(normalizedReferrer);
      normalizedReferrer = `${referrer.origin}${referrer.pathname}`.slice(
        0,
        2048,
      );
    }
  } catch {
    normalizedReferrer = "direct";
  }

  await db.insert(events).values({
    siteId: body.siteId,
    type: body.type,
    url: normalizedUrl,
    referrer: normalizedReferrer,
    device: body.device,
    visitorHash: getVisitorHash(req),
  });

  return jsonWithCors({ ok: true });
}

export async function OPTIONS() {
  const response = jsonWithCors(null, { status: 204 });
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}
