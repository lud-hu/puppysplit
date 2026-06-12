import { html } from "@elysiajs/html";
import { Elysia } from "elysia";
import routes from "./routes";

const app = new Elysia()
  .use(html())
  .use(routes)
  .onError((ctx: any) => {
    console.trace(ctx.error);
  })
  .listen({ port: 3000, hostname: "0.0.0.0" });

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
