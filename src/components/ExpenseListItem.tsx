import { Html } from "@kitajs/html";
import { Expense } from "../types";
import DeleteIcon from "./icons/DeleteIcon";

export default function ExpenseListItem({
  expense,
  puppyUserCount,
  puppyId,
}: {
  expense: Expense;
  puppyUserCount: number;
  puppyId: string;
}) {
  return (
    <li class="py-2 px-4 not-last:border-b-2 border-gray-300 flex justify-between">
      <div>
        {Html.escapeHtml(expense.payer)} paid {expense.amount}€ for{" "}
        <i safe>{expense.title}</i>
        <br />
        <small>
          Members:{" "}
          {Html.escapeHtml(
            expense.participants.length === puppyUserCount
              ? "All"
              : expense.participants.map((p) => p.name).join(", ")
          )}{" "}
          on {Html.escapeHtml(expense.date?.toLocaleDateString() ?? "")}
        </small>
      </div>
      <button
        aria-label="Delete"
        hx-confirm="Delete Expense?"
        hx-delete={`/puppies/${puppyId}/expenses/${expense.id}`}
        hx-target="closest li"
        hx-swap="outerHTML swap:.5s"
        class="px-5"
      >
        <DeleteIcon />
      </button>
    </li>
  );
}
