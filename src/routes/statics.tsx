import { Elysia } from "elysia";

const staticRoutes = new Elysia()
  .get("/styles.css", () => Bun.file("./tailwind-gen/styles.css"))
  .get("/debtorSelectionPersistor.js", () =>
    Bun.file("./src/debtorSelectionPersistor.js")
  )
  .get("/amountInput.js", () => Bun.file("./src/amountInput.js"));

export default staticRoutes;
