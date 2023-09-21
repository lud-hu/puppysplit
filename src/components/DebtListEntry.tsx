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
    <li class="py-2 px-4 even:bg-gray-100">
      {debt.debtor} hat {debt.amount}€ für {debt.title} bezahlt
      <br />
      <small>
        Teilnehmer:{" "}
        {debt.creditors.length === puppyUserCount
          ? "Alle"
          : debt.creditors.join(", ")}
        am {debt.date?.toLocaleDateString()}
      </small>
      <button
        hx-confirm="Ausgabe wirklich löschen?"
        hx-delete={`/puppies/${puppyId}/debts/${debt.id}`}
        hx-target="closest li"
        hx-swap="outerHTML swap:.5s"
      >
        X
      </button>
    </li>
  );
}
