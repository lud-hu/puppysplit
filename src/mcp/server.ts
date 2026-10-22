import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import type * as queries from "../db/queries";
import { expensesToTransfers, settleTransfers } from "../util/settleExpenses";

export const configSchema = z.object({
  puppyId: z.string().trim().min(1),
  userId: z.number().int().positive().safe(),
});

export type McpConfig = z.infer<typeof configSchema>;
type PuppyQuery =
  "getPuppy" | "getPuppyUsers" | "getPuppyWithExpenses" | "createExpense";
export type PuppyStore = {
  [Name in PuppyQuery]: (
    ...args: Parameters<(typeof queries)[Name]>
  ) => Promise<Awaited<ReturnType<(typeof queries)[Name]>>>;
};

class ToolError extends Error {}

function result(data: Record<string, unknown>): CallToolResult {
  return {
    content: [{ type: "text", text: JSON.stringify(data) }],
    structuredContent: data,
  };
}

/** One immutable puppy and payer per connection; tool arguments cannot change either. */
export function createPuppyMcpServer(config: McpConfig, store: PuppyStore) {
  const { puppyId, userId } = configSchema.parse(config);
  const server = new McpServer({ name: "puppysplit", version: "1.0.0" });

  async function context() {
    const puppy = await store.getPuppy(puppyId);
    if (!puppy) throw new ToolError("Configured puppy was not found.");
    const users = await store.getPuppyUsers(puppyId);
    const payer = users.find((user) => user.id === userId);
    if (!payer)
      throw new ToolError("Configured user is not a member of this puppy.");
    return { puppy, users, payer };
  }

  async function run(
    action: () => Promise<CallToolResult>,
  ): Promise<CallToolResult> {
    try {
      return await action();
    } catch (error) {
      // Database errors may contain credentials or SQL. Keep them out of client results.
      return {
        isError: true,
        content: [
          {
            type: "text",
            text:
              error instanceof ToolError
                ? error.message
                : "PuppySplit could not complete the request.",
          },
        ],
      };
    }
  }

  const readOnly = {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: false,
  };
  server.registerTool(
    "get_puppy",
    {
      description:
        "Get the configured puppy, its members, and the user who will pay new expenses. Debts are called expenses in PuppySplit.",
      inputSchema: z.object({}).strict(),
      annotations: readOnly,
    },
    () =>
      run(async () => {
        const { puppy, users, payer } = await context();
        return result({
          puppy,
          users: users.map(({ id, name }) => ({ id, name })),
          payer: { id: payer.id, name: payer.name },
        });
      }),
  );

  async function expenses() {
    await context();
    const puppy = await store.getPuppyWithExpenses(puppyId);
    if (!puppy) throw new ToolError("Configured puppy was not found.");
    return puppy.expenses;
  }

  server.registerTool(
    "list_expenses",
    {
      description:
        "List the configured puppy's expenses, newest first, including payer and split participants.",
      inputSchema: z.object({}).strict(),
      annotations: readOnly,
    },
    () => run(async () => result({ expenses: await expenses() })),
  );

  server.registerTool(
    "get_settlement",
    {
      description:
        "Calculate suggested payments to settle the configured puppy using the app's existing settlement rules. Does not record payments or change expenses.",
      inputSchema: z.object({}).strict(),
      annotations: readOnly,
    },
    () =>
      run(async () =>
        result({
          transfers: settleTransfers(expensesToTransfers(await expenses())),
        }),
      ),
  );

  server.registerTool(
    "add_expense",
    {
      description:
        "Add an expense (debt) paid by the configured user in the configured puppy. Amount is the total in euros, not a per-person share. Participants split it equally; omit participantIds to split among all current members, including the payer. Does not create users or puppies.",
      inputSchema: z
        .object({
          title: z.string().trim().min(2),
          amount: z.number().finite().positive(),
          participantIds: z
            .array(z.number().int().positive().safe())
            .nonempty()
            .optional(),
        })
        .strict(),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    (input) =>
      run(async () => {
        const { users } = await context();
        const participantIds =
          input.participantIds ?? users.map((user) => user.id);
        if (new Set(participantIds).size !== participantIds.length) {
          throw new ToolError("Participant IDs must be unique.");
        }
        if (
          participantIds.some((id) => !users.some((user) => user.id === id))
        ) {
          throw new ToolError(
            "Every participant must belong to the configured puppy.",
          );
        }
        const expense = await store.createExpense({
          puppyId,
          payerId: userId,
          title: input.title,
          amount: input.amount,
          participantIds,
        });
        return result({ expense, participantIds });
      }),
  );

  return server;
}
