import React, { useState, useEffect } from "react";
import { FaPowerOff, FaSignOutAlt, FaTachometerAlt, FaThermometerHalf, FaHeartbeat, FaDatabase, FaHistory, FaCheckCircle, FaUserCircle } from "react-icons/fa";

export default function Dashboard({ user, onSignOut }) {
  const [motorOn, setMotorOn] = useState(false);
  const [rpm, setRpm] = useState(1200);
  const [copiedUid, setCopiedUid] = useState(false);
  const [systemLogs, setSystemLogs] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // Calculate dynamic temperature based on RPM & Motor state
  const temperature = motorOn ? Math.round(30 + (rpm / 5000) * 55) : 24;

  // Add system logs
  const addLog = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setSystemLogs((prev) => [{ timestamp, message, type }, ...prev.slice(0, 19)]);
  };

  // Copy UID to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(user.uid);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
    addLog("User Unique ID copied to clipboard", "success");
  };

  // Log events on control adjustments
  useEffect(() => {
    addLog(`User signed in via ${user.providerId}. Session active.`, "success");
    // Fetch registered users from the local database
    const db = JSON.parse(localStorage.getItem("registered_users") || "[]");
    setAllUsers(db);
  }, [user]);

  const handlePowerToggle = () => {
    const nextState = !motorOn;
    setMotorOn(nextState);
    addLog(`Motor power toggled ${nextState ? "ON" : "OFF"}`, nextState ? "warning" : "info");
  };

  const handleRpmChange = (e) => {
    const newRpm = parseInt(e.target.value, 10);
    setRpm(newRpm);
  };

  const handleRpmRelease = () => {
    addLog(`Motor Speed adjusted to ${rpm} RPM`, "info");
  };

  return (
    <div className="min-h-screen w-full bg-[#F2EDE4] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* TOP NAVBAR / USER BANNER */}
        <header className="bg-white rounded-[24px] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300">
          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-sm"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-2xl font-bold border-2 border-amber-400">
                <FaUserCircle />
              </div>
            )}
            <div className="text-center md:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
                <h1 className="text-xl font-bold text-gray-900">{user.displayName}</h1>
                <span className="inline-flex self-center items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  {user.providerId} Authenticated
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>
              <div className="mt-2 flex flex-wrap justify-center md:justify-start items-center gap-2">
                <span className="text-[11px] font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                  UID: {user.uid}
                </span>
                <button
                  onClick={copyToClipboard}
                  className="text-[11px] text-amber-500 hover:text-amber-600 font-semibold cursor-pointer underline transition-all"
                >
                  {copiedUid ? "Copied!" : "Copy UID"}
                </button>
              </div>
            </div>
          </div>
          
          <button
            onClick={onSignOut}
            className="flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-amber-500 hover:shadow-lg active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
          >
            <FaSignOutAlt />
            <span>Sign Out</span>
          </button>
        </header>

        {/* METRICS ROW */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* POWER CARD */}
          <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between text-gray-400 text-sm">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Motor Power</span>
              <FaPowerOff className={motorOn ? "text-emerald-500" : "text-gray-300"} />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className={`text-2xl font-bold ${motorOn ? "text-emerald-600" : "text-gray-900"}`}>
                {motorOn ? "ONLINE" : "OFFLINE"}
              </span>
              <button
                onClick={handlePowerToggle}
                className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  motorOn ? "bg-emerald-500" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    motorOn ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* RPM CARD */}
          <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between text-gray-400 text-sm">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Rotational Speed</span>
              <FaTachometerAlt className="text-amber-500" />
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-gray-900">{motorOn ? rpm : 0}</span>
              <span className="text-xs text-gray-400 font-semibold ml-1">RPM</span>
            </div>
          </div>

          {/* TEMPERATURE CARD */}
          <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between text-gray-400 text-sm">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Housing Temp</span>
              <FaThermometerHalf className={temperature > 70 ? "text-rose-500 animate-pulse" : "text-amber-500"} />
            </div>
            <div className="mt-4">
              <span className={`text-3xl font-black ${temperature > 70 ? "text-rose-500" : "text-gray-900"}`}>
                {temperature}
              </span>
              <span className="text-xs text-gray-400 font-semibold ml-1">°C</span>
            </div>
          </div>

          {/* VIBRATION CARD */}
          <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between text-gray-400 text-sm">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Vibration Health</span>
              <FaHeartbeat className={motorOn ? "text-emerald-500" : "text-gray-300"} />
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-gray-900">
                {motorOn ? (rpm > 3500 ? "1.8" : "0.9") : "0.0"}
              </span>
              <span className="text-xs text-gray-400 font-semibold ml-1">mm/s</span>
            </div>
          </div>

        </section>

        {/* SPEED REGULATOR CONTROL PANEL */}
        <section className="bg-white rounded-[24px] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] p-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
            <FaTachometerAlt className="text-amber-500" />
            <span>Speed Regulator Control</span>
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm font-semibold text-gray-600">
              <span>0 RPM</span>
              <span className="text-amber-500 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">
                Target Speed: {rpm} RPM
              </span>
              <span>5000 RPM</span>
            </div>
            <input
              type="range"
              min="100"
              max="5000"
              step="50"
              value={rpm}
              onChange={handleRpmChange}
              onMouseUp={handleRpmRelease}
              onTouchEnd={handleRpmRelease}
              disabled={!motorOn}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {!motorOn && (
              <p className="text-xs text-amber-600 font-medium">
                * Turn the motor power switch ON to calibrate rotational speed values.
              </p>
            )}
          </div>
        </section>

        {/* SYSTEM STATUS LOGS & REGISTERED USERS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* ACTIVITY LOG CARD */}
          <section className="bg-white rounded-[24px] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] p-6 flex flex-col max-h-[350px]">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4 shrink-0">
              <FaHistory className="text-amber-500" />
              <span>System Activity Log</span>
            </h2>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin">
              {systemLogs.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No system activities recorded yet.</p>
              ) : (
                systemLogs.map((log, index) => (
                  <div key={index} className="flex gap-3 text-xs leading-relaxed border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                    <span className="font-mono text-gray-400 shrink-0">{log.timestamp}</span>
                    <span className={`font-medium ${
                      log.type === "success" ? "text-emerald-600" :
                      log.type === "warning" ? "text-amber-600" : "text-gray-600"
                    }`}>
                      {log.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* USER DATABASE VIEWER */}
          <section className="bg-white rounded-[24px] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] p-6 flex flex-col max-h-[350px]">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4 shrink-0">
              <FaDatabase className="text-amber-500" />
              <span>System Database Registry ({allUsers.length})</span>
            </h2>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin">
              {allUsers.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No registered users in the database.</p>
              ) : (
                allUsers.map((u, index) => (
                  <div key={index} className="flex items-center justify-between gap-3 text-xs p-2.5 rounded-xl bg-gray-50 border border-gray-100 hover:border-amber-200 hover:bg-[#FFFDF9] transition-all duration-200">
                    <div className="flex items-center gap-2">
                      {u.photoURL ? (
                        <img src={u.photoURL} alt="" className="w-8 h-8 rounded-full border border-gray-100" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-semibold border border-amber-200">
                          {u.displayName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-gray-900 flex items-center gap-1">
                          <span>{u.displayName}</span>
                          {u.uid === user.uid && (
                            <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-gray-400 font-medium">{u.email}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 text-[9px] font-bold rounded-full bg-gray-200/60 text-gray-500">
                        {u.providerId}
                      </span>
                      <div className="text-[8px] text-gray-400 mt-1 font-mono">
                        Active: {new Date(u.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
        
      </div>
    </div>
  );
}
