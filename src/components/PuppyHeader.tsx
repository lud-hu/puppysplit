import * as elements from "typed-html";
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
  puppyId?: number;
  title: string;
  users?: User[];
  backLink?: string;
}) {
  return (
    <header id="puppy-header" class="p-4">
      {backLink && (
        <a
          href={backLink}
          aria-label="Back"
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold h-10 w-10 rounded inline-flex items-center justify-center"
        >
          <LeftArrow />
        </a>
      )}
      <div class="flex">
        <h1 class="text-4xl mr-auto block tracking-wide text-gray-700 font-bold">
          {puppyId && getPuppyIcon(puppyId)}
          {title}
        </h1>
        {puppyId && (
          <a
            href={`/puppies/${puppyId}/settings`}
            aria-label="Settings"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold h-10 w-10 rounded inline-flex items-center justify-center"
          >
            <SettingsIcon />
          </a>
        )}
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
