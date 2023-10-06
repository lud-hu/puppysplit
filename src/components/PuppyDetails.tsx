import * as elements from "typed-html";
import { User } from "../db/schema";
import AddDebtForm from "./AddDebtForm";
import DebtList from "./DebtList";
import PuppyHeader from "./PuppyHeader";

export default function PuppyDetails({
  id,
  title,
  debts,
  users,
}: {
  debts: MyDebt[];
  id: number;
  title: string;
  users: User[];
}) {
  return (
    <div class="flex flex-col gap-3">
      <PuppyHeader puppyId={id} title={title} users={users} />
      <main class="flex flex-col gap-10">
        <AddDebtForm users={users} puppyId={id} />
        <DebtList
          debts={debts.slice(0, 5)}
          users={users}
          puppyId={id}
          additionalListItem={
            <li class="py-2 px-4 text-center">
              <a
                href={`/puppies/${id}/debts`}
                class="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded no-underline"
              >
                Show All
              </a>
            </li>
          }
        />
        <section>
          <h2 class="text-2xl mb-3 pl-4 block uppercase tracking-wide text-gray-700 font-bold">
            Settle
          </h2>
          <div class="p-4 pb-8 bg-gray-100 flex justify-between items-center">
            <p class="mb-2">Finished adding expenses?</p>
            <a
              href={`/puppies/${id}/settle`}
              class="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded no-underline"
            >
              Settle Now
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

export interface MyDebt {
  creditorsToDebts: undefined;
  debtorId: number;
  debtor: string;
  creditors: {
    name: string;
    id: number;
  }[];
  id: number;
  title: string;
  amount: number;
  date?: Date;
}
