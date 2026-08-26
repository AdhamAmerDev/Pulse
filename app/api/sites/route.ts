import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "../../../lib/db";
import { sites } from "../../../lib/db/schema";
import { auth } from "../../../auth";
import { randomUUID } from "node:crypto";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>).domain !== "string"
  ) {
    return NextResponse.json({ error: "domain is required" }, { status: 400 });
  }
  const domain = (body as Record<string, string>).domain.trim();
  if (
    domain.length === 0 ||
    domain.length > 253 ||
    !/^[a-z0-9.-]+$/i.test(domain)
  ) {
    return NextResponse.json({ error: "invalid domain" }, { status: 400 });
  }

  const [newSite] = await db
    .insert(sites)
    .values({ domain, ingestKey: randomUUID(), userId: session.user.id })
    .returning();

  return NextResponse.json(newSite);
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userSites = await db
    .select()
    .from(sites)
    .where(eq(sites.userId, session.user.id));
  return NextResponse.json(userSites);
}
