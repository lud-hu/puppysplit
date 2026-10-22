import type { User } from "../db/schema";
import { Button, SectionHeading } from "./ui";

export default function McpConnection({
  puppyId,
  users,
}: {
  puppyId: string;
  users: User[];
}) {
  return (
    <details id="mcp-connection" data-puppy-id={puppyId}>
      <summary class="cursor-pointer text-xl p-4 font-bold text-gray-700">
        Advanced
      </summary>
      <SectionHeading>Connect with MCP</SectionHeading>
      {users.length === 0 ? (
        <p class="p-4 bg-gray-100">
          Add a member to get a configured MCP connection.
        </p>
      ) : (
        <div class="flex flex-col gap-4 p-4 bg-gray-100">
          <label for="mcp-payer">Expenses paid by</label>
          <select id="mcp-payer" class="bg-white border rounded p-3">
            {users.map((user) => (
              <option value={user.id.toString()} safe>{user.name}</option>
            ))}
          </select>
          <label for="mcp-url">MCP URL</label>
          <input id="mcp-url" readonly class="bg-white border rounded p-3 w-full" />
          <Button type="button" data-mcp-copy="url">
            Copy MCP link
          </Button>
          <p data-mcp-status role="status" aria-live="polite"></p>
          <p class="text-sm">
            Keep this link private. Anyone with it can access this puppy and add
            expenses as the selected payer.
          </p>
          <script src="/mcpConnection.js" defer />
        </div>
      )}
    </details>
  );
}
