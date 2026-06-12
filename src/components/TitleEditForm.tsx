import Input from "./Input";
import { Button } from "./ui";

export default function TitleEditForm({
  puppyId,
  title,
}: {
  puppyId: string;
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
      {/* Reverse direction so that enter will hit the "first" button: Save */}
      <div class="flex flex-row-reverse gap-2">
        <Button type="submit" class="w-1/2">
          Save
        </Button>
        <Button color="gray" class="w-1/2" hx-get={`/puppies/${puppyId}/title`}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
