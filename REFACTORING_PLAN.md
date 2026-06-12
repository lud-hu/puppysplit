# Puppysplit Refactoring Plan

## Context

Puppysplit is a small BETH-stack (Bun + Elysia + Turso + HTMX) expense-splitting app that grew out of a proof of concept. The code works and has a green test suite (9 tests), but carries PoC debt: copy-pasted DB queries across routes, an inverted domain vocabulary ("debtor" actually means the person who _paid_), hand-written types that should be inferred, dead code, repeated Tailwind class strings, an unmaintained JSX renderer (typed-html) that doesn't escape user input (XSS), and several outdated packages (Tailwind 3.3, Dockerfile pinned to Bun 0.6.14).

Goal: well-scoped, understandable components; DRY/KISS; unit tests for critical business logic; sensible package upgrades.

Decisions made: **Tailwind 4.x**, **migrate typed-html → @kitajs/html**, **rename domain naming in code AND DB schema** (with migration).

## Phase 0 — Baseline & hygiene

- Untrack `.DS_Store` (`git rm --cached`), add it to `.gitignore`.
- Delete `package-lock.json` (bun.lockb is the lockfile) and the unused `src/components/PuppyItem.tsx`.
- Add a `typecheck` script: `"typecheck": "tsc --noEmit"` and make sure it passes before refactoring (fix the existing implicit-`any`s as part of later phases).

## Phase 1 — Package & toolchain updates

Already current (no change): `elysia` 1.4.28, `@elysiajs/html` 1.4.2, `drizzle-orm` 0.45.2, `drizzle-kit` 0.31.10, `@libsql/client` 0.17.3, `@sinclair/typebox`.

- `bun-types` → 1.3.14; `concurrently` → ^10; `@flydotio/dockerfile` → latest.
- `Dockerfile`: `BUN_VERSION` 0.6.14 → current 1.2.x (match local `bun --version`).
- **Tailwind 3.3.3 → 4.x**: run `bunx @tailwindcss/upgrade`. Expect: `tailwind.config.js` removed, `src/styles.css` becomes `@import "tailwindcss"`, the custom `not-last` plugin becomes `@custom-variant not-last (&:not(:last-child));` in CSS, and the `tw`/`tw:dev` scripts switch to `@tailwindcss/cli`. Verify `not-last:border-b-2` still generates.
- **typed-html → @kitajs/html** (Phase 3).

## Phase 2 — Data layer extraction (DRY the queries)

The identical `puppies.findFirst({ with: debts… })` + `transformDebts` + `users.findMany` block is copy-pasted in `src/routes/puppies/byId/index.tsx`, `byId/debts.tsx`, and `byId/settle.tsx`.

- New `src/db/queries.ts`: `getPuppyWithExpenses(id)`, `getPuppyUsers(id)`, `createExpense(...)`, `deleteExpense(id)`, `deletePuppyCascade(id)` (move the transaction from `byId/index.tsx`).
- Replace `src/util/transformDebts.ts`'s hand-written input type with drizzle-inferred types; fold the transform into the query module. Remove the `creditorsToDebts: undefined` hack — map to a clean domain type instead.

## Phase 3 — Migrate typed-html → @kitajs/html

- `bun remove typed-html`, `bun add @kitajs/html @kitajs/ts-html-plugin`.
- `tsconfig.json`: `"jsx": "react-jsx"`, `"jsxImportSource": "@kitajs/html"`, register `@kitajs/ts-html-plugin` in `plugins`; drop `jsxFactory` and the `import * as elements from "typed-html"` line in every component/route. Delete `types.d.ts` if the `_` hyperscript attribute is no longer needed (grep first; nothing currently uses `_=`).
- `BaseHtml.tsx`: rewrite as a JSX component that prepends `<!doctype html>`; @kitajs/html handles child arrays natively.
- XSS fix: mark every element that renders user-entered data (puppy title, user names, expense titles, paypal handle) with the `safe` attribute, and add the plugin's `xss-scan` to the `typecheck`/`test` script so unescaped interpolation fails CI.

## Phase 4 — Domain rename + DB migration

Current naming is inverted: `debts.debtorId` is the person who **paid**; `creditors_to_debts` holds the people who **owe** a share. Rename to plain language:

- Schema (`src/db/schema.ts`): `debts` → `expenses` (table) with `payerId`; `creditors_to_debts` → `expense_participants` (`user_id`, `expense_id`). Types: `Expense`, `User`, `Puppy`.
- Switch from `drizzle-kit push` to migrations: scripts `db:generate` / `db:migrate`, generate a migration using SQLite `ALTER TABLE … RENAME TO` / `RENAME COLUMN` (verify drizzle-kit emits renames, not drop+create — answer its interactive rename prompts, or hand-write the SQL migration).
- Domain types in `src/types.ts`: `Expense { payer, participants, amount, title, date, … }` (replaces `MyDebt`, currently exported from the `PuppyDetails` component); settlement result becomes `Transfer { from, to, amount }` (replaces `SingleDebt`).
- `src/util/settleDebts.ts` → `settleExpenses.ts` (or keep filename, rename symbols): `unifyDebts` → `explodeToPairwiseDebts`, output `Transfer`s. Two real bug fixes while renaming:
  - Key `balanceMap`/`userMap` by **user id**, not name (duplicate names currently corrupt settlement).
  - In `unifyDebts`, exclude the payer by **id** (`c.id !== debt.payerId`), not name.
- Update tests to the new names; expected amounts must stay identical (semantics unchanged apart from the duplicate-name fix — add a test for two users with the same name).
- Settlement UI text becomes the readable `"{from.name} sends {amount}€ to {to.name}"`; PayPal link uses `to`'s handle.
- **Prod migration**: back up the Turso DB (`turso db shell <db> .dump`) before running `db:migrate` against it. Local dev DB is a throwaway file.

## Phase 5 — Business logic extraction + tests

- Extract the `getCreditorIds` closure from the POST handler in `src/routes/puppies/byId/debts.tsx` into `src/util/resolveParticipants.ts`: `resolveParticipantIds(splitSetting, participantIds, users)`. Unit-test: betweenAll, subset array, single string, empty/invalid → error.
- Replace manual `parseFloat` validation with the Elysia schema: `amount: t.Numeric({ exclusiveMinimum: 0 })` (the hidden input posts `"12.34"`, which `t.Numeric` coerces) — resolves the existing TODO.
- Unit tests for the query-layer transform (ex-`transformDebts`).
- `settleDebts`/`getPuppyIcon` tests already exist; keep them green throughout.

## Phase 6 — Route & component cleanup (KISS)

Routes (`src/routes/**`):

- Remove the dead double-check pattern (`if (!data) return …; if (data) { … }`), unused imports (`puppies` in `routes/index.tsx`, unused `set`/`body` params), commented-out code, and the leftover `console.log` validation handler in `debts.tsx`.
- Drop the `({ html }: any)` wrapper in `routes/index.tsx` — with `@elysiajs/html` registered, returning the JSX string is enough; no `any`.
- Proper 404: shared `<NotFound />` page inside `BaseHtml` + `set.status = 404` instead of bare `<div>Not found</div>` with 200.
- Central `onError` in `src/index.tsx`: log and return a friendly error page (typed ctx, no `any`).

Components (`src/components/**`):

- New `src/components/ui.tsx` primitives to DRY the repeated class strings: `Button` (the `bg-blue-500 hover:bg-blue-700 …` string appears 8×), `LinkButton`, `SectionHeading` (h2 string appears 6×), `IconButton` (gray square buttons in headers).
- Merge `PuppyHeader.tsx` and `PuppySettingsHeader.tsx` into one `PuppyHeader` — they differ only in the right-side action (settings link vs. title-edit button); pass that as a prop/slot. Member-list rendering simplifies to `users.map(u => u.name).join(", ")` (also reused in `DebtListEntry`).
- Move `MyDebt` out of `PuppyDetails.tsx` (done in Phase 4 via `src/types.ts`).

## Verification

1. `bun test` — all tests green after every phase (settle math expectations unchanged).
2. `bun run typecheck` — tsc + `xss-scan` clean.
3. `bun run tw` — Tailwind 4 build succeeds; spot-check `tailwind-gen/styles.css` contains the `not-last` variant.
4. `bun run db:migrate` against the local file DB, then `bun run db:seed` and manual smoke test via `bun run dev`:
   create puppy → rename title → add 3 members (one with PayPal handle) → add expense split between all → add expense split between subset → "Show All" expenses page → settle page shows correct transfers + PayPal link → mark settled → delete expense → delete member → delete puppy.
5. Optional: `docker build .` to confirm the Bun 1.2 image builds.

## Suggested commit sequence

One commit per phase (0–6), so package bumps, the Tailwind 4 migration, the JSX migration, and the schema rename are each individually revertable.
