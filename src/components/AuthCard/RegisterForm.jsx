import React, { useState } from "react";
import Input from "./Input";
import Button from "./Button";

/* ── Password strength ── */
const getStrength = (pwd) => {
  if (!pwd) return 0;
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
};
const labels = ["", "Weak", "Fair", "Good", "Strong"];
const colors = ["", "bg-red-400", "bg-amber-400", "bg-yellow-400", "bg-emerald-500"];

const StrengthBar = ({ password }) => {
  const s = getStrength(password);
  if (!password) return null;
  return (
    <div className="space-y-1" aria-live="polite">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= s ? colors[s] : "bg-gray-200"}`} />
        ))}
      </div>
      <p className={`text-xs font-medium ${s <= 1 ? "text-red-500" : s === 2 ? "text-amber-500" : s === 3 ? "text-yellow-600" : "text-emerald-600"}`}>
        {labels[s]}
      </p>
    </div>
  );
};

/* ── Validation ── */
const validate = ({ fullName, email, password, confirm }) => {
  const e = {};
  if (!fullName.trim()) e.fullName = "Full name is required.";
  if (!email.trim()) e.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email.";
  if (!password) e.password = "Password is required.";
  else if (password.length < 8) e.password = "Min. 8 characters.";
  if (!confirm) e.confirm = "Please confirm your password.";
  else if (password !== confirm) e.confirm = "Passwords do not match.";
  return e;
};

const RegisterForm = () => {
  const [fields, setFields] = useState({ fullName: "", email: "", password: "", confirm: "" });
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
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <Input id="reg-name" name="fullName" label="Full Name" placeholder="Full Name"
        value={fields.fullName} onChange={handleChange} error={errors.fullName} required autoComplete="name" />

      <Input id="reg-email" name="email" label="Email" type="email" placeholder="Enter Email"
        value={fields.email} onChange={handleChange} error={errors.email} required autoComplete="email" />

      <div className="space-y-1">
        <Input id="reg-pw" name="password" label="Password" type="password" placeholder="Password"
          value={fields.password} onChange={handleChange} error={errors.password} required autoComplete="new-password" />
        <StrengthBar password={fields.password} />
      </div>

      <Input id="reg-confirm" name="confirm" label="Confirm Password" type="password" placeholder="Confirm Password"
        value={fields.confirm} onChange={handleChange} error={errors.confirm} required autoComplete="new-password" />

      <p className="text-xs text-gray-400 leading-relaxed">
        By registering you agree to our{" "}
        <a href="#" className="text-amber-500 hover:underline">Terms</a> &{" "}
        <a href="#" className="text-amber-500 hover:underline">Privacy Policy</a>.
      </p>

      <div className="pt-1">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Creating account…
            </span>
          ) : (
            "Create account"
          )}
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;
