import { Elysia } from "elysia";
import BaseHtml from "../components/BaseHtml";
import PuppyLandingPage from "../components/PuppyLandingPage";
import puppiesRoutes from "./puppies";
import staticRoutes from "./statics";

const routes = new Elysia()
  .get("/", () => (
    <BaseHtml>
      <PuppyLandingPage />
    </BaseHtml>
  ))
  .use(puppiesRoutes)
  .use(staticRoutes);

export default routes;
