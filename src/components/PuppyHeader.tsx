import * as elements from "typed-html";
import { User } from "../db/schema";

export default function PuppyHeader({
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
    <div>
      <a href={backLink}>Back</a>
      <div class="flex">
        <h1 class="text-4xl mr-auto">{title}</h1>
        {puppyId && <a href={`/puppies/${puppyId}/settings`}>Settings</a>}
      </div>
      {users && (
        <small>
          Teilnehmer:{" "}
          {users.map((u, i) => (
            <span>{i < users.length - 1 ? `${u.name}, ` : u.name}</span>
          ))}
        </small>
      )}
    </div>
  );
}
