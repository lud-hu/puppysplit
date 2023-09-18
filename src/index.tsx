import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";
import { db } from "./db";
import { Puppy, puppies } from "./db/schema";
import { eq } from "drizzle-orm";

const app = new Elysia()
  .use(html())
  // TODO: Fix elysia html typings
  .get("/", async ({ html }: any) => {
    const data = await db.select().from(puppies).all();
    return html(
      <BaseHtml>
        <PuppyList puppies={data} />
      </BaseHtml>
    );
  })
  .get(
    "/puppies/:id",
    async ({ params, set }) => {
      const data = await db
        .select()
        .from(puppies)
        .where(eq(puppies.id, params.id))
        .get();
      if (data) {
        // set.headers["HX-Push-Url"] = `/puppies/${params.id}`;
        return (
          <BaseHtml>
            <PuppyDetails {...data} />
          </BaseHtml>
        );
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .post(
    "/puppies",
    async ({ body, set }) => {
      const newPuppy = await db.insert(puppies).values(body).returning().get();
      return <PuppyItem {...newPuppy} />;
    },
    {
      body: t.Object({
        title: t.String({ minLength: 1 }),
      }),
    }
  )
  .get("/styles.css", () => Bun.file("./tailwind-gen/styles.css"))
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

const BaseHtml = ({ children }: elements.Children) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>THE BETH STACK</title>
  <script src="https://unpkg.com/htmx.org@1.9.3"></script>
  <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
  <link href="/styles.css" rel="stylesheet">
</head>

${children}
`;

function PuppyItem({ title, id }: Puppy) {
  return (
    <div class="flex flex-row space-x-3">
      <p>{title}</p>
      <a href={`/puppies/${id}`}>To details</a>
    </div>
  );
}

function PuppyDetails({ title }: Puppy) {
  return (
    <div class="flex flex-row space-x-3">
      <a href={`/`}>Back</a>
      <p>{title}</p>
    </div>
  );
}

function PuppyList({ puppies }: { puppies: Puppy[] }) {
  return (
    <div>
      {puppies.map((puppy) => (
        <PuppyItem {...puppy} />
      ))}
      <NewPuppyForm />
    </div>
  );
}

function NewPuppyForm() {
  return (
    <form
      class="flex flex-row space-x-3"
      hx-post="/puppies"
      hx-swap="beforebegin"
      _="on submit target.reset()"
    >
      <input type="text" name="title" class="border border-black" />
      <button type="submit">Create</button>
    </form>
  );
}
