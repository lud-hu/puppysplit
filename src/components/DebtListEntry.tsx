import * as elements from "typed-html";
import { MyDebt } from "./PuppyDetails";

export default function DebtListEntry({
  debt,
  puppyUserCount,
  puppyId,
}: {
  debt: MyDebt;
  puppyUserCount: number;
  puppyId: number;
}) {
  return (
    <li class="py-2 px-4 not-last:border-b-2 border-gray-300">
      {debt.debtor} paid {debt.amount}€ for {debt.title}
      <br />
      <small>
        Members:{" "}
        {debt.creditors.length === puppyUserCount
          ? "All"
          : debt.creditors.join(", ")}
        on {debt.date?.toLocaleDateString()}
      </small>
      <button
        hx-confirm="Delete Expense?"
        hx-delete={`/puppies/${puppyId}/debts/${debt.id}`}
        hx-target="closest li"
        hx-swap="outerHTML swap:.5s"
      >
        X
      </button>
    </li>
  );
}
