import * as elements from "typed-html";
import { User } from "../db/schema";

export default function UsersListItem({
  user,
  puppyId,
}: {
  user: User;
  puppyId: number;
}) {
  return (
    <li class="p-2 even:bg-gray-100 flex justify-between">
      {user.name}{" "}
      <button
        // TODO: Use customized Confirm UI: https://htmx.org/examples/confirm/
        hx-confirm="Delete Member?"
        hx-delete={`/puppies/${puppyId}/users/${user.id}`}
        hx-target="closest li"
        class="underline text-red-500"
      >
        Delete
      </button>
    </li>
  );
}
