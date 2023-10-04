import * as elements from "typed-html";
import { MyDebt } from "./PuppyDetails";
import DeleteIcon from "./icons/DeleteIcon";

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
    <li class="py-2 px-4 not-last:border-b-2 border-gray-300 flex justify-between">
      <div>
        {debt.debtor} paid {debt.amount}€ for <i>{debt.title}</i>
        <br />
        <small>
          Members:{" "}
          {debt.creditors.length === puppyUserCount
            ? "All"
            : debt.creditors.map((c) => c.name).join(", ")}
          on {debt.date?.toLocaleDateString()}
        </small>
      </div>
      <button
        aria-label="Delete"
        hx-confirm="Delete Expense?"
        hx-delete={`/puppies/${puppyId}/debts/${debt.id}`}
        hx-target="closest li"
        hx-swap="outerHTML swap:.5s"
        class="px-5"
      >
        <DeleteIcon />
      </button>
    </li>
  );
}
