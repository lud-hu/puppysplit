import { Elysia, t } from "elysia";
import PuppyHeader from "../../../components/PuppyHeader";
import TitleEditForm from "../../../components/TitleEditForm";
import { getPuppy, updatePuppyTitle } from "../../../db/queries";

const puppyTitleRoutes = new Elysia()
  .get(
    "/puppies/:id/titleEdit",
    async ({ params, set }) => {
      const puppy = await getPuppy(params.id);

      if (!puppy) {
        set.status = 404;
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
        <PuppyHeader
          title={body.title}
          backLink={`/puppies/${params.id}`}
          puppyId={params.id}
          action="editTitle"
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
    async ({ params, set }) => {
      const puppy = await getPuppy(params.id);

      if (!puppy) {
        set.status = 404;
        return <div>Not found</div>;
      }

      return (
        <PuppyHeader
          title={puppy.title}
          backLink={`/puppies/${puppy.id}`}
          puppyId={puppy.id}
          action="editTitle"
        />
      );
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  );

export default puppyTitleRoutes;
