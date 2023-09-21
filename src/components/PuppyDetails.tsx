import * as elements from "typed-html";
import { User } from "../db/schema";
import AddDebtForm from "./AddDebtForm";
import DebtList from "./DebtList";
import PuppyHeader from "./PuppyHeader";

export default function PuppyDetails({
  id,
  title,
  debts,
  users,
}: {
  debts: MyDebt[];
  id: number;
  title: string;
  users: User[];
}) {
  return (
    <div class="flex flex-col space-y-3">
      <PuppyHeader puppyId={id} title={title} users={users} backLink="/" />
      <AddDebtForm users={users} puppyId={id} />
      <DebtList
        debts={debts.slice(0, 5)}
        users={users}
        puppyId={id}
        additionalListItem={
          <li class="py-2 px-4 text-center">
            <a href={`/puppies/${id}/debts`}>Show All</a>
          </li>
        }
      />
      <a href={`/puppies/${id}/settle`}>Settle</a>
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
