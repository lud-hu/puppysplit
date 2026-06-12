import { desc, eq, inArray } from "drizzle-orm";
import { db } from ".";
import { creditorsToDebts, debts, puppies, users } from "./schema";
import type { Debt, User } from "./schema";
import type { MyDebt } from "../types";

type DebtWithRelations = Debt & {
  debtor: User;
  creditorsToDebts: { userId: number; debtId: number; user: User }[];
};

export function toMyDebt(debt: DebtWithRelations): MyDebt {
  return {
    id: debt.id,
    title: debt.title,
    amount: debt.amount,
    date: debt.date,
    debtorId: debt.debtorId,
    debtor: debt.debtor.name,
    creditors: debt.creditorsToDebts.map((c) => ({
      name: c.user.name,
      id: c.user.id,
    })),
  };
}

/**
 * Loads a puppy with all its debts (newest first), flattened for rendering.
 */
export async function getPuppyWithDebts(puppyId: string) {
  const puppy = await db.query.puppies.findFirst({
    where: (puppies, { eq }) => eq(puppies.id, puppyId),
    with: {
      debts: {
        orderBy: (debts) => [desc(debts.date)],
        with: {
          debtor: true,
          creditorsToDebts: {
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
    debts: puppy.debts.map(toMyDebt),
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

export async function createDebt(input: {
  puppyId: string;
  title: string;
  amount: number;
  debtorId: number;
  creditorIds: number[];
}): Promise<Debt> {
  return db.transaction(async (tx) => {
    const newDebt = await tx
      .insert(debts)
      .values({
        amount: input.amount,
        debtorId: input.debtorId,
        puppyId: input.puppyId,
        title: input.title,
        date: new Date(),
      })
      .returning()
      .get();

    await tx.insert(creditorsToDebts).values(
      input.creditorIds.map((userId) => ({
        debtId: newDebt.id,
        userId,
      }))
    );

    return newDebt;
  });
}

export async function deleteDebt(debtId: number) {
  await db.transaction(async (tx) => {
    await tx.delete(creditorsToDebts).where(eq(creditorsToDebts.debtId, debtId));
    await tx.delete(debts).where(eq(debts.id, debtId));
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
 * Removes a user from a puppy. Debts they paid stay; only their
 * shares in other debts are removed.
 */
export async function deleteUser(userId: number) {
  await db.transaction(async (tx) => {
    await tx.delete(creditorsToDebts).where(eq(creditorsToDebts.userId, userId));
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
 * Deletes a puppy together with its users, debts and debt shares.
 */
export async function deletePuppyCascade(puppyId: string) {
  const puppyUsers = await getPuppyUsers(puppyId);
  const userIds = puppyUsers.map((u) => u.id);

  await db.transaction(async (tx) => {
    if (userIds.length > 0) {
      await tx
        .delete(creditorsToDebts)
        .where(inArray(creditorsToDebts.userId, userIds));
      await tx.delete(debts).where(inArray(debts.debtorId, userIds));
      await tx.delete(users).where(eq(users.puppyId, puppyId));
    }
    await tx.delete(puppies).where(eq(puppies.id, puppyId));
  });
}
