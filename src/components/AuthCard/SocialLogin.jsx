import React, { useState } from "react";
import {
  authenticateWithGoogle,
  authenticateWithApple,
  authenticateWithFacebook,
} from "../../services/auth";

/* ─── Inline SVG brand icons ─────────────────────────────── */
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="currentColor" aria-hidden="true">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="#1877F2" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

/* Tiny spinner shown during loading */
const Spinner = () => (
  <svg
    className="h-4 w-4 animate-spin shrink-0 text-gray-500"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
);

/* ─── Individual social button ───────────────────────────── */
const SocialButton = ({ id, icon, label, onClick, loading, disabled }) => (
  <button
    id={id}
    type="button"
    onClick={onClick}
    disabled={disabled || loading}
    aria-label={`Continue with ${label}`}
    aria-busy={loading}
    className={[
      /* layout */
      "relative flex items-center justify-center gap-2",
      "w-full rounded-xl border border-gray-200 bg-white",
      "px-3 py-2.5 text-xs font-semibold text-gray-700",
      /* pointer & interactions */
      "cursor-pointer select-none",
      "transition-all duration-200 ease-out",
      /* hover */
      "hover:border-gray-300 hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5",
      /* active (click press) */
      "active:scale-95 active:shadow-none active:translate-y-0",
      /* focus-visible ring (keyboard nav) */
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus:ring-2 focus:ring-amber-400/50",
      /* disabled */
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none",
    ].join(" ")}
  >
    {loading ? <Spinner /> : icon}
    <span>{loading ? `Signing in...` : label}</span>
  </button>
);

/* ─── SocialLogin section ────────────────────────────────── */
const SocialLogin = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const anyLoading = loading !== null;

  const handleGoogleLogin = async () => {
    if (loading) return;
    setError(null);
    setLoading("google");
    try {
      const user = await authenticateWithGoogle();
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch (err) {
      console.error("Google Login Error:", err);
      setError(err.message || "Google sign-in failed. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleAppleLogin = async () => {
    if (loading) return;
    setError(null);
    setLoading("apple");
    try {
      const user = await authenticateWithApple();
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch (err) {
      console.error("Apple Login Error:", err);
      setError(err.message || "Apple sign-in failed. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleFacebookLogin = async () => {
    if (loading) return;
    setError(null);
    setLoading("facebook");
    try {
      const user = await authenticateWithFacebook();
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch (err) {
      console.error("Facebook Login Error:", err);
      setError(err.message || "Facebook sign-in failed. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const providers = [
    {
      id: "btn-google-login",
      key: "google",
      label: "Google",
      icon: <GoogleIcon />,
      handler: handleGoogleLogin,
    },
    {
      id: "btn-apple-login",
      key: "apple",
      label: "Apple ID",
      icon: <AppleIcon />,
      handler: handleAppleLogin,
    },
    {
      id: "btn-facebook-login",
      key: "facebook",
      label: "Facebook",
      icon: <FacebookIcon />,
      handler: handleFacebookLogin,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Divider */}
      <div className="flex items-center gap-3" aria-hidden="true">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="shrink-0 text-xs font-medium text-gray-400">
          — Or Sign in with —
        </span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Social buttons row — pointer-events-auto ensures clicks always land */}
      <div
        className="grid grid-cols-3 gap-2 pointer-events-auto"
        role="group"
        aria-label="Social login options"
      >
        {providers.map(({ id, key, label, icon, handler }) => (
          <SocialButton
            key={key}
            id={id}
            icon={icon}
            label={label}
            onClick={handler}
            loading={loading === key}
            disabled={anyLoading && loading !== key}
          />
        ))}
      </div>

      {/* Error alert */}
      {error && (
        <div className="text-xs text-rose-500 bg-rose-50 border border-rose-100 rounded-xl p-2.5 mt-3 text-center font-medium animate-pulse">
          {error}
        </div>
      )}
    </div>
  );
};

export default SocialLogin;
