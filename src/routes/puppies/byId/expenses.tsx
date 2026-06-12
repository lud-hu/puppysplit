import { Elysia, t } from "elysia";
import BaseHtml from "../../../components/BaseHtml";
import ExpenseList from "../../../components/ExpenseList";
import ExpenseListItem from "../../../components/ExpenseListItem";
import PuppyHeader from "../../../components/PuppyHeader";
import {
  createExpense,
  deleteExpense,
  getPuppyUsers,
  getPuppyWithExpenses,
} from "../../../db/queries";
import { resolveParticipantIds } from "../../../util/resolveParticipants";

const puppyExpensesRoutes = new Elysia()
  .get(
    "/puppies/:id/expenses",
    async ({ params }) => {
      const puppy = await getPuppyWithExpenses(params.id);

      if (!puppy) {
        return <div>Not found</div>;
      }

      const users = await getPuppyUsers(params.id);

      return (
        <BaseHtml pageTitle={puppy.title + " - Puppysplit"}>
          <PuppyHeader
            puppyId={puppy.id}
            title={puppy.title}
            users={users}
            backLink={`/puppies/${puppy.id}`}
          />
          <ExpenseList
            expenses={puppy.expenses}
            users={users}
            puppyId={puppy.id}
            title="All Expenses"
          />
        </BaseHtml>
      );
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .delete(
    "/puppies/:id/expenses/:expenseId",
    async ({ params }) => {
      await deleteExpense(params.expenseId);
      return null;
    },
    {
      params: t.Object({
        id: t.String(),
        expenseId: t.Numeric(),
      }),
    }
  )
  // Add an expense to a puppy
  .post(
    "/puppies/:id/expenses",
    async ({ body, params }) => {
      const users = await getPuppyUsers(params.id);
      const participantIds = resolveParticipantIds(
        body.splitSetting,
        body.participantIds,
        users
      );

      const newExpense = await createExpense({
        amount: body.amount,
        payerId: body.payerId,
        puppyId: params.id,
        title: body.title,
        participantIds,
      });

      return (
        <ExpenseListItem
          puppyId={params.id}
          puppyUserCount={users.length}
          expense={{
            payer: users.find((u) => u.id === newExpense.payerId)?.name || "",
            participants: participantIds.map((id) => {
              const u = users.find((u) => u.id === id);
              return {
                name: u?.name || "",
                id: u?.id || 0,
              };
            }),
            amount: newExpense.amount,
            title: newExpense.title,
            date: newExpense.date,
            payerId: newExpense.payerId,
            id: newExpense.id,
          }}
        />
      );
    },
    {
      body: t.Object({
        title: t.String({ minLength: 2 }),
        amount: t.Numeric({ exclusiveMinimum: 0 }),
        payerId: t.Numeric(),
        participantIds: t.Optional(
          t.Union([t.Array(t.String(), { minLength: 1 }), t.String()])
        ),
        splitSetting: t.Union([
          t.Literal("betweenAll"),
          t.Literal("notBetweenAll"),
        ]),
      }),
      params: t.Object({
        id: t.String(),
      }),
    }
  );

export default puppyExpensesRoutes;
