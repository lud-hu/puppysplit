import { expect, test } from "bun:test";
import McpConnection from "./McpConnection";

const users = [{ id: 1, name: "Alice", puppyId: "trip", payPalHandle: null }];

test("all MCP content is inside a closed Advanced disclosure, including the empty state", () => {
  for (const members of [users, []]) {
    const html = String(McpConnection({ puppyId: "trip", users: members }));
    expect(html).toMatch(/^<details\b[^>]*id="mcp-connection"[^>]*>/);
    expect(html.match(/^<details\b[^>]*>/)?.[0]).not.toMatch(/\bopen(?:\s|=|>)/);
    expect(html).toMatch(/<summary\b[^>]*>Advanced<\/summary>/);
    expect(html).toContain("Connect with MCP");
    expect(html).toEndWith("</details>");
    expect(html).not.toContain("mcp-config");
    expect(html).not.toContain("MCP client configuration");
    expect(html).not.toContain("Copy MCP config");
  }
});

test("keeps payer selection, the copyable URL, and the privacy warning", () => {
  const html = String(McpConnection({ puppyId: "trip", users }));
  expect(html).toContain('id="mcp-payer"');
  expect(html).toContain('id="mcp-url"');
  expect(html).toContain('data-mcp-copy="url"');
  expect(html).toContain("Keep this link private.");
  expect(html).not.toContain("<textarea");
});
