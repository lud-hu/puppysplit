import { Elysia } from "elysia";

const staticRoutes = new Elysia()
  .get("/styles.css", () => Bun.file("./tailwind-gen/styles.css"))
  .get("/payerSelectionPersistor.js", () =>
    Bun.file("./src/payerSelectionPersistor.js")
  )
  .get("/amountInput.js", () => Bun.file("./src/amountInput.js"))
  .get("/mcpConnection.js", () => Bun.file("./src/mcpConnection.js"))
  .get("/expenseForm.js", () => Bun.file("./src/expenseForm.js"));

export default staticRoutes;
