import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "../../../lib/db";
import { sites } from "../../../lib/db/schema";
import { auth } from "../../../auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const [newSite] = await db
    .insert(sites)
    .values({ domain: body.domain, userId: session.user.id })
    .returning();

  return NextResponse.json(newSite);
}

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userSites = await db
    .select()
    .from(sites)
    .where(eq(sites.userId, session.user.id));
  return NextResponse.json(userSites);
}
