import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const script = readFileSync(new URL("./mcpConnection.js", import.meta.url), "utf8");

function fixture({ denied = false, storageBlocked = false } = {}) {
  const listeners: Record<string, () => unknown> = {};
  let focused = false;
  let selected = false;
  const copied: string[] = [];
  const payer = {
    options: [{ value: "1" }, { value: "2" }], value: "1",
    addEventListener: (name: string, callback: () => unknown) => { listeners[name] = callback; },
  };
  const input = {
    value: "", focus: () => { focused = true; }, select: () => { selected = true; },
  };
  const status = { textContent: "" };
  const section = {
    dataset: { puppyId: "trip" },
    querySelector: (selector: string) => {
      if (selector === "#mcp-payer") return payer;
      if (selector === "#mcp-url") return input;
      if (selector === "[data-mcp-status]") return status;
      throw new Error(`Unexpected element: ${selector}`);
    },
    querySelectorAll: () => [{ addEventListener: (name: string, callback: () => unknown) => { listeners[name] = callback; } }],
  };
  runInNewContext(script, {
    URL, document: { getElementById: () => section, querySelector: () => ({ value: "1" }) },
    window: { location: { origin: "https://example.test" } },
    localStorage: { getItem: () => { if (storageBlocked) throw new Error("denied"); return "2"; } },
    navigator: { clipboard: { writeText: async (value: string) => { if (denied) throw new Error("denied"); copied.push(value); } } },
  });
  return { payer, input, status, listeners, copied, focused: () => focused, selected: () => selected };
}

test("initializes and copies only the URL without a JSON config element", async () => {
  const f = fixture();
  expect(f.input.value).toBe("https://example.test/mcp?puppyId=trip&userId=2");
  await f.listeners.click();
  expect(f.copied).toEqual([f.input.value]);
  expect(f.status.textContent).toBe("MCP link copied.");
  f.payer.value = "1";
  f.listeners.change();
  expect(f.input.value).toBe("https://example.test/mcp?puppyId=trip&userId=1");
  expect(f.status.textContent).toBe("");
});

test("keeps manual copy fallback and works without browser storage", async () => {
  const f = fixture({ denied: true, storageBlocked: true });
  expect(f.input.value).toBe("https://example.test/mcp?puppyId=trip&userId=1");
  await f.listeners.click();
  expect(f.focused()).toBe(true);
  expect(f.selected()).toBe(true);
  expect(f.status.textContent).toContain("Copy the selected text");
});
