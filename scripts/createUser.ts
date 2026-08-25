import "dotenv/config";
import { db } from "../lib/db";
import { users } from "../lib/db/schema";
import bcrypt from "bcrypt";

async function createUser() {
  const email = "***REMOVED***";
  const plainPassword = "***REMOVED***";

  const passwordHash = await bcrypt.hash(plainPassword, 10);

  const [user] = await db
    .insert(users)
    .values({ email, passwordHash })
    .returning();

  console.log("Created user:", user);
  process.exit(0);
}

createUser();
