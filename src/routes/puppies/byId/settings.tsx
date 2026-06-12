import { Elysia, t } from "elysia";
import BaseHtml from "../../../components/BaseHtml";
import NotFoundPage from "../../../components/NotFoundPage";
import PuppySettings from "../../../components/PuppySettings";
import { getPuppy, getPuppyUsers } from "../../../db/queries";

const puppySettingsRoutes = new Elysia().get(
  "/puppies/:id/settings",
  async ({ params, set }) => {
    const puppy = await getPuppy(params.id);

    if (!puppy) {
      set.status = 404;
      return <NotFoundPage />;
    }

    const users = await getPuppyUsers(params.id);

    return (
      <BaseHtml pageTitle={puppy.title + " - Einstellungen - Puppysplit"}>
        <PuppySettings puppyId={puppy.id} title={puppy.title} users={users} />
      </BaseHtml>
    );
  },
  {
    params: t.Object({
      id: t.String(),
    }),
  }
);

export default puppySettingsRoutes;
