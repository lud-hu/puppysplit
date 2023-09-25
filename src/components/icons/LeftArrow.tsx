import * as elements from "typed-html";

export default function LeftArrow() {
  return (
    <svg
      class="w-10 h-10 text-gray-800 dark:text-white"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 28 20"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 5H1m0 0 4 4M1 5l4-4"
      />
    </svg>
  );
}
