import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import * as elements from "typed-html";
import UsersListItem from "../../../components/UsersListItem";
import { db } from "../../../db";
import { creditorsToDebts, users } from "../../../db/schema";

const puppiesByIndexUsersRoutes = new Elysia()
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
      // First delete all debts for this user
      // The debt will still be there but it won't affrect this user anymore!
      await db
        .delete(creditorsToDebts)
        .where(eq(creditorsToDebts.userId, params.userId));
      // Then delete the user
      await db.delete(users).where(eq(users.id, params.userId));
      return null;
    },
    {
      params: t.Object({
        id: t.Numeric(),
        userId: t.Numeric(),
      }),
    }
  );

export default puppiesByIndexUsersRoutes;
