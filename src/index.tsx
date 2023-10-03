import { html } from "@elysiajs/html";
import { Elysia } from "elysia";
import routes from "./routes";

const app = new Elysia()
  .use(html())
  .use(routes)
  .listen(3000)
  .onError((err) => {
    console.trace(err);
  });

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
