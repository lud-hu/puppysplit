import { Elysia, t } from "elysia";
import * as elements from "typed-html";
import BaseHtml from "../../../components/BaseHtml";
import DebtList from "../../../components/DebtList";
import DebtListEntry from "../../../components/DebtListEntry";
import PuppyHeader from "../../../components/PuppyHeader";
import {
  createDebt,
  deleteDebt,
  getPuppyUsers,
  getPuppyWithDebts,
} from "../../../db/queries";

const puppiesByIndexDebtsRoutes = new Elysia()
  .get(
    "/puppies/:id/debts",
    async ({ params }) => {
      const puppy = await getPuppyWithDebts(params.id);

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
          <DebtList
            debts={puppy.debts}
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
    "/puppies/:id/debts/:debtId",
    async ({ params }) => {
      await deleteDebt(params.debtId);
      return null;
    },
    {
      params: t.Object({
        id: t.String(),
        debtId: t.Numeric(),
      }),
    }
  )
  // Add a debt to a puppy
  .post(
    "/puppies/:id/debts",
    async ({ body, params }) => {
      const parsedAmount = parseFloat(body.amount);
      if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
        throw new Error("Invalid amount");
      }

      const users = await getPuppyUsers(params.id);

      const getCreditorIds = () => {
        const creditorIds = body.creditorIds;
        if (body.splitSetting === "betweenAll") {
          // If "betweenAll" is set we want to split the debt between all users
          return users.map((u) => u.id);
        } else if (creditorIds) {
          if (Array.isArray(creditorIds) && creditorIds?.length > 0) {
            // If an array of creditorIds is set, we want to split the debt between the selected users
            return users
              .filter((u) => creditorIds.includes(u.id.toString()))
              .map((u) => u.id);
          } else {
            // If a single creditorId is set, we want to split the debt only for the selected user
            return users
              .filter((u) => creditorIds === u.id.toString())
              .map((u) => u.id);
          }
        }

        throw new Error(
          'Either splitSetting="betweenAll" or creditorIds must be set'
        );
      };

      const creditorIds = getCreditorIds();

      const newDebt = await createDebt({
        amount: parsedAmount,
        debtorId: parseInt(body.debtorId),
        puppyId: params.id,
        title: body.title,
        creditorIds,
      });

      return (
        <DebtListEntry
          puppyId={params.id}
          puppyUserCount={users.length}
          debt={{
            debtor: users.find((u) => u.id === newDebt.debtorId)?.name || "",
            creditors: creditorIds.map((c) => {
              const u = users.find((u) => u.id === c);
              return {
                name: u?.name || "",
                id: u?.id || 0,
              };
            }),
            amount: newDebt.amount,
            title: newDebt.title,
            date: newDebt.date,
            debtorId: newDebt.debtorId,
            id: newDebt.id,
          }}
        />
      );
    },
    {
      body: t.Object({
        title: t.String({ minLength: 2 }),
        // TODO: How to accept number here directly?
        amount: t.String(),
        debtorId: t.String(),
        creditorIds: t.Optional(
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

export default puppiesByIndexDebtsRoutes;
