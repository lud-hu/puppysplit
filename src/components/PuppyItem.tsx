import * as elements from "typed-html";
import { Puppy } from "../db/schema";

export default function PuppyItem({ title, id }: Puppy) {
  return (
    <div class="flex flex-row space-x-3">
      <p>{title}</p>
      <a href={`/puppies/${id}`}>To details</a>
    </div>
  );
}
