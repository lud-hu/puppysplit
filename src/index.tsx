import { html } from "@elysiajs/html";
import { Elysia, t } from "elysia";
import * as elements from "typed-html";
import DebtListEntry from "./components/DebtListEntry";
import PuppyDetails from "./components/PuppyDetails";
import PuppyItem from "./components/PuppyItem";
import PuppyList from "./components/PuppyList";
import { db } from "./db";
import { creditorsToDebts, debts, puppies, users } from "./db/schema";
import { settleDebts, unifyDebts } from "./util/settleDebts";
import BaseHtml from "./components/BaseHtml";

const app = new Elysia()
  .use(html())
  // TODO: Fix elysia html typings
  .get("/", async ({ html }: any) => {
    const data = await db.select().from(puppies).all();
    return html(
      <BaseHtml>
        <PuppyList puppies={data} />
      </BaseHtml>
    );
  })
  .get(
    "/puppies/:id",
    async ({ params, set }) => {
      const data = await db.query.puppies.findFirst({
        where: (puppies, { eq }) => eq(puppies.id, params.id),
        with: {
          debts: {
            with: {
              debtor: true,
              // puppies: true,
              creditorsToDebts: {
                with: {
                  user: true,
                },
              },
            },
          },
        },
      });

      if (!data) {
        return <div>Not found</div>;
      }

      const debts =
        data?.debts.map((debt) => ({
          ...debt,
          creditorsToDebts: undefined,
          debtorId: undefined,
          debtor: debt.debtor.name,
          creditors: debt.creditorsToDebts.map((c) => c.user.name),
        })) || [];

      const users = await db.query.users.findMany({
        where: (users, { eq }) => eq(users.puppyId, params.id),
      });

      if (data) {
        // set.headers["HX-Push-Url"] = `/puppies/${params.id}`;
        return (
          <BaseHtml>
            <PuppyDetails
              debts={debts}
              id={data.id}
              title={data.title}
              settleDebts={settleDebts(unifyDebts(debts))}
              users={users}
            />
          </BaseHtml>
        );
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .post(
    "/puppies",
    async ({ body, set }) => {
      const newPuppy = await db.insert(puppies).values(body).returning().get();
      return <PuppyItem {...newPuppy} />;
    },
    {
      body: t.Object({
        title: t.String({ minLength: 1 }),
      }),
    }
  )
  // Add a list of users to a puppy
  .post(
    "/puppies/:id/users",
    async ({ body, set, params }) => {
      const newPuppy = await db
        .insert(users)
        .values(body.names.map((e) => ({ name: e, puppyId: params.id })))
        .returning()
        .get();
      return <div>jo</div>;
    },
    {
      body: t.Object({
        names: t.Array(t.String({ minLength: 2 })),
      }),
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  // Add a debt to a puppy
  .post(
    "/puppies/:id/debts",
    async ({ body, params }) => {
      const newDebt = await db
        .insert(debts)
        .values({
          amount: parseInt(body.amount),
          debtorId: parseInt(body.debtorId),
          puppyId: params.id,
          title: body.title,
        })
        .returning()
        .get();

      await db.insert(creditorsToDebts).values(
        body.creditorIds.map((c) => ({
          debtId: newDebt.id,
          userId: parseInt(c),
        }))
      );

      const users = await db.query.users.findMany({
        where: (users, { eq }) => eq(users.puppyId, params.id),
      });

      return (
        <DebtListEntry
          debt={{
            debtor: users.find((u) => u.id === newDebt.debtorId)?.name || "",
            creditors: users
              .filter((u) => body.creditorIds.includes(u.id.toString()))
              .map((u) => u.name),
            amount: newDebt.amount,
            title: newDebt.title,
            creditorsToDebts: undefined,
            debtorId: undefined,
            id: newDebt.id,
          }}
        />
      );
    },
    {
      body: t.Object({
        title: t.String({ minLength: 2 }),
        // TODO: How to accept number here directly?
        amount: t.String(),
        debtorId: t.String(),
        creditorIds: t.Array(t.String(), { minLength: 1 }),
      }),
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .get("/styles.css", () => Bun.file("./tailwind-gen/styles.css"))
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
