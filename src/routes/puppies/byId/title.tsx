import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import * as elements from "typed-html";
import PuppySettingsHeader from "../../../components/PuppySettingsHeader";
import TitleEditForm from "../../../components/TitleEditForm";
import { db } from "../../../db";
import { puppies } from "../../../db/schema";

const puppiesByIndexTitleRoutes = new Elysia()
  .get(
    "/puppies/:id/titleEdit",
    async ({ params, set }) => {
      const data = await db.query.puppies.findFirst({
        where: (puppies, { eq }) => eq(puppies.id, params.id),
      });

      if (!data) {
        return <div>Not found</div>;
      }

      if (data) {
        return <TitleEditForm puppyId={params.id} title={data.title} />;
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .put(
    "/puppies/:id/title",
    async ({ body, set, params }) => {
      await db
        .update(puppies)
        .set({ title: body.title })
        .where(eq(puppies.id, params.id));

      return (
        <PuppySettingsHeader
          title={body.title}
          backLink={`/puppies/${params.id}`}
          puppyId={params.id}
        />
      );
    },
    {
      body: t.Object({
        title: t.String({ minLength: 1 }),
      }),
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .get(
    "/puppies/:id/title",
    async ({ body, set, params }) => {
      const data = await db.query.puppies.findFirst({
        where: (puppies, { eq }) => eq(puppies.id, params.id),
      });

      if (!data) {
        return <div>Not found</div>;
      }

      return (
        <PuppySettingsHeader
          title={data.title}
          backLink={`/puppies/${data.id}`}
          puppyId={data.id}
        />
      );
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  );

export default puppiesByIndexTitleRoutes;
