import { desc, eq, inArray } from "drizzle-orm";
import { db } from ".";
import { expenseParticipants, expenses, puppies, users } from "./schema";
import type { ExpenseRow, User } from "./schema";
import type { Expense } from "../types";

type ExpenseWithRelations = ExpenseRow & {
  payer: User;
  participants: { userId: number; expenseId: number; user: User }[];
};

export function toExpense(expense: ExpenseWithRelations): Expense {
  return {
    id: expense.id,
    title: expense.title,
    amount: expense.amount,
    date: expense.date,
    payerId: expense.payerId,
    payer: expense.payer.name,
    participants: expense.participants.map((p) => ({
      name: p.user.name,
      id: p.user.id,
    })),
  };
}

/**
 * Loads a puppy with all its expenses (newest first), flattened for rendering.
 */
export async function getPuppyWithExpenses(puppyId: string) {
  const puppy = await db.query.puppies.findFirst({
    where: (puppies, { eq }) => eq(puppies.id, puppyId),
    with: {
      expenses: {
        orderBy: (expenses) => [desc(expenses.date)],
        with: {
          payer: true,
          participants: {
            with: {
              user: true,
            },
          },
        },
      },
    },
  });

  if (!puppy) return null;

  return {
    id: puppy.id,
    title: puppy.title,
    expenses: puppy.expenses.map(toExpense),
  };
}

export function getPuppyUsers(puppyId: string): Promise<User[]> {
  return db.query.users.findMany({
    where: (users, { eq }) => eq(users.puppyId, puppyId),
  });
}

export function createPuppy(title: string) {
  return db
    .insert(puppies)
    .values({ title, id: crypto.randomUUID() })
    .returning()
    .get();
}

export async function createExpense(input: {
  puppyId: string;
  title: string;
  amount: number;
  payerId: number;
  participantIds: number[];
}): Promise<ExpenseRow> {
  return db.transaction(async (tx) => {
    const newExpense = await tx
      .insert(expenses)
      .values({
        amount: input.amount,
        payerId: input.payerId,
        puppyId: input.puppyId,
        title: input.title,
        date: new Date(),
      })
      .returning()
      .get();

    await tx.insert(expenseParticipants).values(
      input.participantIds.map((userId) => ({
        expenseId: newExpense.id,
        userId,
      }))
    );

    return newExpense;
  });
}

export async function deleteExpense(expenseId: number) {
  await db.transaction(async (tx) => {
    await tx
      .delete(expenseParticipants)
      .where(eq(expenseParticipants.expenseId, expenseId));
    await tx.delete(expenses).where(eq(expenses.id, expenseId));
  });
}

export function createUser(input: {
  puppyId: string;
  name: string;
  payPalHandle?: string;
}) {
  return db
    .insert(users)
    .values({
      name: input.name,
      puppyId: input.puppyId,
      payPalHandle: input.payPalHandle,
    })
    .returning()
    .get();
}

/**
 * Removes a user from a puppy. Expenses they paid stay; only their
 * shares in other expenses are removed.
 */
export async function deleteUser(userId: number) {
  await db.transaction(async (tx) => {
    await tx
      .delete(expenseParticipants)
      .where(eq(expenseParticipants.userId, userId));
    await tx.delete(users).where(eq(users.id, userId));
  });
}

export function updatePuppyTitle(puppyId: string, title: string) {
  return db.update(puppies).set({ title }).where(eq(puppies.id, puppyId));
}

export function getPuppy(puppyId: string) {
  return db.query.puppies.findFirst({
    where: (puppies, { eq }) => eq(puppies.id, puppyId),
  });
}

/**
 * Deletes a puppy together with its users, expenses and expense shares.
 */
export async function deletePuppyCascade(puppyId: string) {
  const puppyUsers = await getPuppyUsers(puppyId);
  const userIds = puppyUsers.map((u) => u.id);

  await db.transaction(async (tx) => {
    if (userIds.length > 0) {
      await tx
        .delete(expenseParticipants)
        .where(inArray(expenseParticipants.userId, userIds));
      await tx.delete(expenses).where(inArray(expenses.payerId, userIds));
      await tx.delete(users).where(eq(users.puppyId, puppyId));
    }
    await tx.delete(puppies).where(eq(puppies.id, puppyId));
  });
}
