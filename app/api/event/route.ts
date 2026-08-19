import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data.json");

export async function POST(req: NextRequest) {
  const body = await req.json(); // the data pulse.js sent us

  let events = [];
  if (fs.existsSync(filePath)) {
    const fileContents = fs.readFileSync(filePath, "utf-8");
    events = JSON.parse(fileContents);
  }

  events.push(body);

  fs.writeFileSync(filePath, JSON.stringify(events, null, 2));

  return NextResponse.json({ ok: true });
}
