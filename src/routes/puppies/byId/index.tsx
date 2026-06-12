import { Elysia, t } from "elysia";
import * as elements from "typed-html";
import BaseHtml from "../../../components/BaseHtml";
import PuppyDetails from "../../../components/PuppyDetails";
import {
  deletePuppyCascade,
  getPuppyUsers,
  getPuppyWithDebts,
} from "../../../db/queries";
import puppiesByIndexDebtsRoutes from "./debts";
import puppiesByIndexSettingsRoutes from "./settings";
import puppiesByIndexSettleRoutes from "./settle";
import puppiesByIndexTitleRoutes from "./title";
import puppiesByIndexUsersRoutes from "./users";

const puppyIndexRoutes = new Elysia()
  .get(
    "/puppies/:id",
    async ({ params }) => {
      const puppy = await getPuppyWithDebts(params.id);

      if (!puppy) {
        return <div>Not found</div>;
      }

      const users = await getPuppyUsers(params.id);

      return (
        <BaseHtml pageTitle={puppy.title + " - Puppysplit"}>
          <PuppyDetails
            debts={puppy.debts}
            puppyId={puppy.id}
            title={puppy.title}
            users={users}
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
    "/puppies/:id",
    async ({ params, set }) => {
      try {
        await deletePuppyCascade(params.id);
      } catch (e) {
        console.error(e);
      }

      set.headers["HX-Redirect"] = `/`;
      return null;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .use(puppiesByIndexDebtsRoutes)
  .use(puppiesByIndexSettleRoutes)
  .use(puppiesByIndexTitleRoutes)
  .use(puppiesByIndexUsersRoutes)
  .use(puppiesByIndexSettingsRoutes);

export default puppyIndexRoutes;
