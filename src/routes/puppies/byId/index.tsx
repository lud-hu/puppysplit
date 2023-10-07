import { desc, eq, inArray } from "drizzle-orm";
import { Elysia, t } from "elysia";
import * as elements from "typed-html";
import BaseHtml from "../../../components/BaseHtml";
import PuppyDetails from "../../../components/PuppyDetails";
import { db } from "../../../db";
import transformDebts from "../../../util/transformDebts";
import puppiesByIndexDebtsRoutes from "./debts";
import puppiesByIndexSettingsRoutes from "./settings";
import puppiesByIndexSettleRoutes from "./settle";
import puppiesByIndexTitleRoutes from "./title";
import puppiesByIndexUsersRoutes from "./users";
import { creditorsToDebts, debts, puppies, users } from "../../../db/schema";

const puppyIndexRoutes = new Elysia()
  .get(
    "/puppies/:id",
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
        // set.headers["HX-Push-Url"] = `/puppies/${params.id}`;
        return (
          <BaseHtml pageTitle={data.title + " - Puppysplit"}>
            <PuppyDetails
              debts={debts}
              id={data.id}
              title={data.title}
              users={users}
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
  )
  .delete(
    "/puppies/:id",
    async ({ params, set }) => {
      const puppyUsers = await db.query.users.findMany({
        where: (users, { eq }) => eq(users.puppyId, params.id),
        columns: { id: true },
      });
      const userIds = puppyUsers.map((u) => u.id);

      try {
        await db.transaction(async (tx) => {
          if (userIds.length > 0) {
            await tx
              .delete(creditorsToDebts)
              .where(inArray(creditorsToDebts.userId, userIds));
            await tx.delete(debts).where(inArray(debts.debtorId, userIds));
            await tx.delete(users).where(eq(users.puppyId, params.id));
          }
          await tx.delete(puppies).where(eq(puppies.id, params.id));
        });
      } catch (e) {
        console.error(e);
      }

      set.headers["HX-Redirect"] = `/`;
      return null;
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .use(puppiesByIndexDebtsRoutes)
  .use(puppiesByIndexSettleRoutes)
  .use(puppiesByIndexTitleRoutes)
  .use(puppiesByIndexUsersRoutes)
  .use(puppiesByIndexSettingsRoutes);

export default puppyIndexRoutes;
