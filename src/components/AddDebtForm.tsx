import * as elements from "typed-html";
import { User } from "../db/schema";

export default function AddDebtForm({
  users,
  puppyId,
}: {
  users: User[];
  puppyId: number;
}) {
  return (
    <form
      hx-post={`/puppies/${puppyId}/debts`}
      hx-target="#debt-list"
      hx-swap="beforeend"
      hx-on:after-request="this.reset()"
    >
      <div>Hinzufügen</div>
      <select name="debtorId">
        {users?.map((u) => (
          <option value={u.id.toString()}>{u.name}</option>
        ))}
      </select>
      <input placeholder="12" type="number" name="amount" />
      <input placeholder="Bier" name="title" />
      {/* TODO: Fix single selection not working */}
      <select name="creditorIds" multiple="true">
        {users?.map((u) => (
          <option value={u.id.toString()}>{u.name}</option>
        ))}
      </select>
      <button type="submit">Los</button>
    </form>
  );
}
