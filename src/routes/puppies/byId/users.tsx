import { Elysia, t } from "elysia";
import * as elements from "typed-html";
import UsersListItem from "../../../components/UsersListItem";
import { createUser, deleteUser } from "../../../db/queries";

const puppiesByIndexUsersRoutes = new Elysia()
  // Add a user to a puppy
  .post(
    "/puppies/:id/users",
    async ({ body, params }) => {
      const user = await createUser({
        name: body.name,
        puppyId: params.id,
        payPalHandle: body.payPalHandle,
      });
      return <UsersListItem puppyId={params.id} user={user} />;
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        payPalHandle: t.Optional(t.String()),
      }),
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  // Delete a user from a puppy
  .delete(
    "/puppies/:id/users/:userId",
    async ({ params }) => {
      await deleteUser(params.userId);
      return null;
    },
    {
      params: t.Object({
        id: t.String(),
        userId: t.Numeric(),
      }),
    }
  );

export default puppiesByIndexUsersRoutes;
