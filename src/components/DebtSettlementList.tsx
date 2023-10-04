import * as elements from "typed-html";
import { SingleDebt } from "../util/settleDebts";
import { User } from "../db/schema";

export default function DebtSettlementList({
  settleDebts,
  users,
  puppyId,
}: {
  settleDebts: SingleDebt[];
  users: User[];
  puppyId: number;
}) {
  return (
    <section id="debt-settlement-list">
      <h2 class="text-2xl mb-3 pl-4 block uppercase tracking-wide text-gray-700 font-bold">
        Settle Debts
      </h2>
      <ul class="m-0 p-4 bg-gray-100">
        {settleDebts.length > 0 ? (
          settleDebts?.map((d) => (
            <li class="flex items-center justify-between py-2 px-4 not-last:border-b-2 border-gray-300">
              <div>
                {/* TOOD: Proper rounding */}
                {d.creditor} sends {d.amount}€ to {d.debtor}
                {users.find((u) => u.name === d.debtor)?.payPalHandle && (
                  <div class="p-2">
                    <a
                      class="inline bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded no-underline"
                      href={`https://paypal.me/${
                        users.find((u) => u.name === d.debtor)?.payPalHandle
                      }/${d.amount}`}
                    >
                      via Paypal
                    </a>
                  </div>
                )}
              </div>
              <form
                hx-confirm="Really mark settled?"
                hx-post={`/puppies/${puppyId}/debts`}
                // TODO: Change from just deleting the row item to showing a success message.
                hx-swap="delete swap:.5s"
                hx-target="closest li"
              >
                <input
                  type="hidden"
                  name="debtorId"
                  value={d.creditorId.toString()}
                />
                <input
                  type="hidden"
                  name="creditorIds"
                  value={d.debtorId.toString()}
                />
                <input
                  type="hidden"
                  name="amount"
                  value={d.amount?.toString()}
                />
                <input
                  type="hidden"
                  name="title"
                  value={`Settlement to ${d.debtor}`}
                />
                <input
                  type="hidden"
                  name="splitSetting"
                  value="notBetweenAll"
                />
                <button
                  type="submit"
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Mark settled
                </button>
              </form>
            </li>
          ))
        ) : (
          <li>No expenses to settle. 🎉</li>
        )}
      </ul>
    </section>
  );
}
