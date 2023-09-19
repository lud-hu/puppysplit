import * as elements from "typed-html";
import { User } from "../db/schema";

export default function PuppyHeader({
  users,
  title,
}: {
  title: string;
  users: User[];
}) {
  return (
    <div>
      <a href={`/`}>Back</a>
      <h1 class="text-4xl">{title}</h1>
      <small>Teilnehmer: {users.map((u) => u.name).join(", ")}</small>
    </div>
  );
}
