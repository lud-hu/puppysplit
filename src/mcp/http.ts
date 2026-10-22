import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { Elysia } from "elysia";
import { configSchema, createPuppyMcpServer, type PuppyStore } from "./server";

/** The full connection URL is a capability, like the app's existing puppy links. */
export function createMcpRoutes(store: PuppyStore) {
  return new Elysia().all(
    "/mcp",
    async ({ request }) => {
      const url = new URL(request.url);
      const origin = request.headers.get("origin");
      if (origin) {
        try {
          const parsedOrigin = new URL(origin);
          if (
            parsedOrigin.host !== url.host ||
            !["https:", "http:"].includes(parsedOrigin.protocol)
          ) {
            return new Response("Origin is not allowed.", { status: 403 });
          }
        } catch {
          return new Response("Origin is not allowed.", { status: 403 });
        }
      }
      if (request.method !== "POST") {
        return new Response(null, { status: 405, headers: { Allow: "POST" } });
      }

      const rawUserId = url.searchParams.get("userId") ?? "";
      const config = configSchema.safeParse({
        puppyId: url.searchParams.get("puppyId"),
        userId: /^[1-9]\d*$/.test(rawUserId) ? Number(rawUserId) : NaN,
      });
      if (
        !config.success ||
        url.searchParams.getAll("puppyId").length !== 1 ||
        url.searchParams.getAll("userId").length !== 1
      ) {
        return Response.json(
          {
            error:
              "Configure puppyId and a positive integer userId in the MCP connection URL.",
          },
          { status: 400 },
        );
      }

      // Stateless requests keep configuration isolated and survive Fly restarts.
      const server = createPuppyMcpServer(config.data, store);
      const transport = new WebStandardStreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true,
        maxRequestBodySize: 64 * 1024,
      });
      try {
        await server.connect(transport);
        const response = await transport.handleRequest(request);
        response.headers.set("Cache-Control", "no-store");
        return response;
      } finally {
        await server.close();
      }
    },
    { parse: "none" },
  );
}
