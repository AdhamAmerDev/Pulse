import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sites } from "@/lib/db/schema";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const [newSite] = await db
    .insert(sites)
    .values({ domain: body.domain })
    .returning();

  return NextResponse.json(newSite);
}

export async function GET() {
  const allSites = await db.select().from(sites);
  return NextResponse.json(allSites);
}
