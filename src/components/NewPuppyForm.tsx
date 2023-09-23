import * as elements from "typed-html";
import Input from "./Input";

export default function NewPuppyForm() {
  return (
    <form class="flex flex-col gap-3" hx-post="/puppies" hx-swap="beforebegin">
      <Input name="title" label="Puppy erstellen" placeholder="Arco 2023" />
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Erstellen
      </button>
    </form>
  );
}
