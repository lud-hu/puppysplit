import * as elements from "typed-html";
import { User } from "../db/schema";
import getPuppyIcon from "../util/getPuppyIcon";
import EditIcons from "./icons/EditIcon";
import LeftArrow from "./icons/LeftArrow";

export default function PuppySettingsHeader({
  puppyId,
  users,
  title,
  backLink,
}: {
  puppyId?: number;
  title: string;
  users?: User[];
  backLink: string;
}) {
  return (
    <header id="puppy-header" class="py-4 mt-8">
      <a
        href={backLink}
        aria-label="Back"
        class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold h-10 w-10 rounded inline-flex items-center justify-center mb-4"
      >
        <LeftArrow />
      </a>
      <div class="flex">
        <h1 class="text-4xl mr-auto">
          {puppyId && getPuppyIcon(puppyId)}
          {title}
        </h1>
        <button
          hx-get={`/puppies/${puppyId}/titleEdit`}
          hx-target="#puppy-header"
          aria-label="Edit Title"
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold h-10 w-10 rounded inline-flex items-center justify-center"
        >
          <EditIcons />
        </button>
      </div>
      {users && (
        <small>
          Members:{" "}
          {users.map((u, i) => (
            <span>{i < users.length - 1 ? `${u.name}, ` : u.name}</span>
          ))}
        </small>
      )}
    </header>
  );
}
