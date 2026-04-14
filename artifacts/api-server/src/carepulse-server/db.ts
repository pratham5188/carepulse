import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error("WARNING: DATABASE_URL is not set — database operations will fail at runtime");
}

const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : undefined,
});

pool.on("error", (err) => {
  console.error("Database pool error (non-fatal):", err.message);
});

export const db = drizzle(pool, { schema });
