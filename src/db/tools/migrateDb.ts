import { migrate } from "drizzle-orm/libsql/migrator";
import { client, db } from "../index";

// Databases created before the expenses rename still have the old
// table names. Rename them first so the initial migration
// (CREATE TABLE IF NOT EXISTS) becomes a no-op for them.
const legacyTables = await client.execute(
  "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'debts'"
);

if (legacyTables.rows.length > 0) {
  console.log("Renaming legacy debts tables to the expenses naming...");
  await client.executeMultiple(`
    ALTER TABLE debts RENAME TO expenses;
    ALTER TABLE expenses RENAME COLUMN debtorId TO payerId;
    ALTER TABLE creditors_to_debts RENAME TO expense_participants;
    ALTER TABLE expense_participants RENAME COLUMN debt_id TO expense_id;
  `);
}

await migrate(db, { migrationsFolder: "./drizzle" });
console.log("Migrations applied.");
