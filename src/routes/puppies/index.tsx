import { Elysia, t } from "elysia";
import { createPuppy } from "../../db/queries";
import puppyIndexRoutes from "./byId";

const routes = new Elysia()
  .post(
    "/puppies",
    async ({ body, set }) => {
      const newPuppy = await createPuppy(body.title);
      set.headers["HX-Redirect"] = `/puppies/${newPuppy.id}/settings`;
      return null;
    },
    {
      body: t.Object({
        title: t.String({ minLength: 1 }),
      }),
    }
  )
  .use(puppyIndexRoutes);

export default routes;
