import React, { useState } from "react";
import Input from "./Input";
import Button from "./Button";

/* Circle icon matching the image's right-side email indicator */
const CircleIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="10" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M4.5 16.5c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/* ── Validation ── */
const validate = ({ email, passcode }) => {
  const errors = {};
  if (!email.trim()) errors.email = "Email or phone number is required.";
  if (!passcode) errors.passcode = "Passcode is required.";
  else if (passcode.length < 6) errors.passcode = "Passcode must be at least 6 characters.";
  return errors;
};

const LoginForm = ({ onRequestNow, onLoginSuccess }) => {
  const [fields, setFields] = useState({ email: "", passcode: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);

    if (onLoginSuccess) {
      const mockUser = {
        displayName: fields.email.split("@")[0] || "Agent User",
        email: fields.email,
        photoURL: null,
        uid: "email_" + Math.random().toString(36).substring(2, 11),
        providerId: "Email",
      };
      onLoginSuccess(mockUser);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Email / Phone */}
      <Input
        id="login-email"
        name="email"
        label="Email or Phone"
        type="text"
        placeholder="Enter Email / Phone No"
        value={fields.email}
        onChange={handleChange}
        error={errors.email}
        required
        autoComplete="email"
        rightSlot={<CircleIcon />}
      />

      {/* Passcode */}
      <Input
        id="login-passcode"
        name="passcode"
        label="Passcode"
        type="password"
        placeholder="Passcode"
        value={fields.passcode}
        onChange={handleChange}
        error={errors.passcode}
        required
        autoComplete="current-password"
      />

      {/* Trouble link */}
      <div className="pt-1">
        <button
          type="button"
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer focus:outline-none focus:underline"
        >
          Having trouble in sign in?
        </button>
      </div>

      {/* CTA */}
      <div className="pt-3">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Signing in…
            </span>
          ) : (
            "Sign in"
          )}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
