import React, { useState } from "react";

/**
 * Input — matches the image style:
 *  - No left icon
 *  - Right side: circle icon (email) OR "Hide/Show" text (password)
 *  - Minimal border, warm placeholder colour
 */
const Input = ({
  id,
  name,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  autoComplete,
  rightSlot, // custom right-side element
}) => {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword && showPw ? "text" : type;

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          name={name}
          type={resolvedType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
        />

        {/* Right slot for password: Hide / Show text */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute inset-y-0 right-4 flex items-center text-xs font-semibold text-gray-400 hover:text-gray-600 transition"
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? "Hide" : "Show"}
          </button>
        )}

        {/* Right slot for other fields (e.g. circle icon) */}
        {!isPassword && rightSlot && (
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-300">
            {rightSlot}
          </span>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-500 pl-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
