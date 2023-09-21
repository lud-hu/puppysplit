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
      hx-on="htmx:afterRequest: this.reset(); this.amount.focus();"
      class="flex flex-col"
    >
      <div>Hinzufügen</div>
      <select name="debtorId">
        {users?.map((u) => (
          <option value={u.id.toString()}>{u.name}</option>
        ))}
      </select>
      <label for="amount">Wie viel?</label>
      <input
        placeholder="12"
        type="number"
        name="amount"
        id="amount"
        step="0.01"
      />
      <label for="title">Wofür?</label>
      <input placeholder="Bier" name="title" id="title" />
      {/* TODO: Fix single selection not working */}
      <fieldset>
        <legend>Aufteilung</legend>

        <div>
          <input
            type="radio"
            id="betweenAll"
            name="splitSetting"
            value="betweenAll"
            checked
          />
          <label for="betweenAll">Zwischen allen aufteilen</label>
        </div>

        <div>
          <input
            type="radio"
            id="notBetweenAll"
            name="splitSetting"
            value="notBetweenAll"
          />
          <label for="notBetweenAll">Anders aufteilen</label>
          <div id="usersCheckboxList">
            {users?.map((u) => (
              <div>
                <input
                  type="checkbox"
                  name="creditorIds"
                  value={u.id.toString()}
                  id={"userCheckbox" + u.name}
                />
                <label for={"userCheckbox" + u.name}>{u.name}</label>
              </div>
            ))}
          </div>
        </div>
      </fieldset>
      <button type="submit">Los</button>
    </form>
  );
}
