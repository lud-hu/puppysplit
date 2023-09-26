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
    <div class="flex flex-col space-y-3">
      <PuppySettingsHeader
        title={title}
        backLink={`/puppies/${id}`}
        puppyId={id}
      />
      <h2 class="text-2xl mb-3 pl-4 block uppercase tracking-wide text-gray-700 font-bold">
        Members
      </h2>
      <ManageUsersForm puppyId={id} users={users} />
    </div>
  );
}

export interface MyDebt {
  creditorsToDebts: undefined;
  debtorId: undefined;
  debtor: string;
  creditors: string[];
  id: number;
  title: string;
  amount: number;
}
