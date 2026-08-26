import "dotenv/config";
import { db } from "../lib/db";
import { users } from "../lib/db/schema";
import bcrypt from "bcrypt";

async function createUser() {
  const email = process.env.SETUP_EMAIL?.trim().toLowerCase();
  const plainPassword = process.env.SETUP_PASSWORD;

  if (!email || !plainPassword) {
    throw new Error("SETUP_EMAIL and SETUP_PASSWORD are required");
  }

  const passwordHash = await bcrypt.hash(plainPassword, 10);

  const [user] = await db
    .insert(users)
    .values({ email, passwordHash })
    .returning();

  console.log(`Created user: ${user.email}`);
  process.exit(0);
}

createUser();
