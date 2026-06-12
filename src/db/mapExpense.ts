import type { ExpenseRow, User } from "./schema";
import type { Expense } from "../types";

export type ExpenseWithRelations = ExpenseRow & {
  payer: User;
  participants: { userId: number; expenseId: number; user: User }[];
};

/**
 * Flattens an expense row with its relations into the shape
 * the components render.
 */
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
