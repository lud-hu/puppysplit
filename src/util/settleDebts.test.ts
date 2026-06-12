import { expect, test } from "bun:test";
import { Debt, SingleDebt, settleDebts, unifyDebts } from "./settleDebts";

test("multi-creditor debts are properly unified", () => {
  const debts: Debt[] = [
    {
      debtor: "A",
      debtorId: 0,
      creditors: [
        { name: "A", id: 0 },
        { name: "B", id: 1 },
        { name: "C", id: 2 },
      ],
      amount: 14,
    },
    {
      debtor: "B",
      debtorId: 1,
      creditors: [
        { name: "A", id: 0 },
        { name: "B", id: 1 },
        { name: "C", id: 2 },
      ],
      amount: 66,
    },
    {
      debtor: "C",
      debtorId: 2,
      creditors: [
        { name: "A", id: 0 },
        { name: "B", id: 1 },
        { name: "C", id: 2 },
      ],
      amount: 39,
    },
  ];
  const singleDebts: SingleDebt[] = [
    { debtor: "A", debtorId: 0, creditor: "B", creditorId: 1, amount: 4.67 },
    { debtor: "A", debtorId: 0, creditor: "C", creditorId: 2, amount: 4.67 },
    { debtor: "B", debtorId: 1, creditor: "A", creditorId: 0, amount: 22 },
    { debtor: "B", debtorId: 1, creditor: "C", creditorId: 2, amount: 22 },
    { debtor: "C", debtorId: 2, creditor: "A", creditorId: 0, amount: 13 },
    { debtor: "C", debtorId: 2, creditor: "B", creditorId: 1, amount: 13 },
  ];
  const unifiedDebts = unifyDebts(debts);
  expect(unifiedDebts).toStrictEqual(singleDebts);
});

test("unifyDebts skips debts with non-finite or non-positive amounts", () => {
  const debts: Debt[] = [
    {
      debtor: "A",
      debtorId: 0,
      creditors: [
        { name: "A", id: 0 },
        { name: "B", id: 1 },
      ],
      amount: NaN,
    },
    {
      debtor: "A",
      debtorId: 0,
      creditors: [
        { name: "A", id: 0 },
        { name: "B", id: 1 },
      ],
      amount: 0,
    },
    {
      debtor: "A",
      debtorId: 0,
      creditors: [
        { name: "A", id: 0 },
        { name: "B", id: 1 },
      ],
      amount: 10,
    },
  ];

  expect(unifyDebts(debts)).toStrictEqual([
    { debtor: "A", debtorId: 0, creditor: "B", creditorId: 1, amount: 5 },
  ]);
});

test("example 0: proper rounding", () => {
  const debts: SingleDebt[] = [
    {
      debtor: "Ludwig",
      debtorId: 0,
      creditor: "Bene",
      creditorId: 1,
      amount: 4.33,
    },
    {
      debtor: "Ludwig",
      debtorId: 0,
      creditor: "Hans",
      creditorId: 1,
      amount: 4.33,
    },
    {
      debtor: "Ludwig",
      debtorId: 0,
      creditor: "Bene",
      creditorId: 1,
      amount: 11.5,
    },
    {
      debtor: "Ludwig",
      debtorId: 0,
      creditor: "Bene",
      creditorId: 1,
      amount: 12,
    },
    {
      debtor: "Ludwig",
      debtorId: 0,
      creditor: "Bene",
      creditorId: 1,
      amount: 6,
    },
  ];
  const transactions = settleDebts(debts);

  expect(transactions).toStrictEqual([
    {
      debtor: "Ludwig",
      debtorId: 0,
      creditor: "Bene",
      creditorId: 1,
      amount: 33.83,
    },
    {
      debtor: "Ludwig",
      debtorId: 0,
      creditor: "Hans",
      creditorId: 1,
      amount: 4.33,
    },
  ]);
});

test("example 1: debt is calculated correctly", () => {
  const debts: SingleDebt[] = [
    {
      debtor: "Alice",
      debtorId: 0,
      creditor: "Bob",
      creditorId: 1,
      amount: 20,
    },
    {
      debtor: "Bob",
      debtorId: 1,
      creditor: "Alice",
      creditorId: 0,
      amount: 10,
    },
    {
      debtor: "Charlie",
      debtorId: 2,
      creditor: "Alice",
      creditorId: 0,
      amount: 15,
    },
    {
      debtor: "Bob",
      debtorId: 1,
      creditor: "Charlie",
      creditorId: 2,
      amount: 5,
    },
  ];
  const transactions = settleDebts(debts);

  expect(transactions).toStrictEqual([
    {
      debtor: "Charlie",
      debtorId: 2,
      creditor: "Alice",
      creditorId: 0,
      amount: 5,
    },
    {
      debtor: "Charlie",
      debtorId: 2,
      creditor: "Bob",
      creditorId: 1,
      amount: 5,
    },
  ]);
});

test("example 2: debt is calculated correctly", () => {
  const debts: SingleDebt[] = [
    { debtor: "C", debtorId: 2, creditor: "A", creditorId: 0, amount: 13 },
    { debtor: "C", debtorId: 2, creditor: "B", creditorId: 1, amount: 13 },
    { debtor: "A", debtorId: 0, creditor: "C", creditorId: 2, amount: 4.67 },
    { debtor: "A", debtorId: 0, creditor: "B", creditorId: 1, amount: 4.67 },
    { debtor: "B", debtorId: 1, creditor: "A", creditorId: 0, amount: 22 },
    { debtor: "B", debtorId: 1, creditor: "C", creditorId: 2, amount: 22 },
  ];
  const transactions = settleDebts(debts);

  expect(transactions).toStrictEqual([
    {
      amount: 25.66,
      creditor: "A",
      creditorId: 0,
      debtor: "B",
      debtorId: 1,
    },
    {
      amount: 0.67,
      creditor: "C",
      creditorId: 2,
      debtor: "B",
      debtorId: 1,
    },
  ]);
});

test("example 3: no debts open", () => {
  const debts: SingleDebt[] = [
    { debtor: "A", debtorId: 0, creditor: "B", creditorId: 1, amount: 10 },
    { debtor: "B", debtorId: 1, creditor: "A", creditorId: 0, amount: 10 },
  ];
  const transactions = settleDebts(debts);

  expect(transactions).toStrictEqual([]);
});

test("rounding drift does not produce a NaN settlement when creditors are exhausted", () => {
  // Splitting these amounts across many creditors leaves each per-creditor
  // share rounded to 2 decimals, so the accumulated debtor/creditor balances
  // no longer cancel exactly. Previously the settlement loop would keep going
  // after all creditors were settled, read an undefined creditor, and emit a
  // transaction with a NaN amount ("<blank> sends NaN€ to E"). It must not.
  const debts: Debt[] = [
    {
      debtor: "B",
      debtorId: 1,
      creditors: [
        { name: "A", id: 0 },
        { name: "B", id: 1 },
        { name: "C", id: 2 },
        { name: "D", id: 3 },
        { name: "E", id: 4 },
      ],
      amount: 112.6,
    },
    {
      debtor: "E",
      debtorId: 4,
      creditors: [
        { name: "B", id: 1 },
        { name: "C", id: 2 },
        { name: "D", id: 3 },
        { name: "F", id: 5 },
      ],
      amount: 62.9,
    },
    {
      debtor: "B",
      debtorId: 1,
      creditors: [
        { name: "D", id: 3 },
        { name: "E", id: 4 },
      ],
      amount: 80.8,
    },
    {
      debtor: "C",
      debtorId: 2,
      creditors: [
        { name: "B", id: 1 },
        { name: "F", id: 5 },
      ],
      amount: 53.2,
    },
  ];
  const transactions = settleDebts(unifyDebts(debts));

  for (const t of transactions) {
    expect(Number.isFinite(t.amount)).toBe(true);
    expect(t.creditor).toBeDefined();
    expect(t.creditorId).toBeDefined();
    expect(t.debtor).toBeDefined();
    expect(t.debtorId).toBeDefined();
  }

  expect(transactions).toStrictEqual([
    { debtor: "B", creditor: "D", amount: 78.65, debtorId: 1, creditorId: 3 },
    { debtor: "B", creditor: "F", amount: 42.33, debtorId: 1, creditorId: 5 },
    { debtor: "B", creditor: "A", amount: 7.57, debtorId: 1, creditorId: 0 },
    { debtor: "C", creditor: "A", amount: 14.95, debtorId: 2, creditorId: 0 },
  ]);
});

test("integrate debt unification in debt calculation", () => {
  const debts: Debt[] = [
    {
      debtor: "S",
      debtorId: 1,
      creditors: [
        { name: "K", id: 0 },
        { name: "S", id: 1 },
      ],
      amount: 12,
    },
    {
      debtor: "S",
      debtorId: 1,
      creditors: [
        { name: "K", id: 0 },
        { name: "S", id: 1 },
        { name: "D", id: 2 },
        { name: "L", id: 3 },
      ],
      amount: 14,
    },
    {
      debtor: "L",
      debtorId: 3,
      creditors: [
        { name: "K", id: 0 },
        { name: "S", id: 1 },
        { name: "D", id: 2 },
        { name: "L", id: 3 },
      ],
      amount: 6,
    },
    {
      debtor: "D",
      debtorId: 2,
      creditors: [
        { name: "K", id: 0 },
        { name: "S", id: 1 },
        { name: "D", id: 2 },
        { name: "L", id: 3 },
      ],
      amount: 15.4,
    },
    {
      debtor: "K",
      debtorId: 0,
      creditors: [
        { name: "K", id: 0 },
        { name: "S", id: 1 },
        { name: "D", id: 2 },
        { name: "L", id: 3 },
      ],
      amount: 10,
    },
    {
      debtor: "L",
      debtorId: 3,
      creditors: [
        { name: "K", id: 0 },
        { name: "S", id: 1 },
        { name: "D", id: 2 },
        { name: "L", id: 3 },
      ],
      amount: 95,
    },
    {
      debtor: "D",
      debtorId: 2,
      creditors: [
        { name: "K", id: 0 },
        { name: "S", id: 1 },
        { name: "D", id: 2 },
        { name: "L", id: 3 },
      ],
      amount: 421.6,
    },
    {
      debtor: "L",
      debtorId: 3,
      creditors: [
        { name: "K", id: 0 },
        { name: "S", id: 1 },
        { name: "D", id: 2 },
        { name: "L", id: 3 },
      ],
      amount: 86,
    },
    {
      debtor: "L",
      debtorId: 3,
      creditors: [
        { name: "K", id: 0 },
        { name: "S", id: 1 },
        { name: "D", id: 2 },
        { name: "L", id: 3 },
      ],
      amount: 37.5,
    },
  ];
  const unifiedDebts = unifyDebts(debts);
  const transactions = settleDebts(unifiedDebts);

  // K gibt 167.38 an D
  // S gibt 98.25 an D
  // S gibt 52.13 an L
  expect(transactions).toStrictEqual([
    {
      debtor: "D",
      debtorId: 2,
      creditor: "K",
      creditorId: 0,
      amount: 167.38,
    },
    {
      debtor: "D",
      debtorId: 2,
      creditor: "S",
      creditorId: 1,
      amount: 98.24,
    },
    {
      debtor: "L",
      debtorId: 3,
      creditor: "S",
      creditorId: 1,
      amount: 53.14,
    },
  ]);
});
