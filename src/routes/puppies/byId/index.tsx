import { desc } from "drizzle-orm";
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
  .use(puppiesByIndexDebtsRoutes)
  .use(puppiesByIndexSettleRoutes)
  .use(puppiesByIndexTitleRoutes)
  .use(puppiesByIndexUsersRoutes)
  .use(puppiesByIndexSettingsRoutes);

export default puppyIndexRoutes;
