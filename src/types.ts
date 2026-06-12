/**
 * An expense as rendered in lists: the payer flattened to a name,
 * participants (who owe their share to the payer) reduced to id + name.
 */
export interface Expense {
  id: number;
  title: string;
  amount: number;
  date?: Date;
  payerId: number;
  payer: string;
  participants: {
    name: string;
    id: number;
  }[];
}

/**
 * A single payment: `from` sends `amount` to `to`.
 */
export interface Transfer {
  fromId: number;
  from: string;
  toId: number;
  to: string;
  amount: number;
}
