import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import SocialLogin from "./SocialLogin";

export default function AuthCard({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="w-full rounded-[32px] bg-white p-8 md:p-10 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.08)] border border-gray-50/50">
      {/* Heading */}
      <div className="mb-6 text-center">
        <h2 className="text-[28px] font-bold text-gray-900 leading-tight">
          {isLogin ? "Agent Login" : "Register"}
        </h2>
        <p className="mt-2 text-xs text-gray-400">
          {isLogin
            ? "Hey, Enter your details to get sign in to your account"
            : "Enter your details to create an account"}
        </p>
      </div>

      {/* Form content */}
      <div className="mt-6">
        {isLogin ? (
          <LoginForm onRequestNow={() => setIsLogin(false)} onLoginSuccess={onLoginSuccess} />
        ) : (
          <RegisterForm onSignIn={() => setIsLogin(true)} onLoginSuccess={onLoginSuccess} />
        )}
      </div>

      {/* Divider and Social Logins */}
      <div className="mt-6">
        <SocialLogin onLoginSuccess={onLoginSuccess} />
      </div>

      {/* Bottom Switcher */}
      <div className="mt-8 text-center text-sm">
        {isLogin ? (
          <p className="text-gray-400 text-xs">
            Don't have an account?{" "}
            <button
              onClick={() => setIsLogin(false)}
              className="font-bold text-gray-800 hover:text-gray-900 transition-colors cursor-pointer hover:underline"
            >
              Request Now
            </button>
          </p>
        ) : (
          <p className="text-gray-400 text-xs">
            Already have an account?{" "}
            <button
              onClick={() => setIsLogin(true)}
              className="font-bold text-gray-800 hover:text-gray-900 transition-colors cursor-pointer hover:underline"
            >
              Sign In
            </button>
          </p>
        )}
      </div>
    </div>
  );
}