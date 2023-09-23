import * as elements from "typed-html";
import { User } from "../db/schema";
import Input from "./Input";

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
      hx-swap="afterbegin"
      hx-on="htmx:afterRequest: this.reset(); this.amount.focus();"
      class="flex flex-col bg-gray-100 p-4 gap-4 text-center"
    >
      <div class="text-xl">Add expense</div>
      <script src="/debtorSelectionPersistor.js" />
      <select
        name="debtorId"
        class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
        hx-ext="debtorSelectionPersistor"
      >
        {users?.map((u) => (
          <option value={u.id.toString()}>{u.name}</option>
        ))}
      </select>
      <Input
        id="amount"
        name="amount"
        type="number"
        label="paid"
        placeholder="12 €"
      />
      <Input id="title" name="title" label="for" placeholder="Dinge" />
      <fieldset>
        <legend class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
          split between
        </legend>
        <div class="text-left">
          <input
            type="radio"
            id="betweenAll"
            name="splitSetting"
            value="betweenAll"
            checked
          />
          <label for="betweenAll">all members</label>
        </div>
        <div class="text-left">
          <input
            type="radio"
            id="notBetweenAll"
            name="splitSetting"
            value="notBetweenAll"
          />
          <label for="notBetweenAll">the following members:</label>
          <div id="usersCheckboxList" class="pl-4">
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
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Add
      </button>
    </form>
  );
}
