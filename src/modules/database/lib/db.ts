import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) throw new Error("process.env.DATABASE_URL not found");

const client = postgres(DATABASE_URL, { prepare: false });
export const db = drizzle(client);
