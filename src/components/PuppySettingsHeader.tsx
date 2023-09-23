import * as elements from "typed-html";
import { User } from "../db/schema";

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
    <div id="puppy-header">
      <a href={backLink}>Back</a>
      <div class="flex">
        <h1 class="text-4xl mr-auto">🐶{title}</h1>
        <button
          hx-get={`/puppies/${puppyId}/titleEdit`}
          hx-target="#puppy-header"
          aria-label="Edit Title"
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold h-10 w-10 rounded inline-flex items-center justify-center"
        >
          <svg
            class="w-5 h-5 text-gray-800"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            {/* @ts-ignore */}
            <path d="m13.835 7.578-.005.007-7.137 7.137 2.139 2.138 7.143-7.142-2.14-2.14Zm-10.696 3.59 2.139 2.14 7.138-7.137.007-.005-2.141-2.141-7.143 7.143Zm1.433 4.261L2 12.852.051 18.684a1 1 0 0 0 1.265 1.264L7.147 18l-2.575-2.571Zm14.249-14.25a4.03 4.03 0 0 0-5.693 0L11.7 2.611 17.389 8.3l1.432-1.432a4.029 4.029 0 0 0 0-5.689Z" />
          </svg>
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
    </div>
  );
}
