import type { Children } from "@kitajs/html";
import { Html } from "@kitajs/html";
import { User } from "../db/schema";
import { Expense } from "../types";
import ExpenseListItem from "./ExpenseListItem";
import { SectionHeading } from "./ui";

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
      <SectionHeading>{Html.escapeHtml(title)}</SectionHeading>
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
