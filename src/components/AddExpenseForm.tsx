import { User } from "../db/schema";
import Input from "./Input";
import { Button, SectionHeading } from "./ui";

export default function AddExpenseForm({
  users,
  puppyId,
}: {
  users: User[];
  puppyId: string;
}) {
  return (
    <section>
      <SectionHeading>Add expense</SectionHeading>
      <form
        id="add-expense-form"
        hx-post={`/puppies/${puppyId}/expenses`}
        hx-target="#expense-list"
        hx-swap="afterbegin"
        class="flex flex-col bg-gray-100 p-4 gap-4 text-center"
      >
        <script src="/payerSelectionPersistor.js" />
        <select
          name="payerId"
          class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight text-center focus:outline-hidden focus:bg-white"
          style="text-align-last: center"
          hx-ext="payerSelectionPersistor"
        >
          {users?.map((u) => (
            <option value={u.id.toString()} safe>
              {u.name}
            </option>
          ))}
        </select>
        <Input id="amount" name="amount" label="paid" isAmountInput />
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
            <label for="betweenAll">All members</label>
          </div>
          <div class="text-left">
            <input
              type="radio"
              id="notBetweenAll"
              name="splitSetting"
              value="notBetweenAll"
            />
            <label for="notBetweenAll">Specific people</label>
            <fieldset id="usersCheckboxList" class="pl-4" disabled>
              <legend class="text-sm py-2">
                Choose who shares this expense (one or more).
              </legend>
              {users?.map((u) => (
                <div>
                  <input
                    type="checkbox"
                    name="participantIds"
                    value={u.id.toString()}
                    id={"userCheckbox" + u.id}
                  />
                  <label for={"userCheckbox" + u.id} safe>
                    {u.name}
                  </label>
                </div>
              ))}
            </fieldset>
          </div>
        </fieldset>
        <p id="expense-form-error" role="alert"></p>
        <Button type="submit" disabled={users.length === 0}>
          Add
        </Button>
        <script src="/expenseForm.js" defer />
      </form>
    </section>
  );
}
