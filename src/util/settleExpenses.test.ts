import { expect, test } from "bun:test";
import type { Transfer } from "../types";
import { expensesToTransfers, settleTransfers } from "./settleExpenses";

test("expenses are split into pairwise transfers", () => {
  const expenses = [
    {
      payer: "A",
      payerId: 0,
      participants: [
        { name: "A", id: 0 },
        { name: "B", id: 1 },
        { name: "C", id: 2 },
      ],
      amount: 14,
    },
    {
      payer: "B",
      payerId: 1,
      participants: [
        { name: "A", id: 0 },
        { name: "B", id: 1 },
        { name: "C", id: 2 },
      ],
      amount: 66,
    },
    {
      payer: "C",
      payerId: 2,
      participants: [
        { name: "A", id: 0 },
        { name: "B", id: 1 },
        { name: "C", id: 2 },
      ],
      amount: 39,
    },
  ];
  const transfers: Transfer[] = [
    { from: "B", fromId: 1, to: "A", toId: 0, amount: 4.67 },
    { from: "C", fromId: 2, to: "A", toId: 0, amount: 4.67 },
    { from: "A", fromId: 0, to: "B", toId: 1, amount: 22 },
    { from: "C", fromId: 2, to: "B", toId: 1, amount: 22 },
    { from: "A", fromId: 0, to: "C", toId: 2, amount: 13 },
    { from: "B", fromId: 1, to: "C", toId: 2, amount: 13 },
  ];
  expect(expensesToTransfers(expenses)).toStrictEqual(transfers);
});

test("expensesToTransfers skips expenses with non-finite or non-positive amounts", () => {
  const participants = [
    { name: "A", id: 0 },
    { name: "B", id: 1 },
  ];
  const expenses = [
    { payer: "A", payerId: 0, participants, amount: NaN },
    { payer: "A", payerId: 0, participants, amount: 0 },
    { payer: "A", payerId: 0, participants, amount: 10 },
  ];

  expect(expensesToTransfers(expenses)).toStrictEqual([
    { from: "B", fromId: 1, to: "A", toId: 0, amount: 5 },
  ]);
});

test("the payer is excluded by id, not by name", () => {
  // The payer and a participant share the same name. Only the payer
  // themselves (id 0) must be excluded from owing a share.
  const expenses = [
    {
      payer: "Anna",
      payerId: 0,
      participants: [
        { name: "Anna", id: 0 },
        { name: "Anna", id: 1 },
      ],
      amount: 10,
    },
  ];

  expect(expensesToTransfers(expenses)).toStrictEqual([
    { from: "Anna", fromId: 1, to: "Anna", toId: 0, amount: 5 },
  ]);
});

test("example 0: proper rounding", () => {
  const transfers: Transfer[] = [
    { from: "Bene", fromId: 1, to: "Ludwig", toId: 0, amount: 4.33 },
    { from: "Hans", fromId: 2, to: "Ludwig", toId: 0, amount: 4.33 },
    { from: "Bene", fromId: 1, to: "Ludwig", toId: 0, amount: 11.5 },
    { from: "Bene", fromId: 1, to: "Ludwig", toId: 0, amount: 12 },
    { from: "Bene", fromId: 1, to: "Ludwig", toId: 0, amount: 6 },
  ];

  expect(settleTransfers(transfers)).toStrictEqual([
    { from: "Bene", fromId: 1, to: "Ludwig", toId: 0, amount: 33.83 },
    { from: "Hans", fromId: 2, to: "Ludwig", toId: 0, amount: 4.33 },
  ]);
});

test("example 1: settlement is calculated correctly", () => {
  const transfers: Transfer[] = [
    { from: "Bob", fromId: 1, to: "Alice", toId: 0, amount: 20 },
    { from: "Alice", fromId: 0, to: "Bob", toId: 1, amount: 10 },
    { from: "Alice", fromId: 0, to: "Charlie", toId: 2, amount: 15 },
    { from: "Charlie", fromId: 2, to: "Bob", toId: 1, amount: 5 },
  ];

  expect(settleTransfers(transfers)).toStrictEqual([
    { from: "Alice", fromId: 0, to: "Charlie", toId: 2, amount: 5 },
    { from: "Bob", fromId: 1, to: "Charlie", toId: 2, amount: 5 },
  ]);
});

test("example 2: settlement is calculated correctly", () => {
  const transfers: Transfer[] = [
    { from: "A", fromId: 0, to: "C", toId: 2, amount: 13 },
    { from: "B", fromId: 1, to: "C", toId: 2, amount: 13 },
    { from: "C", fromId: 2, to: "A", toId: 0, amount: 4.67 },
    { from: "B", fromId: 1, to: "A", toId: 0, amount: 4.67 },
    { from: "A", fromId: 0, to: "B", toId: 1, amount: 22 },
    { from: "C", fromId: 2, to: "B", toId: 1, amount: 22 },
  ];

  expect(settleTransfers(transfers)).toStrictEqual([
    { from: "A", fromId: 0, to: "B", toId: 1, amount: 25.66 },
    { from: "C", fromId: 2, to: "B", toId: 1, amount: 0.67 },
  ]);
});

test("example 3: nothing left to settle", () => {
  const transfers: Transfer[] = [
    { from: "A", fromId: 0, to: "B", toId: 1, amount: 10 },
    { from: "B", fromId: 1, to: "A", toId: 0, amount: 10 },
  ];

  expect(settleTransfers(transfers)).toStrictEqual([]);
});

test("two users with the same name are settled independently", () => {
  // Both senders are called "Anna" but are different people.
  const transfers: Transfer[] = [
    { from: "Anna", fromId: 1, to: "Karl", toId: 0, amount: 10 },
    { from: "Anna", fromId: 2, to: "Karl", toId: 0, amount: 7 },
  ];

  expect(settleTransfers(transfers)).toStrictEqual([
    { from: "Anna", fromId: 1, to: "Karl", toId: 0, amount: 10 },
    { from: "Anna", fromId: 2, to: "Karl", toId: 0, amount: 7 },
  ]);
});

test("rounding residue does not produce 0€ transfers", () => {
  // The 0.004 difference rounds to a 0€ payment, which is pointless
  // to show. It must be dropped from the result.
  const transfers: Transfer[] = [
    { from: "A", fromId: 0, to: "B", toId: 1, amount: 10.004 },
    { from: "A", fromId: 0, to: "C", toId: 2, amount: 5 },
    { from: "C", fromId: 2, to: "B", toId: 1, amount: 5 },
  ];

  expect(settleTransfers(transfers)).toStrictEqual([
    { from: "A", fromId: 0, to: "B", toId: 1, amount: 15 },
  ]);
});

test("rounding drift does not produce a NaN settlement when senders are exhausted", () => {
  // Splitting these amounts across many participants leaves each share
  // rounded to 2 decimals, so the accumulated balances no longer cancel
  // exactly. The settlement loop must stop once all senders are settled
  // instead of emitting a payment with a NaN amount.
  const expenses = [
    {
      payer: "B",
      payerId: 1,
      participants: [
        { name: "A", id: 0 },
        { name: "B", id: 1 },
        { name: "C", id: 2 },
        { name: "D", id: 3 },
        { name: "E", id: 4 },
      ],
      amount: 112.6,
    },
    {
      payer: "E",
      payerId: 4,
      participants: [
        { name: "B", id: 1 },
        { name: "C", id: 2 },
        { name: "D", id: 3 },
        { name: "F", id: 5 },
      ],
      amount: 62.9,
    },
    {
      payer: "B",
      payerId: 1,
      participants: [
        { name: "D", id: 3 },
        { name: "E", id: 4 },
      ],
      amount: 80.8,
    },
    {
      payer: "C",
      payerId: 2,
      participants: [
        { name: "B", id: 1 },
        { name: "F", id: 5 },
      ],
      amount: 53.2,
    },
  ];
  const payments = settleTransfers(expensesToTransfers(expenses));

  for (const payment of payments) {
    expect(Number.isFinite(payment.amount)).toBe(true);
    expect(payment.from).toBeDefined();
    expect(payment.fromId).toBeDefined();
    expect(payment.to).toBeDefined();
    expect(payment.toId).toBeDefined();
  }

  expect(payments).toStrictEqual([
    { from: "D", fromId: 3, to: "B", toId: 1, amount: 78.65 },
    { from: "F", fromId: 5, to: "B", toId: 1, amount: 42.33 },
    { from: "A", fromId: 0, to: "B", toId: 1, amount: 7.57 },
    { from: "A", fromId: 0, to: "C", toId: 2, amount: 14.95 },
  ]);
});

test("integrate expense splitting in settlement calculation", () => {
  const participants = [
    { name: "K", id: 0 },
    { name: "S", id: 1 },
    { name: "D", id: 2 },
    { name: "L", id: 3 },
  ];
  const expenses = [
    {
      payer: "S",
      payerId: 1,
      participants: [
        { name: "K", id: 0 },
        { name: "S", id: 1 },
      ],
      amount: 12,
    },
    { payer: "S", payerId: 1, participants, amount: 14 },
    { payer: "L", payerId: 3, participants, amount: 6 },
    { payer: "D", payerId: 2, participants, amount: 15.4 },
    { payer: "K", payerId: 0, participants, amount: 10 },
    { payer: "L", payerId: 3, participants, amount: 95 },
    { payer: "D", payerId: 2, participants, amount: 421.6 },
    { payer: "L", payerId: 3, participants, amount: 86 },
    { payer: "L", payerId: 3, participants, amount: 37.5 },
  ];
  const payments = settleTransfers(expensesToTransfers(expenses));

  // K sends 167.38 to D
  // S sends 98.24 to D
  // S sends 53.14 to L
  expect(payments).toStrictEqual([
    { from: "K", fromId: 0, to: "D", toId: 2, amount: 167.38 },
    { from: "S", fromId: 1, to: "D", toId: 2, amount: 98.24 },
    { from: "S", fromId: 1, to: "L", toId: 3, amount: 53.14 },
  ]);
});
