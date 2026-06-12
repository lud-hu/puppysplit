
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
    // The visible field only ever shows the formatted amount (e.g. "12,34")
    // and fills in from the back as you type. The actual value submitted with
    // the form lives in the hidden input as a plain number (e.g. "12.34").
    // See /amountInput.js for the formatting logic.
    return (
      <div class="w-full" data-amount-wrapper="true">
        {label ? (
          <label
            safe
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for={id || ""}
          >
            {label}
          </label>
        ) : null}
        <span class="flex items-center w-full bg-gray-200 text-gray-700 border rounded px-4 leading-tight focus-within:bg-white">
          {/* invisible mirror of the € so the value stays optically centered */}
          <span class="pr-2 select-none invisible" aria-hidden="true">
            €
          </span>
          <input
            id={id || ""}
            data-amount-input="true"
            type="text"
            inputmode="numeric"
            autocomplete="off"
            placeholder="0,00"
            class="appearance-none bg-transparent w-full py-3 leading-tight text-center focus:outline-hidden"
          />
          <span class="pl-2 select-none">€</span>
        </span>
        <input
          type="hidden"
          name={name}
          data-amount-value="true"
          value={value || ""}
        />
        <script src="/amountInput.js" />
      </div>
    );
  }

  return (
    <div class="w-full">
      {label ? (
        <label
          safe
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for={id || ""}
        >
          {label}
        </label>
      ) : null}
      {prefix ? (
        <span class="block w-full bg-gray-200 text-gray-700 border rounded px-4 leading-tight focus:outline-hidden focus-within:bg-white">
          <span safe>{prefix}</span>
          <input
            class="appearance-none bg-gray-200 py-3 leading-tight focus:outline-hidden focus:bg-white"
            {...additionalInputProps}
          />
        </span>
      ) : (
        <input
          class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight text-center focus:outline-hidden focus:bg-white"
          {...additionalInputProps}
        />
      )}
    </div>
  );
}
