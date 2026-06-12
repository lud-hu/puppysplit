import { Html } from "@kitajs/html";
import { User } from "../db/schema";
import { Transfer } from "../types";
import { Button, LinkButton, SectionHeading } from "./ui";

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
      <SectionHeading>Settle Debts</SectionHeading>
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
                      <LinkButton
                        color="gray"
                        href={`https://paypal.me/${payPalHandle}/${transfer.amount}`}
                      >
                        Send via Paypal
                      </LinkButton>
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
                  <Button type="submit">Mark settled</Button>
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
