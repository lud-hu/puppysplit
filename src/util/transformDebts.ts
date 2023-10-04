import { MyDebt } from "../components/PuppyDetails";

export default (
  // TODO: Infer type from db scheme
  debts: {
    id: number;
    title: string;
    amount: number;
    debtorId: number;
    date: Date;
    puppyId: number;
    creditorsToDebts: {
      userId: number;
      debtId: number;
      user: {
        id: number;
        name: string;
        puppyId: number;
      };
    }[];
    debtor: {
      id: number;
      name: string;
      puppyId: number;
    };
  }[]
): MyDebt[] => {
  return (
    debts.map((debt) => ({
      ...debt,
      creditorsToDebts: undefined,
      debtorId: debt.debtorId,
      debtor: debt.debtor.name,
      creditors: debt.creditorsToDebts.map((c) => ({
        name: c.user.name,
        id: c.user.id,
      })),
    })) || []
  );
};
