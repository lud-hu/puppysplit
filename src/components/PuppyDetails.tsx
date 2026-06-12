import { User } from "../db/schema";
import { Expense } from "../types";
import AddExpenseForm from "./AddExpenseForm";
import ExpenseList from "./ExpenseList";
import PuppyHeader from "./PuppyHeader";

export default function PuppyDetails({
  puppyId,
  title,
  expenses,
  users,
}: {
  expenses: Expense[];
  puppyId: string;
  title: string;
  users: User[];
}) {
  return (
    <div class="flex flex-col gap-3">
      <PuppyHeader puppyId={puppyId} title={title} users={users} />
      <main class="flex flex-col gap-10">
        <AddExpenseForm users={users} puppyId={puppyId} />
        <ExpenseList
          expenses={expenses.slice(0, 5)}
          users={users}
          puppyId={puppyId}
        >
          <li class="py-2 px-4 text-center">
            <a
              href={`/puppies/${puppyId}/expenses`}
              class="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded no-underline"
            >
              Show All
            </a>
          </li>
        </ExpenseList>
        <section>
          <h2 class="text-2xl mb-3 pl-4 block uppercase tracking-wide text-gray-700 font-bold">
            Settle
          </h2>
          <div class="p-4 pb-8 bg-gray-100 flex justify-between items-center">
            <p class="mb-2">Finished adding expenses?</p>
            <a
              href={`/puppies/${puppyId}/settle`}
              class="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded no-underline"
            >
              Show Debts
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
