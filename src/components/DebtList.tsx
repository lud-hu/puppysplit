import type { Children } from "@kitajs/html";
import { User } from "../db/schema";
import { MyDebt } from "../types";
import DebtListEntry from "./DebtListEntry";

export default function DebtList({
  debts,
  users,
  puppyId,
  title = "Expenses",
  children,
}: {
  debts: MyDebt[];
  users: User[];
  puppyId: string;
  title?: string;
  children?: Children;
}) {
  return (
    <section>
      <h2
        safe
        class="text-2xl mb-3 pl-4 block uppercase tracking-wide text-gray-700 font-bold"
      >
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
        {children}
      </ul>
    </section>
  );
}
