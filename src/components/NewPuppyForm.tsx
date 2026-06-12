import Input from "./Input";
import { Button } from "./ui";

export default function NewPuppyForm() {
  return (
    <form
      class="flex flex-col gap-3 p-4"
      hx-post="/puppies"
      hx-swap="beforebegin"
    >
      <Input name="title" label="Create Puppy" placeholder="Arco 2023" />
      <Button type="submit">Create 🐶</Button>
    </form>
  );
}
