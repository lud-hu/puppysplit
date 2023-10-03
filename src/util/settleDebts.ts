export interface SingleDebt {
  /**
   * The debtor (Schuldner, leiht geld aus) is the one who owes money.
   */
  debtor: string;
  debtorPayPalHandle?: string;
  /**
   * The creditor (Gläubiger, verleiht geld) is the one who is owed money.
   */
  creditor: string;
  /**
   * The amount of money owed.
   */
  amount: number;
}

export interface Debt extends Omit<SingleDebt, "creditor"> {
  creditors: string[];
}

const roundTwoDecimals = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

/**
 * Takes debts with multiple creditors and converts
 * them to debts with a single creditor.
 * The amount is splitted evenly between all creditors
 * (including the debtor).
 *
 * @param debts
 * @returns
 */
export const unifyDebts = (debts: Debt[]): SingleDebt[] => {
  return debts.flatMap((debt) =>
    debt.creditors
      .filter((c) => c !== debt.debtor)
      .map((creditor) => ({
        debtor: debt.debtor,
        creditor,
        amount: roundTwoDecimals(debt.amount / debt.creditors.length),
      }))
  );
};

/**
 * Takes a list of debts and calculates the minimum
 * number of transactions to settle all debts.
 * Props to ChatGPT!
 *
 * @param debts The debts to settle.
 * @returns The minimum number of transactions to settle all debts.
 */
export function settleDebts(debts: SingleDebt[]): SingleDebt[] {
  // Create a map to track the net balance for each person
  const balanceMap: { [key: string]: number } = {};

  // Calculate net balance for each person
  debts.forEach((debt) => {
    const { debtor, creditor, amount } = debt;
    if (!(debtor in balanceMap)) {
      balanceMap[debtor] = 0;
    }
    if (!(creditor in balanceMap)) {
      balanceMap[creditor] = 0;
    }
    balanceMap[debtor] -= amount;
    balanceMap[creditor] += amount;
  });

  // Create arrays for debtors and creditors
  const debtors: string[] = [];
  const creditors: string[] = [];
  for (const person in balanceMap) {
    if (balanceMap[person] < 0) {
      debtors.push(person);
    } else if (balanceMap[person] > 0) {
      creditors.push(person);
    }
  }

  // Sort debtors and creditors by balance
  debtors.sort((a, b) => balanceMap[a] - balanceMap[b]);
  creditors.sort((a, b) => balanceMap[b] - balanceMap[a]);

  // Calculate minimum transactions
  const transactions: SingleDebt[] = [];
  for (let i = 0; i < debtors.length; i++) {
    while (balanceMap[debtors[i]] < 0) {
      const debtor = debtors[i];
      const creditor = creditors[0];
      const amount = Math.min(-balanceMap[debtor], balanceMap[creditor]);
      balanceMap[debtor] = roundTwoDecimals(balanceMap[debtor] + amount);
      balanceMap[creditor] = roundTwoDecimals(balanceMap[creditor] - amount);
      transactions.push({ debtor, creditor, amount });
      if (balanceMap[creditor] === 0) {
        creditors.shift();
      }
    }
  }

  return transactions;
}
