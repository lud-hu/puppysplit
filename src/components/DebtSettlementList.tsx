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
      <h2 class="text-xl">Settle Debts</h2>
      <ul class="m-0">
        {settleDebts.length > 0 ? (
          settleDebts?.map((d) => (
            <li>
              {/* TOOD: Proper rounding */}
              {d.creditor} sends {Math.round(d.amount * 100) / 100}€ to{" "}
              {d.debtor}
              {users.find((u) => u.name === d.debtor)?.payPalHandle && (
                <div class="pl-4">
                  <a
                    href={`https://paypal.me/${
                      users.find((u) => u.name === d.debtor)?.payPalHandle
                    }/${Math.round(d.amount * 100) / 100}`}
                  >
                    via Paypal
                  </a>
                </div>
              )}
            </li>
          ))
        ) : (
          <li>No expenses to settle.</li>
        )}
      </ul>
    </section>
  );
}
