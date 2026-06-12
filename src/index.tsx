import { html } from "@elysiajs/html";
import { Elysia } from "elysia";
import routes from "./routes";

const app = new Elysia()
  .use(html())
  .use(routes)
  .onError(({ code, error, set }) => {
    console.error(error);
    if (code === "VALIDATION") {
      // Keep Elysia's detailed 422 response
      return;
    }
    set.status = code === "NOT_FOUND" ? 404 : 500;
    return "Something went wrong. 🐶";
  })
  .listen({ port: 3000, hostname: "0.0.0.0" });

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
