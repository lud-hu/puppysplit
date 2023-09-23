import * as elements from "typed-html";
import { User } from "../db/schema";
import DebtListEntry from "./DebtListEntry";
import { MyDebt } from "./PuppyDetails";

export default function DebtList({
  debts,
  users,
  puppyId,
  title = "Expenses",
  additionalListItem,
}: {
  debts: MyDebt[];
  users: User[];
  puppyId: number;
  title?: string;
  additionalListItem?: string;
}) {
  return (
    <section>
      <h2 class="text-xl">{title}</h2>
      <ul class="m-0" id="debt-list">
        {debts?.map((d) => (
          <DebtListEntry
            debt={d}
            puppyUserCount={users.length}
            puppyId={puppyId}
          />
        ))}
        {additionalListItem}
      </ul>
    </section>
  );
}
