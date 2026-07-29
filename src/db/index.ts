import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { serverEnv } from "@/lib/env";
import * as schema from "./schema";

declare global {
  var __unstoppableSql: postgres.Sql | undefined;
}

/**
 * A single pooled connection is reused across hot-reloads in development so
 * `next dev` doesn't exhaust Postgres connections on every file save.
 */
const sql =
  globalThis.__unstoppableSql ??
  postgres(serverEnv.DATABASE_URL, {
    max: serverEnv.NODE_ENV === "production" ? 10 : 5,
    idle_timeout: 20,
    connect_timeout: 10,
  });

if (serverEnv.NODE_ENV !== "production") {
  globalThis.__unstoppableSql = sql;
}

export const db = drizzle(sql, { schema });
export type Database = typeof db;
export { sql as rawSql };
