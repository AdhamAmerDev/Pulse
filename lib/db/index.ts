import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { requiredEnv } from "../env";

const databaseUrl = requiredEnv("DATABASE_URL");

const client = postgres(databaseUrl);
export const db = drizzle(client, { schema });
