import { InferSelectModel, relations, sql } from "drizzle-orm";
import {
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const puppies = sqliteTable("puppies", {
  // TODO: How to get a nice uuid in sqlite to have a "encrypted" link?
  id: text("id", { length: 191 }).unique().notNull().primaryKey(),
  title: text("title").notNull(),
});

export const puppiesRelations = relations(puppies, ({ many }) => ({
  users: many(users),
  expenses: many(expenses),
}));

/**
 * An expense paid by one user (the payer) and split between
 * the participating users.
 */
export const expenses = sqliteTable("expenses", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  amount: real("amount").notNull(),
  payerId: integer("payerId", { mode: "number" }).notNull(),
  puppyId: text("puppyId").notNull(),
  date: integer("date", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const expensesRelations = relations(expenses, ({ many, one }) => ({
  participants: many(expenseParticipants),
  payer: one(users, {
    fields: [expenses.payerId],
    references: [users.id],
  }),
  puppy: one(puppies, {
    fields: [expenses.puppyId],
    references: [puppies.id],
  }),
}));

export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  puppyId: text("puppyId").notNull(),
  payPalHandle: text("payPalHandle"),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  expenseParticipations: many(expenseParticipants),
  puppy: one(puppies, {
    fields: [users.puppyId],
    references: [puppies.id],
  }),
}));

/**
 * The users an expense is split between (each owes their share
 * to the payer).
 */
export const expenseParticipants = sqliteTable(
  "expense_participants",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    expenseId: integer("expense_id")
      .notNull()
      .references(() => expenses.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.expenseId] }),
  })
);

export const expenseParticipantsRelations = relations(
  expenseParticipants,
  ({ one }) => ({
    expense: one(expenses, {
      fields: [expenseParticipants.expenseId],
      references: [expenses.id],
    }),
    user: one(users, {
      fields: [expenseParticipants.userId],
      references: [users.id],
    }),
  })
);

export type Puppy = InferSelectModel<typeof puppies>;
export type ExpenseRow = InferSelectModel<typeof expenses>;
export type User = InferSelectModel<typeof users>;
