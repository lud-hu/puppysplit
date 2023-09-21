import * as elements from "typed-html";
import { User } from "../db/schema";

export default function PuppyHeader({
  user,
  puppyId,
}: {
  user: User;
  puppyId: number;
}) {
  return (
    <li>
      {user.name}{" "}
      <button
        // TODO: Use customized Confirm UI: https://htmx.org/examples/confirm/
        hx-confirm="Teilnehmer wirklich löschen?"
        hx-delete={`/puppies/${puppyId}/users/${user.id}`}
        hx-target="closest li"
      >
        X
      </button>
    </li>
  );
}
