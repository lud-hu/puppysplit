import type { Children } from "@kitajs/html";

interface BaseHtmlProps {
  children?: Children;
  pageTitle?: string;
}

export default function BaseHtml({ children, pageTitle }: BaseHtmlProps) {
  return (
    <>
      {"<!DOCTYPE html>"}
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title safe>{pageTitle || "🐶 Puppysplit"}</title>
          <script src="https://unpkg.com/htmx.org@1.9.5"></script>
          <script src="https://unpkg.com/hyperscript.org@0.9.11"></script>
          <link href="/styles.css" rel="stylesheet" />
        </head>
        <body>{children}</body>
      </html>
    </>
  );
}
