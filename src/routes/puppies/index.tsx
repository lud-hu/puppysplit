import { Elysia, t } from "elysia";
import { db } from "../../db";
import { puppies } from "../../db/schema";
import puppyIndexRoutes from "./byId";

const routes = new Elysia()
  .post(
    "/puppies",
    async ({ body, set }) => {
      const newPuppy = await db
        .insert(puppies)
        .values({ ...body, id: crypto.randomUUID() })
        .returning()
        .get();
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

// instead of exporting route handlers, we create new elysia instance with routes and export it
export default routes;
