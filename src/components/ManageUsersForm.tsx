import * as elements from "typed-html";
import { User } from "../db/schema";
import UsersListItem from "./UsersListItem";
import Input from "./Input";

export default function ManageUsersForm({
  puppyId,
  users,
}: {
  puppyId: string;
  users: User[];
}) {
  return (
    <section>
      <ul id="users-list" class="p-4 bg-gray-100">
        {users.map((u) => (
          <UsersListItem puppyId={puppyId} user={u} />
        ))}
      </ul>
      <h2 class="pl-4 text-2xl mt-10 mb-3 block uppercase tracking-wide text-gray-700 font-bold">
        Add Member
      </h2>
      <form
        hx-post={`/puppies/${puppyId}/users`}
        hx-target="#users-list"
        hx-swap="beforeend"
        hx-on="htmx:afterRequest: this.reset(); this.name.focus();"
        class="p-4 pb-8 bg-gray-100 flex flex-col gap-4"
      >
        <Input placeholder="Name" name="name" label="Name" />
        <Input
          label="PayPal-Me Address (Optional)"
          placeholder="PayPal Handle"
          name="payPalHandle"
          prefix="paypal.me/"
        />
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add
        </button>
      </form>
    </section>
  );
}
