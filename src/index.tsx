import { html } from "@elysiajs/html";
import { desc, eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import * as elements from "typed-html";
import BaseHtml from "./components/BaseHtml";
import DebtList from "./components/DebtList";
import DebtListEntry from "./components/DebtListEntry";
import DebtSettlementList from "./components/DebtSettlementList";
import PuppyDetails, { MyDebt } from "./components/PuppyDetails";
import PuppyHeader from "./components/PuppyHeader";
import PuppyLandingPage from "./components/PuppyLandingPage";
import PuppySettings from "./components/PuppySettings";
import PuppySettingsHeader from "./components/PuppySettingsHeader";
import TitleEditForm from "./components/TitleEditForm";
import UsersListItem from "./components/UsersListItem";
import { db } from "./db";
import { creditorsToDebts, debts, puppies, users } from "./db/schema";
import { settleDebts, unifyDebts } from "./util/settleDebts";

const app = new Elysia()
  .use(html())
  // TODO: Fix elysia html typings
  .get("/", async ({ html }: any) => {
    const data = await db.select().from(puppies).all();
    return html(
      <BaseHtml>
        <PuppyLandingPage />
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
            orderBy: (debts) => [desc(debts.date)],
            with: {
              debtor: true,
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

      const debts = transformDebts(data.debts);

      const users = await db.query.users.findMany({
        where: (users, { eq }) => eq(users.puppyId, params.id),
      });

      if (data) {
        // set.headers["HX-Push-Url"] = `/puppies/${params.id}`;
        return (
          <BaseHtml pageTitle={data.title + " - Puppysplit"}>
            <PuppyDetails
              debts={debts}
              id={data.id}
              title={data.title}
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
  .get(
    "/puppies/:id/titleEdit",
    async ({ params, set }) => {
      const data = await db.query.puppies.findFirst({
        where: (puppies, { eq }) => eq(puppies.id, params.id),
      });

      if (!data) {
        return <div>Not found</div>;
      }

      if (data) {
        return <TitleEditForm puppyId={params.id} title={data.title} />;
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .put(
    "/puppies/:id/title",
    async ({ body, set, params }) => {
      await db
        .update(puppies)
        .set({ title: body.title })
        .where(eq(puppies.id, params.id));

      return (
        <PuppySettingsHeader
          title={body.title}
          backLink={`/puppies/${params.id}`}
          puppyId={params.id}
        />
      );
    },
    {
      body: t.Object({
        title: t.String({ minLength: 1 }),
      }),
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .get(
    "/puppies/:id/title",
    async ({ body, set, params }) => {
      const data = await db.query.puppies.findFirst({
        where: (puppies, { eq }) => eq(puppies.id, params.id),
      });

      if (!data) {
        return <div>Not found</div>;
      }

      return (
        <PuppySettingsHeader
          title={data.title}
          backLink={`/puppies/${data.id}`}
          puppyId={data.id}
        />
      );
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .get(
    "/puppies/:id/settings",
    async ({ params, set }) => {
      const data = await db.query.puppies.findFirst({
        where: (puppies, { eq }) => eq(puppies.id, params.id),
      });

      if (!data) {
        return <div>Not found</div>;
      }

      const users = await db.query.users.findMany({
        where: (users, { eq }) => eq(users.puppyId, params.id),
      });

      if (data) {
        return (
          <BaseHtml pageTitle={data.title + " - Einstellungen - Puppysplit"}>
            <PuppySettings id={data.id} title={data.title} users={users} />
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
  .get(
    "/puppies/:id/debts",
    async ({ params, set }) => {
      const data = await db.query.puppies.findFirst({
        where: (puppies, { eq }) => eq(puppies.id, params.id),
        with: {
          debts: {
            orderBy: (debts) => [desc(debts.date)],
            with: {
              debtor: true,
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

      const debts = transformDebts(data.debts);

      const users = await db.query.users.findMany({
        where: (users, { eq }) => eq(users.puppyId, params.id),
      });

      if (data) {
        return (
          <BaseHtml pageTitle={data.title + " - Puppysplit"}>
            <PuppyHeader
              puppyId={data.id}
              title={data.title}
              users={users}
              backLink={`/puppies/${data.id}`}
            />
            <DebtList
              debts={debts}
              users={users}
              puppyId={data.id}
              title="All Expenses"
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
  .get(
    "/puppies/:id/settle",
    async ({ params, set }) => {
      const data = await db.query.puppies.findFirst({
        where: (puppies, { eq }) => eq(puppies.id, params.id),
        with: {
          debts: {
            orderBy: (debts) => [desc(debts.date)],
            with: {
              debtor: true,
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

      const debts = transformDebts(data.debts);

      const users = await db.query.users.findMany({
        where: (users, { eq }) => eq(users.puppyId, params.id),
      });

      if (data) {
        return (
          <BaseHtml pageTitle={data.title + " - Puppysplit"}>
            <PuppyHeader
              title={data.title}
              users={users}
              backLink={`/puppies/${data.id}`}
            />
            <DebtSettlementList
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
      set.headers["HX-Redirect"] = `/puppies/${newPuppy.id}/settings`;
      return null;
    },
    {
      body: t.Object({
        title: t.String({ minLength: 1 }),
      }),
    }
  )
  // Add a user to a puppy
  .post(
    "/puppies/:id/users",
    async ({ body, params }) => {
      const user = await db
        .insert(users)
        .values({
          name: body.name,
          puppyId: params.id,
          payPalHandle: body.payPalHandle,
        })
        .returning()
        .get();
      return <UsersListItem puppyId={params.id} user={user} />;
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        payPalHandle: t.Optional(t.String()),
      }),
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  // Delete a user from a puppy
  .delete(
    "/puppies/:id/users/:userId",
    async ({ params }) => {
      await db.delete(users).where(eq(users.id, params.userId));
      // TODO: What to do with assigned debts?
      return null;
    },
    {
      params: t.Object({
        id: t.Numeric(),
        userId: t.Numeric(),
      }),
    }
  )
  // Add a debt to a puppy
  .delete(
    "/puppies/:id/debts/:debtId",
    async ({ params }) => {
      await db
        .delete(creditorsToDebts)
        .where(eq(creditorsToDebts.debtId, params.debtId));
      await db.delete(debts).where(eq(debts.id, params.debtId));

      return null;
    },
    {
      params: t.Object({
        id: t.Numeric(),
        debtId: t.Numeric(),
      }),
    }
  )
  .post(
    "/puppies/:id/debts",
    async ({ body, params }) => {
      const newDebt = await db
        .insert(debts)
        .values({
          amount: parseFloat(body.amount),
          debtorId: parseInt(body.debtorId),
          puppyId: params.id,
          title: body.title,
          date: new Date(),
        })
        .returning()
        .get();

      const users = await db.query.users.findMany({
        where: (users, { eq }) => eq(users.puppyId, params.id),
      });

      const getCreditorIds = () => {
        const creditorIds = body.creditorIds;
        if (body.splitSetting === "betweenAll") {
          // If "betweenAll" is set we want to split the debt between all users
          return users.map((u) => u.id);
        } else if (creditorIds) {
          if (Array.isArray(creditorIds) && creditorIds?.length > 0) {
            // If an array of creditorIds is set, we want to split the debt between the selected users
            return users
              .filter((u) => creditorIds.includes(u.id.toString()))
              .map((u) => u.id);
          } else {
            // If a single creditorId is set, we want to split the debt only for the selected user
            return users
              .filter((u) => creditorIds === u.id.toString())
              .map((u) => u.id);
          }
        }

        throw new Error(
          'Either splitSetting="betweenAll" or creditorIds must be set'
        );
      };

      const creditorIds = getCreditorIds();

      await db.insert(creditorsToDebts).values(
        creditorIds.map((c) => ({
          debtId: newDebt.id,
          userId: c,
        }))
      );

      return (
        <DebtListEntry
          puppyId={params.id}
          puppyUserCount={users.length}
          debt={{
            debtor: users.find((u) => u.id === newDebt.debtorId)?.name || "",
            creditors: creditorIds.map(
              (c) => users.find((u) => u.id === c)?.name || ""
            ),
            amount: newDebt.amount,
            title: newDebt.title,
            date: newDebt.date,
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
        creditorIds: t.Optional(
          t.Union([t.Array(t.String(), { minLength: 1 }), t.String()])
        ),
        splitSetting: t.String({
          enum: ["betweenAll", "notBetweenAll"],
        }),
      }),
      params: t.Object({
        id: t.Numeric(),
      }),
      error({ code, error }) {
        switch (code) {
          case "VALIDATION":
            console.log(error.all);

            // Find a specific error name (path is OpenAPI Schema compliance)
            const name = error.all.find((x) => x.path === "/name");

            // If has validation error, then log it
            if (name) console.log(name);
        }
      },
    }
  )
  .get("/styles.css", () => Bun.file("./tailwind-gen/styles.css"))
  .get("/debtorSelectionPersistor.js", () =>
    Bun.file("./src/debtorSelectionPersistor.js")
  )
  .listen(3000)
  .onError((err) => {
    console.trace(err);
  });

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

const transformDebts = (
  // TODO: Infer type from db scheme
  debts: {
    id: number;
    title: string;
    amount: number;
    debtorId: number;
    date: Date;
    puppyId: number;
    creditorsToDebts: {
      userId: number;
      debtId: number;
      user: {
        id: number;
        name: string;
        puppyId: number;
      };
    }[];
    debtor: {
      id: number;
      name: string;
      puppyId: number;
    };
  }[]
): MyDebt[] => {
  return (
    debts.map((debt) => ({
      ...debt,
      creditorsToDebts: undefined,
      debtorId: undefined,
      debtor: debt.debtor.name,
      creditors: debt.creditorsToDebts.map((c) => c.user.name),
    })) || []
  );
};
