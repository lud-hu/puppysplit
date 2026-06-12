import type { Expense, Transfer } from "../types";

const roundTwoDecimals = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

/** The subset of an expense the settlement math needs. */
export type SplittableExpense = Pick<
  Expense,
  "payer" | "payerId" | "participants" | "amount"
>;

/**
 * Converts expenses into pairwise transfers: every participant
 * (except the payer themselves) owes the payer an even share
 * of the amount.
 */
export const expensesToTransfers = (
  expenses: SplittableExpense[]
): Transfer[] => {
  return expenses
    .filter((expense) => Number.isFinite(expense.amount) && expense.amount > 0)
    .flatMap((expense) =>
      expense.participants
        .filter((participant) => participant.id !== expense.payerId)
        .map((participant) => ({
          fromId: participant.id,
          from: participant.name,
          toId: expense.payerId,
          to: expense.payer,
          amount: roundTwoDecimals(
            expense.amount / expense.participants.length
          ),
        }))
    );
};

/**
 * Takes a list of transfers and calculates the minimum number of
 * payments to settle all of them.
 *
 * People are tracked by user id, so two users with the same name
 * cannot mix up each other's balances.
 */
export function settleTransfers(transfers: Transfer[]): Transfer[] {
  // Net balance per person: positive = has to send money,
  // negative = receives money.
  const balanceById = new Map<number, number>();
  const nameById = new Map<number, string>();

  transfers.forEach(({ fromId, from, toId, to, amount }) => {
    balanceById.set(toId, (balanceById.get(toId) ?? 0) - amount);
    balanceById.set(fromId, (balanceById.get(fromId) ?? 0) + amount);
    nameById.set(toId, to);
    nameById.set(fromId, from);
  });

  const receivers: number[] = [];
  const senders: number[] = [];
  for (const [id, balance] of balanceById) {
    if (balance < 0) {
      receivers.push(id);
    } else if (balance > 0) {
      senders.push(id);
    }
  }

  // Settle the largest balances first to keep the number of payments low.
  receivers.sort((a, b) => balanceById.get(a)! - balanceById.get(b)!);
  senders.sort((a, b) => balanceById.get(b)! - balanceById.get(a)!);

  const payments: Transfer[] = [];
  for (const receiverId of receivers) {
    while (balanceById.get(receiverId)! < 0) {
      if (senders.length === 0) break;
      const senderId = senders[0];
      const amount = Math.min(
        -balanceById.get(receiverId)!,
        balanceById.get(senderId)!
      );
      balanceById.set(
        receiverId,
        roundTwoDecimals(balanceById.get(receiverId)! + amount)
      );
      balanceById.set(
        senderId,
        roundTwoDecimals(balanceById.get(senderId)! - amount)
      );
      payments.push({
        fromId: senderId,
        from: nameById.get(senderId)!,
        toId: receiverId,
        to: nameById.get(receiverId)!,
        amount: roundTwoDecimals(amount),
      });
      if (balanceById.get(senderId) === 0) {
        senders.shift();
      }
    }
  }

  // Rounding residue can leave behind transfers of 0€ — drop them.
  return payments.filter((payment) => payment.amount > 0);
}
