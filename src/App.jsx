import React, { useState, useEffect } from "react";
import AuthCard from "./components/AuthCard/AuthCard";
import Dashboard from "./components/AuthCard/Dashboard";
import { getSessionUser, saveSessionUser, logout } from "./services/auth";

/* ═══════════════════════════════════════════════════════════
   DECORATIVE SVG PRIMITIVES
   ALL decorative elements MUST have:
     - pointer-events-none   → never intercept clicks
     - z-0 (via z-index)     → always below the card (z-50)
═══════════════════════════════════════════════════════════ */

const WavyLine = ({ className = "" }) => (
  <svg
    viewBox="0 0 90 30"
    fill="none"
    className={`pointer-events-none select-none ${className}`}
    aria-hidden="true"
    tabIndex={-1}
  >
    <path
      d="M3 22 C14 4, 26 4, 36 16 C46 28, 58 28, 68 16 C78 4, 86 6, 88 14"
      stroke="#b8ac9f"
      strokeWidth="2.2"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

const SmallCircle = ({ size = 10, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    className={`pointer-events-none select-none ${className}`}
    aria-hidden="true"
    tabIndex={-1}
  >
    <circle cx="10" cy="10" r="7" stroke="#c5bab1" strokeWidth="1.8" fill="none" />
  </svg>
);

const FloatCard = ({ lines = 2, className = "" }) => (
  <div
    className={`pointer-events-none select-none bg-white rounded-2xl border border-gray-100 shadow-md flex flex-col justify-center gap-2 px-5 py-4 ${className}`}
    aria-hidden="true"
  >
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="rounded-full bg-gray-200"
        style={{ height: 6, width: i === 0 ? 52 : 36 }}
      />
    ))}
  </div>
);

const PolkaRect = ({ w = 80, h = 130, className = "" }) => (
  <div
    className={`pointer-events-none select-none rounded-2xl overflow-hidden shrink-0 ${className}`}
    style={{ width: w, height: h, background: "#F5C540" }}
    aria-hidden="true"
  >
    <svg width={w} height={h} aria-hidden="true">
      {Array.from({ length: 7 }).map((_, row) =>
        Array.from({ length: 4 }).map((_, col) => (
          <circle
            key={`${row}-${col}`}
            cx={13 + col * 20}
            cy={13 + row * 20}
            r="4"
            fill="#1a1505"
            opacity="0.7"
          />
        ))
      )}
    </svg>
  </div>
);

const ArrowCard = ({ className = "" }) => (
  <div
    className={`pointer-events-none select-none bg-white rounded-2xl border border-gray-100 shadow-md flex items-center justify-center ${className}`}
    aria-hidden="true"
  >
    <svg viewBox="0 0 40 40" className="h-9 w-9 text-gray-400" fill="none" aria-hidden="true">
      <path
        d="M10 30 L28 12 M28 12 L15 12 M28 12 L28 25"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   ILLUSTRATION PANELS  (z-0, pointer-events-none throughout)
═══════════════════════════════════════════════════════════ */

const LeftPanel = () => (
  <div
    className="relative hidden md:block md:w-44 lg:w-56 shrink-0 self-stretch z-0 pointer-events-none"
    aria-hidden="true"
  >
    <WavyLine className="absolute top-6 left-4 w-20" />
    <SmallCircle size={12} className="absolute top-20 left-20" />
    <FloatCard lines={2} className="absolute top-28 left-2 w-28 h-16" />
    <SmallCircle size={9} className="absolute top-56 left-8" />
    <WavyLine className="absolute top-1/2 left-6 w-16 opacity-60 rotate-6" />
    <PolkaRect w={76} h={124} className="absolute bottom-28 left-1" />
    <ArrowCard className="absolute bottom-20 left-14 w-16 h-16" />
  </div>
);

const RightPanel = () => (
  <div
    className="relative hidden md:block md:w-44 lg:w-56 shrink-0 self-stretch z-0 pointer-events-none"
    aria-hidden="true"
  >
    {/* Small circle at the top */}
    <SmallCircle size={10} className="absolute top-5 right-20" />
    
    {/* Woman illustration wrapped in a card */}
    <div className="absolute top-32 right-0 w-36 lg:w-44 aspect-square bg-white rounded-2xl border border-gray-100 shadow-md flex items-center justify-center p-4 pointer-events-none">
      <img
        src="/woman.png"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="w-full h-full object-contain select-none pointer-events-none"
      />
    </div>

    {/* Wavy line next to bottom-right PolkaRect */}
    <WavyLine className="absolute bottom-40 right-14 w-14 scale-x-[-1] opacity-60 -rotate-6" />
    
    {/* Small circle next to bottom-right PolkaRect */}
    <SmallCircle size={9} className="absolute bottom-16 right-24" />

    {/* PolkaRect at the bottom right */}
    <PolkaRect w={72} h={108} className="absolute bottom-24 right-1" />
  </div>
);

/* ═══════════════════════════════════════════════════════════
   APP ROOT
   z-index layers:
     z-0  → decorative panels (LeftPanel / RightPanel)
     z-50 → AuthCard  ← always on top, fully interactive
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = getSessionUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLoginSuccess = (user) => {
    saveSessionUser(user);
    setCurrentUser(user);
  };

  const handleSignOut = async () => {
    await logout();
    setCurrentUser(null);
  };

  if (currentUser) {
    return <Dashboard user={currentUser} onSignOut={handleSignOut} />;
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#F2EDE4" }}
    >
      {/* 3-column flex: left decorations | card | right decorations */}
      <div className="flex items-center justify-center w-full max-w-5xl px-4 py-10 gap-0 md:gap-4 lg:gap-6">

        {/* z-0: left decorative panel — pointer-events-none */}
        <LeftPanel />

        {/* z-50: the card — always fully interactive */}
        <div className="relative z-50 flex-shrink-0 w-full max-w-[460px]">
          <AuthCard onLoginSuccess={handleLoginSuccess} />
        </div>

        {/* z-0: right decorative panel — pointer-events-none */}
        <RightPanel />

      </div>

      {/* Footer — below card in DOM, z-10 so it stays above background */}
      <footer className="relative z-10 pb-6 flex items-center gap-3 text-xs text-gray-400">
        <span>Copyright @wework 2022</span>
        <span className="text-gray-300">|</span>
        <a
          href="#"
          className="hover:text-gray-600 transition-colors hover:underline underline-offset-2 cursor-pointer"
        >
          Privacy Policy
        </a>
      </footer>
    </div>
  );
}
