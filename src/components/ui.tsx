import type { Children } from "@kitajs/html";

const buttonColors = {
  blue: "bg-blue-500 hover:bg-blue-700",
  gray: "bg-gray-500 hover:bg-gray-700",
  red: "bg-red-500 hover:bg-red-700",
} as const;

type ButtonColor = keyof typeof buttonColors;

const buttonBase = "text-white font-bold py-2 px-4 rounded";

const classNames = (...classes: (JSX.HtmlTag["class"] | undefined)[]) =>
  classes.flat().filter(Boolean).join(" ");

export function Button({
  color = "blue",
  class: extraClass,
  children,
  ...attrs
}: JSX.HtmlButtonTag & { color?: ButtonColor; children?: Children }) {
  return (
    <button
      class={classNames(buttonColors[color], buttonBase, extraClass)}
      {...attrs}
    >
      {children}
    </button>
  );
}

/** A link styled like a button. */
export function LinkButton({
  color = "blue",
  class: extraClass,
  children,
  ...attrs
}: JSX.HtmlAnchorTag & { color?: ButtonColor; children?: Children }) {
  return (
    <a
      class={classNames(
        "inline-block no-underline",
        buttonColors[color],
        buttonBase,
        extraClass
      )}
      {...attrs}
    >
      {children}
    </a>
  );
}

const iconButtonClass =
  "bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold h-10 w-10 rounded inline-flex items-center justify-center";

/** A small square icon-only link (e.g. back arrow, settings). */
export function IconLink({
  class: extraClass,
  children,
  ...attrs
}: JSX.HtmlAnchorTag & { children?: Children }) {
  return (
    <a class={classNames(iconButtonClass, extraClass)} {...attrs}>
      {children}
    </a>
  );
}

/** A small square icon-only button. */
export function IconButton({
  class: extraClass,
  children,
  ...attrs
}: JSX.HtmlButtonTag & { children?: Children }) {
  return (
    <button class={classNames(iconButtonClass, extraClass)} {...attrs}>
      {children}
    </button>
  );
}

export function SectionHeading({
  class: extraClass,
  children,
}: {
  class?: string;
  children?: Children;
}) {
  return (
    <h2
      class={classNames(
        "text-2xl mb-3 pl-4 block uppercase tracking-wide text-gray-700 font-bold",
        extraClass
      )}
    >
      {children}
    </h2>
  );
}
