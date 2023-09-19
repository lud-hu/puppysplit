import * as elements from "typed-html";
import { User } from "../db/schema";
import AddDebtForm from "./AddDebtForm";
import DebtListEntry from "./DebtListEntry";
import { MyDebt } from "./PuppyDetails";

export default function DebtList({
  debts,
  users,
  puppyId,
}: {
  debts: MyDebt[];
  users: User[];
  puppyId: number;
}) {
  return (
    <section>
      <h2 class="text-xl">Ausgaben</h2>
      <ul class="m-0" id="debt-list">
        {debts?.map((d) => (
          <DebtListEntry debt={d} />
        ))}
      </ul>
      <AddDebtForm users={users} puppyId={puppyId} />
    </section>
  );
}
