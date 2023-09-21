import * as elements from "typed-html";
import { User } from "../db/schema";
import { SingleDebt } from "../util/settleDebts";
import DebtList from "./DebtList";
import DebtSettlementList from "./DebtSettlementList";
import PuppyHeader from "./PuppyHeader";

export default function PuppyDetails({
  id,
  title,
  debts,
  settleDebts,
  users,
}: {
  debts: MyDebt[];
  id: number;
  title: string;
  settleDebts: SingleDebt[];
  users: User[];
}) {
  return (
    <div class="flex flex-col space-y-3">
      <PuppyHeader puppyId={id} title={title} users={users} backLink="/" />
      <DebtList debts={debts} users={users} puppyId={id} />
      <DebtSettlementList settleDebts={settleDebts} />
    </div>
  );
}

export interface MyDebt {
  creditorsToDebts: undefined;
  debtorId: undefined;
  debtor: string;
  creditors: string[];
  id: number;
  title: string;
  amount: number;
  date?: Date;
}
