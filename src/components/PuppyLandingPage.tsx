import * as elements from "typed-html";
import NewPuppyForm from "./NewPuppyForm";

export default function PuppyLandingPage() {
  return (
    <div class="h-full flex flex-col justify-center">
      <h1 class="text-2xl mb-3 pl-4 block uppercase tracking-wide text-gray-700 font-bold">
        🐾 Create Puppy
      </h1>
      <p class="px-4">
        A puppy is a tool to track and split expenses for a trip of a group of
        friends.
      </p>
      <NewPuppyForm />
    </div>
  );
}
