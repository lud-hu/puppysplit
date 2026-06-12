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
      const parsedAmount = parseFloat(body.amount);
      if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
        throw new Error("Invalid amount");
      }

      const users = await getPuppyUsers(params.id);

      const getParticipantIds = () => {
        const participantIds = body.participantIds;
        if (body.splitSetting === "betweenAll") {
          // Split the expense between all users
          return users.map((u) => u.id);
        } else if (participantIds) {
          if (Array.isArray(participantIds) && participantIds?.length > 0) {
            // Split the expense between the selected users
            return users
              .filter((u) => participantIds.includes(u.id.toString()))
              .map((u) => u.id);
          } else {
            // A single participant was selected
            return users
              .filter((u) => participantIds === u.id.toString())
              .map((u) => u.id);
          }
        }

        throw new Error(
          'Either splitSetting="betweenAll" or participantIds must be set'
        );
      };

      const participantIds = getParticipantIds();

      const newExpense = await createExpense({
        amount: parsedAmount,
        payerId: parseInt(body.payerId),
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
        // TODO: How to accept number here directly?
        amount: t.String(),
        payerId: t.String(),
        participantIds: t.Optional(
          t.Union([t.Array(t.String(), { minLength: 1 }), t.String()])
        ),
        splitSetting: t.String({
          enum: ["betweenAll", "notBetweenAll"],
        }),
      }),
      params: t.Object({
        id: t.String(),
      }),
    }
  );

export default puppyExpensesRoutes;
