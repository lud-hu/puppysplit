import type { Children } from "@kitajs/html";
import { User } from "../db/schema";
import { Expense } from "../types";
import ExpenseListItem from "./ExpenseListItem";

export default function ExpenseList({
  expenses,
  users,
  puppyId,
  title = "Expenses",
  children,
}: {
  expenses: Expense[];
  users: User[];
  puppyId: string;
  title?: string;
  children?: Children;
}) {
  return (
    <section>
      <h2
        safe
        class="text-2xl mb-3 pl-4 block uppercase tracking-wide text-gray-700 font-bold"
      >
        {title}
      </h2>
      <ul class="m-0 p-4 bg-gray-100" id="expense-list">
        {expenses?.map((expense) => (
          <ExpenseListItem
            expense={expense}
            puppyUserCount={users.length}
            puppyId={puppyId}
          />
        ))}
        {children}
      </ul>
    </section>
  );
}
