import { Elysia, t } from "elysia";
import * as elements from "typed-html";
import BaseHtml from "../../../components/BaseHtml";
import PuppySettings from "../../../components/PuppySettings";
import { db } from "../../../db";

const puppiesByIndexSettingsRoutes = new Elysia().get(
  "/puppies/:id/settings",
  async ({ params, set }) => {
    const data = await db.query.puppies.findFirst({
      where: (puppies, { eq }) => eq(puppies.id, params.id),
    });

    if (!data) {
      return <div>Not found</div>;
    }

    const users = await db.query.users.findMany({
      where: (users, { eq }) => eq(users.puppyId, params.id),
    });

    if (data) {
      return (
        <BaseHtml pageTitle={data.title + " - Einstellungen - Puppysplit"}>
          <PuppySettings puppyId={data.id} title={data.title} users={users} />
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
export default puppiesByIndexSettingsRoutes;
