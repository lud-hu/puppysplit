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
  puppyId: string;
  title?: string;
  additionalListItem?: string;
}) {
  return (
    <section>
      <h2 class="text-2xl mb-3 pl-4 block uppercase tracking-wide text-gray-700 font-bold">
        {title}
      </h2>
      <ul class="m-0 p-4 bg-gray-100" id="debt-list">
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
