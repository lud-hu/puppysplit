import { Elysia } from "elysia";
import * as elements from "typed-html";
import BaseHtml from "../components/BaseHtml";
import PuppyLandingPage from "../components/PuppyLandingPage";
import { db } from "../db";
import { puppies } from "../db/schema";
import puppiesRoutes from "./puppies";
import staticRoutes from "./statics";

const routes = new Elysia()
  .get("/", async ({ html }: any) => {
    const data = await db.select().from(puppies).all();
    return html(
      <BaseHtml>
        <PuppyLandingPage />
      </BaseHtml>
    );
  })
  .use(puppiesRoutes)
  .use(staticRoutes);

export default routes;
