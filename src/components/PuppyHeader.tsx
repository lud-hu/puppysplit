import { User } from "../db/schema";
import getPuppyIcon from "../util/getPuppyIcon";
import EditIcon from "./icons/EditIcon";
import LeftArrow from "./icons/LeftArrow";
import SettingsIcon from "./icons/SettingsIcon";
import { IconButton, IconLink } from "./ui";

export default function PuppyHeader({
  puppyId,
  users,
  title,
  backLink,
  action = "settings",
}: {
  puppyId?: string;
  title: string;
  users?: User[];
  backLink?: string;
  action?: "settings" | "editTitle";
}) {
  return (
    <header id="puppy-header" class="p-4 mt-8">
      {backLink ? (
        <IconLink href={backLink} aria-label="Back" class="mb-4">
          <LeftArrow />
        </IconLink>
      ) : null}
      <div class="flex">
        <h1
          safe
          class="text-4xl mr-auto block tracking-wide text-gray-700 font-bold"
        >
          {puppyId && getPuppyIcon(puppyId)}
          {title}
        </h1>
        {puppyId && action === "settings" ? (
          <IconLink href={`/puppies/${puppyId}/settings`} aria-label="Settings">
            <SettingsIcon />
          </IconLink>
        ) : null}
        {puppyId && action === "editTitle" ? (
          <IconButton
            hx-get={`/puppies/${puppyId}/titleEdit`}
            hx-target="#puppy-header"
            aria-label="Edit Title"
          >
            <EditIcon />
          </IconButton>
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
