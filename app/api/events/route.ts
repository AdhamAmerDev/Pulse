import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data.json");

export async function GET() {
  if (!fs.existsSync(filePath)) {
    return NextResponse.json([]);
  }

  const fileContents = fs.readFileSync(filePath, "utf-8");
  const events = JSON.parse(fileContents);

  return NextResponse.json(events);
}
