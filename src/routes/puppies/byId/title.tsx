import { Elysia, t } from "elysia";
import PuppySettingsHeader from "../../../components/PuppySettingsHeader";
import TitleEditForm from "../../../components/TitleEditForm";
import { getPuppy, updatePuppyTitle } from "../../../db/queries";

const puppiesByIndexTitleRoutes = new Elysia()
  .get(
    "/puppies/:id/titleEdit",
    async ({ params }) => {
      const puppy = await getPuppy(params.id);

      if (!puppy) {
        return <div>Not found</div>;
      }

      return <TitleEditForm puppyId={params.id} title={puppy.title} />;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .put(
    "/puppies/:id/title",
    async ({ body, params }) => {
      await updatePuppyTitle(params.id, body.title);

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
    async ({ params }) => {
      const puppy = await getPuppy(params.id);

      if (!puppy) {
        return <div>Not found</div>;
      }

      return (
        <PuppySettingsHeader
          title={puppy.title}
          backLink={`/puppies/${puppy.id}`}
          puppyId={puppy.id}
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
