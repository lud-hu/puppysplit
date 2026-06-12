import { User } from "../db/schema";
import ManageUsersForm from "./ManageUsersForm";
import PuppyHeader from "./PuppyHeader";
import { Button, SectionHeading } from "./ui";

export default function PuppySettings({
  puppyId,
  title,
  users,
}: {
  puppyId: string;
  title: string;
  users: User[];
}) {
  return (
    <div class="flex flex-col">
      <PuppyHeader
        title={title}
        backLink={`/puppies/${puppyId}`}
        puppyId={puppyId}
        action="editTitle"
      />
      <SectionHeading class="mt-5">Members</SectionHeading>
      <ManageUsersForm puppyId={puppyId} users={users} />
      <SectionHeading class="mt-10">Administration</SectionHeading>
      <div class="p-4 pb-8 bg-gray-100 flex flex-col gap-4">
        <Button
          color="red"
          type="submit"
          hx-confirm="Really delete this Puppy?"
          hx-delete={`/puppies/${puppyId}`}
        >
          Delete Puppy ☠️
        </Button>
      </div>
    </div>
  );
}
