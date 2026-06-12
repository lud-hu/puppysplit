import BaseHtml from "./BaseHtml";
import { LinkButton } from "./ui";

export default function NotFoundPage() {
  return (
    <BaseHtml pageTitle="Not found - Puppysplit">
      <main class="p-4 mt-8 flex flex-col gap-4 items-start">
        <h1 class="text-4xl tracking-wide text-gray-700 font-bold">
          404 — Not found
        </h1>
        <p>This puppy doesn't exist (anymore).</p>
        <LinkButton href="/">Create a new puppy</LinkButton>
      </main>
    </BaseHtml>
  );
}
