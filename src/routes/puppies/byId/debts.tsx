import { desc, eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import * as elements from "typed-html";
import BaseHtml from "../../../components/BaseHtml";
import DebtList from "../../../components/DebtList";
import DebtListEntry from "../../../components/DebtListEntry";
import PuppyHeader from "../../../components/PuppyHeader";
import { db } from "../../../db";
import { creditorsToDebts, debts } from "../../../db/schema";
import transformDebts from "../../../util/transformDebts";

const puppiesByIndexDebtsRoutes = new Elysia()
  .get(
    "/puppies/:id/debts",
    async ({ params, set }) => {
      const data = await db.query.puppies.findFirst({
        where: (puppies, { eq }) => eq(puppies.id, params.id),
        with: {
          debts: {
            orderBy: (debts) => [desc(debts.date)],
            with: {
              debtor: true,
              creditorsToDebts: {
                with: {
                  user: true,
                },
              },
            },
          },
        },
      });

      if (!data) {
        return <div>Not found</div>;
      }

      const debts = transformDebts(data.debts);

      const users = await db.query.users.findMany({
        where: (users, { eq }) => eq(users.puppyId, params.id),
      });

      if (data) {
        return (
          <BaseHtml pageTitle={data.title + " - Puppysplit"}>
            <PuppyHeader
              puppyId={data.id}
              title={data.title}
              users={users}
              backLink={`/puppies/${data.id}`}
            />
            <DebtList
              debts={debts}
              users={users}
              puppyId={data.id}
              title="All Expenses"
            />
          </BaseHtml>
        );
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  ) // Add a debt to a puppy
  .delete(
    "/puppies/:id/debts/:debtId",
    async ({ params }) => {
      await db
        .delete(creditorsToDebts)
        .where(eq(creditorsToDebts.debtId, params.debtId));
      await db.delete(debts).where(eq(debts.id, params.debtId));

      return null;
    },
    {
      params: t.Object({
        id: t.Numeric(),
        debtId: t.Numeric(),
      }),
    }
  )
  .post(
    "/puppies/:id/debts",
    async ({ body, params }) => {
      const newDebt = await db
        .insert(debts)
        .values({
          amount: parseFloat(body.amount),
          debtorId: parseInt(body.debtorId),
          puppyId: params.id,
          title: body.title,
          date: new Date(),
        })
        .returning()
        .get();

      const users = await db.query.users.findMany({
        where: (users, { eq }) => eq(users.puppyId, params.id),
      });

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

      await db.insert(creditorsToDebts).values(
        creditorIds.map((c) => ({
          debtId: newDebt.id,
          userId: c,
        }))
      );

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
            creditorsToDebts: undefined,
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
        id: t.Numeric(),
      }),
      error({ code, error }) {
        switch (code) {
          case "VALIDATION":
            console.log(error.all);

            // Find a specific error name (path is OpenAPI Schema compliance)
            const name = error.all.find((x) => x.path === "/name");

            // If has validation error, then log it
            if (name) console.log(name);
        }
      },
    }
  );

export default puppiesByIndexDebtsRoutes;
