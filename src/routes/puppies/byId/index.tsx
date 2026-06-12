import { Elysia, t } from "elysia";
import BaseHtml from "../../../components/BaseHtml";
import PuppyDetails from "../../../components/PuppyDetails";
import {
  deletePuppyCascade,
  getPuppyUsers,
  getPuppyWithExpenses,
} from "../../../db/queries";
import puppyExpensesRoutes from "./expenses";
import puppySettingsRoutes from "./settings";
import puppySettleRoutes from "./settle";
import puppyTitleRoutes from "./title";
import puppyUsersRoutes from "./users";

const puppyIndexRoutes = new Elysia()
  .get(
    "/puppies/:id",
    async ({ params }) => {
      const puppy = await getPuppyWithExpenses(params.id);

      if (!puppy) {
        return <div>Not found</div>;
      }

      const users = await getPuppyUsers(params.id);

      return (
        <BaseHtml pageTitle={puppy.title + " - Puppysplit"}>
          <PuppyDetails
            expenses={puppy.expenses}
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
  .use(puppyExpensesRoutes)
  .use(puppySettleRoutes)
  .use(puppyTitleRoutes)
  .use(puppyUsersRoutes)
  .use(puppySettingsRoutes);

export default puppyIndexRoutes;
