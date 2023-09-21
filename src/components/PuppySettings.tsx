import * as elements from "typed-html";
import { User } from "../db/schema";
import ManageUsersForm from "./ManageUsersForm";
import PuppyHeader from "./PuppyHeader";

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
      <PuppyHeader title={title} backLink={`/puppies/${id}`} />
      <h2 class="text-xl">Teilnehmer hinzufügen</h2>
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
