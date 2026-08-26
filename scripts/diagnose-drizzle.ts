import "dotenv/config";
import { count, sql } from "drizzle-orm";
import { db as database } from "../lib/db";
import { events } from "../lib/db/schema";

const timeZone = "America/New_York";
const format = "YYYY-MM-DD";
const bucket = sql<string>`to_char(${events.createdAt} AT TIME ZONE ${timeZone}, ${format})`;

async function main() {
  try {
    const rows = await database
      .select({ bucket, count: count() })
      .from(events)
      .groupBy(bucket)
      .orderBy(bucket);
    console.log(rows);
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

main();
