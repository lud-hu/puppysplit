import * as elements from "typed-html";

export default function Input({
  id,
  placeholder,
  label,
  type = "text",
  name,
  prefix,
}: {
  id?: string;
  placeholder?: string;
  label?: string;
  type?: string;
  name: string;
  prefix?: string;
}) {
  console.log("name", name);

  const input = (
    <input
      class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
      id={id || ""}
      type={type}
      name={name}
      placeholder={placeholder || ""}
    />
  );
  return (
    <div class="w-full">
      {label && (
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for={id || ""}
        >
          {label}
        </label>
      )}
      {prefix ? (
        <span class="block w-full bg-gray-200 text-gray-700 border rounded px-4 leading-tight focus:outline-none focus-within:bg-white">
          {prefix}
          <input
            class="appearance-none bg-gray-200 py-3 leading-tight focus:outline-none focus:bg-white"
            id={id || ""}
            type={type}
            name={name}
            placeholder={placeholder || ""}
          />
        </span>
      ) : (
        <input
          class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
          id={id || ""}
          type={type}
          name={name}
          placeholder={placeholder || ""}
        />
      )}
    </div>
  );
}
