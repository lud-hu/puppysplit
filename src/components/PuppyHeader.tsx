import { User } from "../db/schema";
import getPuppyIcon from "../util/getPuppyIcon";
import SettingsIcon from "./icons/SettingsIcon";
import LeftArrow from "./icons/LeftArrow";

export default function PuppyHeader({
  puppyId,
  users,
  title,
  backLink,
}: {
  puppyId?: string;
  title: string;
  users?: User[];
  backLink?: string;
}) {
  return (
    <header id="puppy-header" class="p-4 mt-8">
      {backLink ? (
        <a
          href={backLink}
          aria-label="Back"
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold h-10 w-10 rounded inline-flex items-center justify-center mb-4"
        >
          <LeftArrow />
        </a>
      ) : null}
      <div class="flex">
        <h1
          safe
          class="text-4xl mr-auto block tracking-wide text-gray-700 font-bold"
        >
          {puppyId && getPuppyIcon(puppyId)}
          {title}
        </h1>
        {puppyId ? (
          <a
            href={`/puppies/${puppyId}/settings`}
            aria-label="Settings"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold h-10 w-10 rounded inline-flex items-center justify-center"
          >
            <SettingsIcon />
          </a>
        ) : null}
      </div>
      {users ? (
        <small>
          Members: <span safe>{users.map((u) => u.name).join(", ")}</span>
        </small>
      ) : null}
    </header>
  );
}
