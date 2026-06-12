import { Html } from "@kitajs/html";
import { User } from "../db/schema";
import { Transfer } from "../types";

export default function SettlementList({
  transfers,
  users,
  puppyId,
}: {
  transfers: Transfer[];
  users: User[];
  puppyId: string;
}) {
  return (
    <section id="settlement-list">
      <h2 class="text-2xl mb-3 pl-4 block uppercase tracking-wide text-gray-700 font-bold">
        Settle Debts
      </h2>
      <ul class="m-0 p-4 bg-gray-100">
        {transfers.length > 0 ? (
          transfers.map((transfer) => {
            const payPalHandle = users.find(
              (u) => u.id === transfer.toId
            )?.payPalHandle;
            return (
              <li class="flex items-center justify-between py-2 px-4 not-last:border-b-2 border-gray-300">
                <div>
                  {Html.escapeHtml(transfer.from)} sends {transfer.amount}€ to{" "}
                  {Html.escapeHtml(transfer.to)}
                  {payPalHandle ? (
                    <div class="p-2">
                      <a
                        class="inline bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded no-underline"
                        href={`https://paypal.me/${payPalHandle}/${transfer.amount}`}
                      >
                        Send via Paypal
                      </a>
                    </div>
                  ) : null}
                </div>
                <form
                  hx-confirm="Really mark settled?"
                  hx-post={`/puppies/${puppyId}/expenses`}
                  // TODO: Change from just deleting the row item to showing a success message.
                  hx-swap="delete swap:.5s"
                  hx-target="closest li"
                >
                  <input
                    type="hidden"
                    name="payerId"
                    value={transfer.fromId.toString()}
                  />
                  <input
                    type="hidden"
                    name="participantIds"
                    value={transfer.toId.toString()}
                  />
                  <input
                    type="hidden"
                    name="amount"
                    value={transfer.amount.toString()}
                  />
                  <input
                    type="hidden"
                    name="title"
                    value={`Settlement to ${transfer.to}`}
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
            );
          })
        ) : (
          <li>No expenses to settle. 🎉</li>
        )}
      </ul>
    </section>
  );
}
