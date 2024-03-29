import * as elements from "typed-html";

interface BaseHtmlProps extends elements.Children {
  pageTitle?: string;
}

export default ({ children, pageTitle }: BaseHtmlProps) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle || "🐶 Puppysplit"}</title>
  <script src="https://unpkg.com/htmx.org@1.9.5"></script>
  <script src="https://unpkg.com/hyperscript.org@0.9.11"></script>
  <link href="/styles.css" rel="stylesheet">
</head>

<body>
${Array.isArray(children) ? children.join("") : children}
</body>
</html>
`;
