import { Elysia, t } from "elysia";
import BaseHtml from "../../../components/BaseHtml";
import PuppySettings from "../../../components/PuppySettings";
import { getPuppy, getPuppyUsers } from "../../../db/queries";

const puppiesByIndexSettingsRoutes = new Elysia().get(
  "/puppies/:id/settings",
  async ({ params }) => {
    const puppy = await getPuppy(params.id);

    if (!puppy) {
      return <div>Not found</div>;
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

export default puppiesByIndexSettingsRoutes;
