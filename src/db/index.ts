import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

// For now, just directly push db changes to the remote db.
// Later, use local db for development and use migration files to apply to remote db:
// https://andriisherman.medium.com/migrations-with-drizzle-just-got-better-push-to-sqlite-is-here-c6c045c5d0fb
// bunx drizzle-kit generate:sqlite --schema=./src/db/schema.ts
export const db = drizzle(client, { schema, logger: true });
