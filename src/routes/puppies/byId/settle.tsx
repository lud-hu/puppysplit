import { desc } from "drizzle-orm";
import { Elysia, t } from "elysia";
import * as elements from "typed-html";
import BaseHtml from "../../../components/BaseHtml";
import DebtSettlementList from "../../../components/DebtSettlementList";
import PuppyHeader from "../../../components/PuppyHeader";
import { db } from "../../../db";
import { settleDebts, unifyDebts } from "../../../util/settleDebts";
import transformDebts from "../../../util/transformDebts";

const puppiesByIndexSettleRoutes = new Elysia().get(
  "/puppies/:id/settle",
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
            title={data.title}
            users={users}
            backLink={`/puppies/${data.id}`}
          />
          <DebtSettlementList
            settleDebts={settleDebts(unifyDebts(debts))}
            users={users}
            puppyId={data.id}
          />
        </BaseHtml>
      );
    }
  },
  {
    params: t.Object({
      id: t.String(),
    }),
  }
);

// instead of exporting route handlers, we create new elysia instance with routes and export it
export default puppiesByIndexSettleRoutes;
