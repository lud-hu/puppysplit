/**
 * A debt as rendered in lists: the debtor (who paid) flattened to a name,
 * creditors (who owe a share) reduced to id + name.
 */
export interface MyDebt {
  id: number;
  title: string;
  amount: number;
  date?: Date;
  debtorId: number;
  debtor: string;
  creditors: {
    name: string;
    id: number;
  }[];
}
