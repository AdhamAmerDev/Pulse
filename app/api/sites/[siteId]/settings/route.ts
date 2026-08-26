import { and, eq, lt } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { events, sites } from "@/lib/db/schema";

const allowedRetentionDays = new Set([7, 30, 90, 365]);

type RouteContext = { params: Promise<{ siteId: string }> };

async function getOwnedSite(siteId: string) {
  const session = await auth();
  if (!session?.user?.id) return { session: null, site: null };

  const [site] = await db
    .select()
    .from(sites)
    .where(and(eq(sites.id, siteId), eq(sites.userId, session.user.id)));

  return { session, site };
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { siteId } = await params;
  const { session, site } = await getOwnedSite(siteId);

  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!site)
    return NextResponse.json({ error: "Site not found" }, { status: 404 });

  return NextResponse.json({ retentionDays: site.retentionDays });
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { siteId } = await params;
  const { session, site } = await getOwnedSite(siteId);

  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!site)
    return NextResponse.json({ error: "Site not found" }, { status: 404 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const retentionDays =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>).retentionDays
      : undefined;

  if (
    retentionDays !== null &&
    (typeof retentionDays !== "number" ||
      !allowedRetentionDays.has(retentionDays))
  ) {
    return NextResponse.json(
      { error: "Choose 7, 30, 90, 365 days, or keep forever" },
      { status: 400 },
    );
  }

  const updatedSite = await db.transaction(async (transaction) => {
    const [updated] = await transaction
      .update(sites)
      .set({ retentionDays })
      .where(eq(sites.id, site.id))
      .returning({ retentionDays: sites.retentionDays });

    if (retentionDays !== null) {
      const retentionCutoff = new Date();
      retentionCutoff.setDate(retentionCutoff.getDate() - retentionDays);
      await transaction
        .delete(events)
        .where(
          and(
            eq(events.siteId, site.id),
            lt(events.createdAt, retentionCutoff),
          ),
        );
    }

    return updated;
  });

  return NextResponse.json(updatedSite);
}
