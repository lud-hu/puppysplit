import { User } from "../db/schema";
import Input from "./Input";
import UsersListItem from "./UsersListItem";
import { Button, SectionHeading } from "./ui";

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
      <SectionHeading class="mt-10">Add Member</SectionHeading>
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
        <Button type="submit">Add</Button>
      </form>
    </section>
  );
}
