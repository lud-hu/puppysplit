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
      <h2 class="text-2xl mb-3 pl-4 block uppercase tracking-wide text-gray-700 font-bold">
        Settle Debts
      </h2>
      <ul class="m-0 p-4 bg-gray-100">
        {settleDebts.length > 0 ? (
          settleDebts?.map((d) => (
            <li class="py-2 px-4  not-last:border-b-2 border-gray-300">
              {/* TOOD: Proper rounding */}
              {d.creditor} sends {Math.round(d.amount * 100) / 100}€ to{" "}
              {d.debtor}
              {users.find((u) => u.name === d.debtor)?.payPalHandle && (
                <div class="p-2">
                  <a
                    class="inline bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded no-underline"
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
