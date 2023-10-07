import * as elements from "typed-html";
import { User } from "../db/schema";
import DeleteIcon from "./icons/DeleteIcon";

export default function UsersListItem({
  user,
  puppyId,
}: {
  user: User;
  puppyId: string;
}) {
  return (
    <li class="py-4 px-4 not-last:border-b-2 border-gray-300 flex justify-between">
      {user.name}{" "}
      <button
        // TODO: Use customized Confirm UI: https://htmx.org/examples/confirm/
        hx-confirm={`Delete ${user.name}?`}
        hx-delete={`/puppies/${puppyId}/users/${user.id}`}
        hx-target="closest li"
        hx-swap="outerHTML"
        class="underline text-red-500 px-5"
      >
        <DeleteIcon />
      </button>
    </li>
  );
}
