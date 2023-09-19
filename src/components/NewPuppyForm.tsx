import * as elements from "typed-html";

export default function NewPuppyForm() {
  return (
    <form
      class="flex flex-row space-x-3"
      hx-post="/puppies"
      hx-swap="beforebegin"
    >
      <input type="text" name="title" class="border border-black" />
      <button type="submit">Create</button>
    </form>
  );
}
