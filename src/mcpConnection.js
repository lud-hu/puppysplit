(() => {
  const section = document.getElementById("mcp-connection");
  const payer = section.querySelector("#mcp-payer");
  const urlInput = section.querySelector("#mcp-url");
  const configInput = section.querySelector("#mcp-config");
  const status = section.querySelector("[data-mcp-status]");
  const formPayer = document.querySelector('[name="payerId"]');
  let initialPayer = formPayer?.value;
  try {
    initialPayer = localStorage.getItem("puppy" + section.dataset.puppyId) || initialPayer;
  } catch {
    // The selector still works when browser storage is unavailable.
  }
  if ([...payer.options].some((option) => option.value === initialPayer)) {
    payer.value = initialPayer;
  }

  function update() {
    const url = new URL("/mcp", window.location.origin);
    url.searchParams.set("puppyId", section.dataset.puppyId);
    url.searchParams.set("userId", payer.value);
    urlInput.value = url.href;
    configInput.value = JSON.stringify({ mcpServers: { puppysplit: { url: url.href } } }, null, 2);
    status.textContent = "";
  }

  payer.addEventListener("change", update);
  section.querySelectorAll("[data-mcp-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const field = button.dataset.mcpCopy === "url" ? urlInput : configInput;
      const value = field.value;
      try {
        await navigator.clipboard.writeText(value);
        status.textContent = field === urlInput ? "MCP link copied." : "MCP config copied.";
      } catch {
        field.focus();
        field.select();
        status.textContent = "Copy the selected text using your browser's copy command.";
      }
    });
  });
  update();
})();
