import { expect, test } from "bun:test";
import { Debt, SingleDebt, settleDebts, unifyDebts } from "./settleDebts";

test("multi-creditor debts are properly unified", () => {
  const debts: Debt[] = [
    { debtor: "A", creditors: ["A", "B", "C"], amount: 14 },
    { debtor: "B", creditors: ["A", "B", "C"], amount: 66 },
    { debtor: "C", creditors: ["A", "B", "C"], amount: 39 },
  ];
  const singleDebts: SingleDebt[] = [
    { debtor: "A", creditor: "B", amount: 14 / 3 },
    { debtor: "A", creditor: "C", amount: 14 / 3 },
    { debtor: "B", creditor: "A", amount: 66 / 3 },
    { debtor: "B", creditor: "C", amount: 66 / 3 },
    { debtor: "C", creditor: "A", amount: 39 / 3 },
    { debtor: "C", creditor: "B", amount: 39 / 3 },
  ];
  const unifiedDebts = unifyDebts(debts);
  expect(unifiedDebts).toStrictEqual(singleDebts);
});

test("example 1: debt is calculated correctly", () => {
  const debts: SingleDebt[] = [
    { debtor: "Alice", creditor: "Bob", amount: 20 },
    { debtor: "Bob", creditor: "Alice", amount: 10 },
    { debtor: "Charlie", creditor: "Alice", amount: 15 },
    { debtor: "Bob", creditor: "Charlie", amount: 5 },
  ];
  const transactions = settleDebts(debts);

  expect(transactions).toStrictEqual([
    {
      debtor: "Charlie",
      creditor: "Alice",
      amount: 5,
    },
    {
      debtor: "Charlie",
      creditor: "Bob",
      amount: 5,
    },
  ]);
});

test("example 2: debt is calculated correctly", () => {
  const debts: SingleDebt[] = [
    { debtor: "C", creditor: "A", amount: 39 / 3 },
    { debtor: "C", creditor: "B", amount: 39 / 3 },
    { debtor: "A", creditor: "C", amount: 14 / 3 },
    { debtor: "A", creditor: "B", amount: 14 / 3 },
    { debtor: "B", creditor: "A", amount: 66 / 3 },
    { debtor: "B", creditor: "C", amount: 66 / 3 },
  ];
  const transactions = settleDebts(debts);

  expect(transactions).toStrictEqual([
    {
      amount: 25.666666666666664,
      creditor: "A",
      debtor: "B",
    },
    {
      amount: 0.6666666666666679,
      creditor: "C",
      debtor: "B",
    },
  ]);
});

test("example 3: no debts open", () => {
  const debts: SingleDebt[] = [
    { debtor: "A", creditor: "B", amount: 10 },
    { debtor: "B", creditor: "A", amount: 10 },
  ];
  const transactions = settleDebts(debts);

  expect(transactions).toStrictEqual([]);
});

test("integrate debt unification in debt calculation", () => {
  const debts: Debt[] = [
    { debtor: "S", creditors: ["K", "S"], amount: 12 },
    { debtor: "S", creditors: ["K", "S", "D", "L"], amount: 14 },
    { debtor: "L", creditors: ["K", "S", "D", "L"], amount: 6 },
    { debtor: "D", creditors: ["K", "S", "D", "L"], amount: 15.4 },
    { debtor: "K", creditors: ["K", "S", "D", "L"], amount: 10 },
    { debtor: "L", creditors: ["K", "S", "D", "L"], amount: 95 },
    { debtor: "D", creditors: ["K", "S", "D", "L"], amount: 421.6 },
    { debtor: "L", creditors: ["K", "S", "D", "L"], amount: 86 },
    { debtor: "L", creditors: ["K", "S", "D", "L"], amount: 37.5 },
  ];
  const unifiedDebts = unifyDebts(debts);
  const transactions = settleDebts(unifiedDebts);

  // K gibt 167.38 an D
  // S gibt 98.25 an D
  // S gibt 52.13 an L
  expect(transactions).toStrictEqual([
    {
      debtor: "D",
      creditor: "K",
      amount: 167.375,
    },
    {
      debtor: "D",
      creditor: "S",
      amount: 98.25,
    },
    {
      debtor: "L",
      creditor: "S",
      amount: 53.125,
    },
  ]);
});
