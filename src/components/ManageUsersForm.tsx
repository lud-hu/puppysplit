import * as elements from "typed-html";
import { User } from "../db/schema";
import UsersListItem from "./UsersListItem";
import Input from "./Input";

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
        class="flex flex-col gap-4"
      >
        <Input placeholder="Name" name="name" label="Name" />
        <Input
          label="PayPal-Me Adresse"
          placeholder="PayPal Handle"
          name="payPalHandle"
          prefix="paypal.me/"
        />
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Hinzufügen
        </button>
      </form>
    </section>
  );
}
