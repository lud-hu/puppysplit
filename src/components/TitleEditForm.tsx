import * as elements from "typed-html";
import Input from "./Input";

export default function TitleEditForm({
  puppyId,
  title,
}: {
  puppyId: number;
  title: string;
}) {
  return (
    <form
      hx-put={`/puppies/${puppyId}/title`}
      hx-target="this"
      hx-swap="outerHTML"
      class="flex flex-col gap-4"
    >
      <Input label="Title" placeholder="Titel" name="title" value={title} />
      {/* Reverse direct so that enter will hit "first" button: Save */}
      <div class="flex flex-row-reverse gap-2">
        <button
          type="submit"
          class="w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
        <button
          hx-get={`/puppies/${puppyId}/title`}
          class="w-1/2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
