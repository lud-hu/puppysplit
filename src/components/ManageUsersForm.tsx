import * as elements from "typed-html";
import { User } from "../db/schema";
import UsersListItem from "./UsersListItem";

export default function ManageUsersForm({
  puppyId,
  users,
}: {
  puppyId: number;
  users: User[];
}) {
  return (
    <section>
      <ul id="users-list">
        {users.map((u) => (
          <UsersListItem puppyId={puppyId} user={u} />
        ))}
      </ul>
      <form
        hx-post={`/puppies/${puppyId}/users`}
        hx-target="#users-list"
        hx-swap="beforeend"
        hx-on="htmx:afterRequest: this.reset(); this.name.focus();"
      >
        <input placeholder="Name" name="name" />
        <button type="submit">Hinzufügen</button>
      </form>
    </section>
  );
}
