import { User } from "../db/schema";
import { Expense } from "../types";
import AddExpenseForm from "./AddExpenseForm";
import ExpenseList from "./ExpenseList";
import PuppyHeader from "./PuppyHeader";
import { LinkButton, SectionHeading } from "./ui";

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
            <LinkButton href={`/puppies/${puppyId}/expenses`}>
              Show All
            </LinkButton>
          </li>
        </ExpenseList>
        <section>
          <SectionHeading>Settle</SectionHeading>
          <div class="p-4 pb-8 bg-gray-100 flex justify-between items-center">
            <p class="mb-2">Finished adding expenses?</p>
            <LinkButton href={`/puppies/${puppyId}/settle`}>
              Show Debts
            </LinkButton>
          </div>
        </section>
      </main>
    </div>
  );
}
