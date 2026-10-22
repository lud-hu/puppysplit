import { afterEach, describe, expect, test } from "bun:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { createMcpRoutes } from "./http";
import type { PuppyStore } from "./server";

const clients: Client[] = [];
afterEach(async () => {
  await Promise.all(clients.splice(0).map((client) => client.close()));
});

function fixture() {
  const members = [
    { id: 1, name: "Alice", puppyId: "puppy-a", payPalHandle: null },
    { id: 2, name: "Bob", puppyId: "puppy-a", payPalHandle: null },
    { id: 3, name: "Carol", puppyId: "puppy-b", payPalHandle: null },
  ];
  const puppies = [
    { id: "puppy-a", title: "Trip A" },
    { id: "puppy-b", title: "Trip B" },
  ];
  const writes: Parameters<PuppyStore["createExpense"]>[0][] = [];
  const store: PuppyStore = {
    getPuppy: async (id) => puppies.find((puppy) => puppy.id === id),
    getPuppyUsers: async (id) => members.filter((user) => user.puppyId === id),
    getPuppyWithExpenses: async (id) => {
      const puppy = puppies.find((puppy) => puppy.id === id);
      if (!puppy) return null;
      return {
        ...puppy,
        expenses: writes
          .filter((expense) => expense.puppyId === id)
          .map((expense, i) => ({
            id: i + 1,
            title: expense.title,
            amount: expense.amount,
            payerId: expense.payerId,
            payer: members.find((user) => user.id === expense.payerId)!.name,
            participants: expense.participantIds.map((id) => ({
              id,
              name: members.find((user) => user.id === id)!.name,
            })),
          })),
      };
    },
    createExpense: async (input) => {
      writes.push(input);
      return { id: writes.length, date: new Date(), ...input };
    },
  };
  const app = createMcpRoutes(store);
  async function connect(puppyId = "puppy-a", userId = "1") {
    const client = new Client({ name: "test-client", version: "1.0.0" });
    clients.push(client);
    await client.connect(
      new StreamableHTTPClientTransport(
        new URL(`http://localhost/mcp?puppyId=${puppyId}&userId=${userId}`),
        { fetch: (input, init) => app.handle(new Request(input, init)) },
      ),
    );
    return client;
  }
  return { app, connect, writes, members, store };
}

async function call(
  client: Client,
  name: string,
  args: Record<string, unknown> = {},
) {
  return (await client.callTool({ name, arguments: args })) as CallToolResult;
}

function data(response: CallToolResult) {
  return response.structuredContent as any;
}

describe("PuppySplit MCP over Streamable HTTP", () => {
  test("negotiates MCP and exposes only the permitted tools", async () => {
    const { connect } = fixture();
    const client = await connect();
    const { tools } = await client.listTools();
    expect(tools.map((tool) => tool.name).sort()).toEqual([
      "add_expense",
      "get_puppy",
      "get_settlement",
      "list_expenses",
    ]);
    expect(
      tools.find((tool) => tool.name === "add_expense")!.annotations
        ?.idempotentHint,
    ).toBe(false);
    const details = data(await call(client, "get_puppy"));
    expect(details.puppy.id).toBe("puppy-a");
    expect(details.payer).toEqual({ id: 1, name: "Alice" });
    expect(details.users).toEqual([
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ]);
    expect((await call(client, "delete_expense", { id: 1 })).isError).toBe(
      true,
    );
  });

  test("creates with the configured payer, defaults to all current members, and calculates settlement", async () => {
    const { connect, writes } = fixture();
    const client = await connect();
    expect(
      (await call(client, "add_expense", { title: " Dinner ", amount: 30 }))
        .isError,
    ).not.toBe(true);
    expect(writes).toEqual([
      {
        puppyId: "puppy-a",
        payerId: 1,
        title: "Dinner",
        amount: 30,
        participantIds: [1, 2],
      },
    ]);
    expect(data(await call(client, "list_expenses")).expenses).toHaveLength(1);
    expect(data(await call(client, "get_settlement")).transfers).toEqual([
      { fromId: 2, from: "Bob", toId: 1, to: "Alice", amount: 15 },
    ]);
    expect(
      (
        await call(client, "add_expense", {
          title: "Ticket",
          amount: 10,
          participantIds: [2],
        })
      ).isError,
    ).not.toBe(true);
    expect(writes[1].participantIds).toEqual([2]);
  });

  test("rejects invalid data and attempts to override connection scope without writing", async () => {
    const { connect, writes } = fixture();
    const client = await connect();
    for (const invalid of [
      { amount: 0 },
      { amount: -1 },
      { amount: "12" },
      { title: " " },
      { participantIds: [] },
      { participantIds: [2, 2] },
      { participantIds: [3] },
      { participantIds: [999] },
      { participantIds: [1.5] },
      { payerId: 2 },
      { userId: 2 },
      { puppyId: "puppy-b" },
    ]) {
      const response = await call(client, "add_expense", {
        title: "Lunch",
        amount: 12,
        ...invalid,
      });
      expect(response.isError).toBe(true);
    }
    expect(writes).toHaveLength(0);
  });

  test("isolates clients for different puppies and payers", async () => {
    const { connect, writes } = fixture();
    const [a, b] = await Promise.all([connect(), connect("puppy-b", "3")]);
    await Promise.all([
      call(a, "add_expense", { title: "Trip A", amount: 20 }),
      call(b, "add_expense", { title: "Trip B", amount: 9 }),
    ]);
    expect(
      writes.find((expense) => expense.puppyId === "puppy-b")!.payerId,
    ).toBe(3);
    expect(
      data(await call(a, "list_expenses")).expenses.map(
        (expense: any) => expense.title,
      ),
    ).toEqual(["Trip A"]);
    expect(
      data(await call(b, "list_expenses")).expenses.map(
        (expense: any) => expense.title,
      ),
    ).toEqual(["Trip B"]);
  });

  test("checks puppy and payer membership for every operation", async () => {
    const { connect, writes, members } = fixture();
    const client = await connect();
    members.splice(0, 1);
    for (const name of [
      "get_puppy",
      "list_expenses",
      "get_settlement",
      "add_expense",
    ]) {
      expect(
        (
          await call(
            client,
            name,
            name === "add_expense" ? { title: "Lunch", amount: 12 } : {},
          )
        ).isError,
      ).toBe(true);
    }
    const wrongUser = await connect("puppy-a", "3");
    const missingPuppy = await connect("missing", "1");
    expect((await call(wrongUser, "get_puppy")).isError).toBe(true);
    expect((await call(missingPuppy, "get_puppy")).isError).toBe(true);
    expect(writes).toHaveLength(0);
  });

  test("keeps database errors out of MCP results", async () => {
    const { connect, store } = fixture();
    const client = await connect();
    store.getPuppy = async () => {
      throw new Error("private SQL and credentials");
    };
    const response = await call(client, "get_puppy");
    expect(response.isError).toBe(true);
    expect(response.content).toEqual([
      { type: "text", text: "PuppySplit could not complete the request." },
    ]);
  });

  test("validates URL configuration, Origin, and HTTP methods", async () => {
    const { app } = fixture();
    for (const query of [
      "",
      "?puppyId=puppy-a",
      "?puppyId=puppy-a&userId=0",
      "?puppyId=puppy-a&userId=1.5",
      "?puppyId=puppy-a&userId=1&userId=2",
      "?puppyId=puppy-a&userId=9007199254740992",
    ]) {
      expect(
        (
          await app.handle(
            new Request(`http://localhost/mcp${query}`, { method: "POST" }),
          )
        ).status,
      ).toBe(400);
    }
    for (const origin of ["https://evil.example", "null", "not-a-url"]) {
      expect(
        (
          await app.handle(
            new Request("http://localhost/mcp?puppyId=puppy-a&userId=1", {
              method: "POST",
              headers: { Origin: origin },
            }),
          )
        ).status,
      ).toBe(403);
    }
    for (const method of ["GET", "DELETE", "PUT"]) {
      expect(
        (await app.handle(new Request("http://localhost/mcp", { method })))
          .status,
      ).toBe(405);
    }
  });
});
