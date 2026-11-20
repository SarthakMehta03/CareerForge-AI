import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function InputField({
  name,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  disabled = false,
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

  return (
    <div className="mb-2.5">
      <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      <div className="relative">
        <input
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...rest}
          className="
            w-full
            h-8
            rounded-md
            border
            border-gray-200
            dark:border-gray-700
            bg-gray-50
            dark:bg-gray-800
            px-3
            pr-9
            text-xs
            text-gray-700
            dark:text-gray-200
            placeholder:text-gray-400
            dark:placeholder:text-gray-500
            outline-none
            transition
            focus:bg-white
            dark:focus:bg-gray-800
            focus:border-gray-400
            dark:focus:border-gray-500
            focus:ring-1
            focus:ring-gray-200
            dark:focus:ring-gray-700
            disabled:opacity-60
            disabled:cursor-not-allowed
          "
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="
              absolute
              right-2.5
              top-1/2
              -translate-y-1/2
              text-gray-400
              hover:text-black
              dark:hover:text-white
              transition-colors
            "
          >
            {showPassword ? (
              <EyeOff size={16} />
            ) : (
              <Eye size={16} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default InputField;
