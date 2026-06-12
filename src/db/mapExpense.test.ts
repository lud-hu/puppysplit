import { expect, test } from "bun:test";
import { toExpense } from "./mapExpense";

test("toExpense flattens payer and participants", () => {
  const date = new Date("2026-06-12T10:00:00Z");
  const expense = toExpense({
    id: 7,
    title: "Pizza",
    amount: 24.6,
    payerId: 1,
    puppyId: "p-1",
    date,
    payer: { id: 1, name: "Alice", puppyId: "p-1", payPalHandle: null },
    participants: [
      {
        userId: 1,
        expenseId: 7,
        user: { id: 1, name: "Alice", puppyId: "p-1", payPalHandle: null },
      },
      {
        userId: 2,
        expenseId: 7,
        user: { id: 2, name: "Bob", puppyId: "p-1", payPalHandle: "bob" },
      },
    ],
  });

  expect(expense).toStrictEqual({
    id: 7,
    title: "Pizza",
    amount: 24.6,
    date,
    payerId: 1,
    payer: "Alice",
    participants: [
      { name: "Alice", id: 1 },
      { name: "Bob", id: 2 },
    ],
  });
});
