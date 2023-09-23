import * as elements from "typed-html";
import { SingleDebt } from "../util/settleDebts";
import { User } from "../db/schema";

export default function DebtSettlementList({
  settleDebts,
  users,
}: {
  settleDebts: SingleDebt[];
  users: User[];
}) {
  return (
    <section id="debt-settlement-list">
      <h2 class="text-xl">Ausgleich</h2>
      <ul class="m-0">
        {settleDebts.length > 0 ? (
          settleDebts?.map((d) => (
            <li>
              {/* TOOD: Proper rounding */}
              {d.creditor} gibt {Math.round(d.amount * 100) / 100}€ an{" "}
              {d.debtor}
              {users.find((u) => u.name === d.debtor)?.payPalHandle && (
                <div class="pl-4">
                  <a
                    href={`https://paypal.me/${
                      users.find((u) => u.name === d.debtor)?.payPalHandle
                    }/${Math.round(d.amount * 100) / 100}`}
                  >
                    per Paypal
                  </a>
                </div>
              )}
            </li>
          ))
        ) : (
          <li>Keine Ausgaben auszugleichen.</li>
        )}
      </ul>
    </section>
  );
}
