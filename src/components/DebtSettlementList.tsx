import * as elements from "typed-html";
import { SingleDebt } from "../util/settleDebts";

export default function DebtSettlementList({
  settleDebts,
}: {
  settleDebts: SingleDebt[];
}) {
  return (
    <section id="debt-settlement-list">
      <h2 class="text-xl">Ausgleich</h2>
      <ul class="m-0">
        {settleDebts?.map((d) => (
          <li>
            {/* TOOD: Proper rounding */}
            {d.creditor} gibt {Math.round(d.amount * 100) / 100}€ an {d.debtor}
          </li>
        ))}
      </ul>
    </section>
  );
}
