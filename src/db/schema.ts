import { InferModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const puppies = sqliteTable("puppies", {
  // TODO: How to get a nice uuid in sqlite to have a "encrypted" link?
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
});

export type Puppy = InferModel<typeof puppies>;
