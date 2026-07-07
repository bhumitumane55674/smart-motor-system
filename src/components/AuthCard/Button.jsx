import React from "react";

/**
 * Button — two variants matching the reference design:
 *  primary : warm amber fill  (Sign in / Create account)
 *  outline : white + border   (social login buttons)
 */
const Button = ({
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  onClick,
  className = "",
  icon,
}) => {
  const base =
    "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[#FAB915] text-white hover:bg-[#FAB915]/90 focus:ring-amber-300 shadow-sm",
    outline:
      "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-200",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
