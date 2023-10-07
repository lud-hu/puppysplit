import * as elements from "typed-html";
import { User } from "../db/schema";
import ManageUsersForm from "./ManageUsersForm";
import PuppySettingsHeader from "./PuppySettingsHeader";

export default function PuppySettings({
  id,
  title,
  users,
}: {
  id: number;
  title: string;
  users: User[];
}) {
  return (
    <div class="flex flex-col">
      <PuppySettingsHeader
        title={title}
        backLink={`/puppies/${id}`}
        puppyId={id}
      />
      <h2 class="text-2xl mb-3 mt-5 pl-4 block uppercase tracking-wide text-gray-700 font-bold">
        Members
      </h2>
      <ManageUsersForm puppyId={id} users={users} />
      <h2 class="pl-4 text-2xl mt-10 mb-3 block uppercase tracking-wide text-gray-700 font-bold">
        Administration
      </h2>
      <div class="p-4 pb-8 bg-gray-100 flex flex-col gap-4">
        <button
          type="submit"
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          hx-confirm="Really delete this Puppy?"
          hx-delete={`/puppies/${id}`}
        >
          Delete Puppy ☠️
        </button>
      </div>
    </div>
  );
}
