import * as elements from "typed-html";

export default function Input({
  id,
  placeholder,
  label,
  type = "text",
  isAmountInput,
  name,
  prefix,
  value,
}: {
  id?: string;
  placeholder?: string;
  label?: string;
  type?: string;
  isAmountInput?: boolean;
  name: string;
  prefix?: string;
  value?: string;
}) {
  let additionalInputProps: Record<string, string> = {
    type,
    name,
  };
  if (id) additionalInputProps["id"] = id;
  if (placeholder) additionalInputProps["placeholder"] = placeholder;
  if (value) additionalInputProps["value"] = value;
  if (isAmountInput) {
    additionalInputProps["step"] = "0.01";
    additionalInputProps["inputmode"] = "numeric";
    additionalInputProps["pattern"] = "[0-9]*";
  }

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
            {...additionalInputProps}
          />
        </span>
      ) : (
        <input
          class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
          {...additionalInputProps}
        />
      )}
    </div>
  );
}
