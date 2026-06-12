import { User } from "../db/schema";
import getPuppyIcon from "../util/getPuppyIcon";
import EditIcon from "./icons/EditIcon";
import LeftArrow from "./icons/LeftArrow";

export default function PuppySettingsHeader({
  puppyId,
  users,
  title,
  backLink,
}: {
  puppyId?: string;
  title: string;
  users?: User[];
  backLink: string;
}) {
  return (
    <header id="puppy-header" class="p-4">
      <a
        href={backLink}
        aria-label="Back"
        class="mb-12 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold h-10 w-10 rounded inline-flex items-center justify-center"
      >
        <LeftArrow />
      </a>
      <div class="flex">
        <h1 safe class="text-4xl mr-auto">
          {puppyId && getPuppyIcon(puppyId)}
          {title}
        </h1>
        <button
          hx-get={`/puppies/${puppyId}/titleEdit`}
          hx-target="#puppy-header"
          aria-label="Edit Title"
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold h-10 w-10 rounded inline-flex items-center justify-center"
        >
          <EditIcon />
        </button>
      </div>
      {users ? (
        <small>
          Members: <span safe>{users.map((u) => u.name).join(", ")}</span>
        </small>
      ) : null}
    </header>
  );
}
