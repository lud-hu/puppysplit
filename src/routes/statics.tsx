import { Elysia } from "elysia";

const staticRoutes = new Elysia()
  .get("/styles.css", () => Bun.file("./tailwind-gen/styles.css"))
  .get("/payerSelectionPersistor.js", () =>
    Bun.file("./src/payerSelectionPersistor.js")
  )
  .get("/amountInput.js", () => Bun.file("./src/amountInput.js"));

export default staticRoutes;
