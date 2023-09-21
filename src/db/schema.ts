import { InferModel, relations, sql } from "drizzle-orm";
import {
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const puppies = sqliteTable("puppies", {
  // TODO: How to get a nice uuid in sqlite to have a "encrypted" link?
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
});

export const puppiesRelations = relations(puppies, ({ many, one }) => ({
  users: many(users),
  debts: many(debts),
}));

export const debts = sqliteTable("debts", {
  // TODO: How to get a nice uuid in sqlite to have a "encrypted" link?
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  amount: real("amount").notNull(),
  debtorId: integer("debtorId", { mode: "number" }).notNull(),
  puppyId: integer("puppyId", { mode: "number" }).notNull(),
  date: integer("date", { mode: "timestamp" })
    .notNull()
    // TODO: Default not working? :(
    .default(sql`CURRENT_TIMESTAMP`),
});

export const debtsRelations = relations(debts, ({ many, one }) => ({
  creditorsToDebts: many(creditorsToDebts),
  debtor: one(users, {
    fields: [debts.debtorId],
    references: [users.id],
  }),
  puppies: one(puppies, {
    fields: [debts.puppyId],
    references: [puppies.id],
  }),
}));

export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  // puppyId: integer("puppy_id").references(() => puppies.id),
  puppyId: integer("puppyId", { mode: "number" }).notNull(),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  creditorsToDebts: many(creditorsToDebts),
  puppies: one(puppies, {
    fields: [users.puppyId],
    references: [puppies.id],
  }),
}));

export const creditorsToDebts = sqliteTable(
  "creditors_to_debts",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    debtId: integer("debt_id")
      .notNull()
      .references(() => debts.id),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.debtId),
  })
);

export const creditorsToDebtsRelations = relations(
  creditorsToDebts,
  ({ one }) => ({
    debt: one(debts, {
      fields: [creditorsToDebts.debtId],
      references: [debts.id],
    }),
    user: one(users, {
      fields: [creditorsToDebts.userId],
      references: [users.id],
    }),
  })
);

export type Puppy = InferModel<typeof puppies>;
export type Debt = InferModel<typeof debts>;
export type User = InferModel<typeof users>;
