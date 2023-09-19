import * as elements from "typed-html";
import { MyDebt } from "./PuppyDetails";

export default function DebtListEntry({ debt }: { debt: MyDebt }) {
  return (
    <li>
      {debt.debtor} hat {debt.amount}€ für {debt.title} bezahlt
      <br />
      <small>Teilnehmer: {debt.creditors.join(", ")}</small>
    </li>
  );
}
