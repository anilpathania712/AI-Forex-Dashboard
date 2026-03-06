import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

const Header = ({ pair, setPair }) => {
  const [signal, setSignal] = useState(null);
  const [pairGroups, setPairGroups] = useState({});
  const [clock, setClock] = useState("");

  // Live clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Load pairs dynamically
  useEffect(() => {
    axios.get("http://localhost:8000/pairs")
      .then(res => setPairGroups(res.data))
      .catch(() => console.error("Failed to load pairs"));
  }, []);

  // Fetch signal when pair changes
  useEffect(() => {
    if (!pair) return;
    axios.get(`http://localhost:8000/signals/${pair}`)
      .then(res => setSignal(res.data))
      .catch(() => console.error("Failed to fetch signal"));
  }, [pair]);

  // Convert API data to React Select format
  const formattedOptions = Object.entries(pairGroups).map(([groupName, pairs]) => ({
    label: groupName,
    options: pairs.map(p => ({ label: p, value: p }))
  }));

  const signalColor = signal?.signal === "BUY" ? "#34d399" : signal?.signal === "SELL" ? "#f43f5e" : "#fbbf24";

  // Custom styles for react-select
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "rgba(15, 23, 42, 0.8)",
      borderColor: state.isFocused ? "rgba(34, 211, 238, 0.5)" : "rgba(255, 255, 255, 0.08)",
      borderRadius: "12px",
      padding: "2px 4px",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(34, 211, 238, 0.1)" : "none",
      minHeight: "42px",
      transition: "all 0.25s ease",
      "&:hover": { borderColor: "rgba(255, 255, 255, 0.15)" },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#0f172a",
      borderRadius: "12px",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "0 16px 48px -12px rgba(0, 0, 0, 0.6)",
      overflow: "hidden",
      padding: "4px",
    }),
    menuList: (base) => ({
      ...base,
      padding: 0,
    }),
    group: (base) => ({
      ...base,
      paddingTop: 4,
      paddingBottom: 4,
    }),
    groupHeading: (base) => ({
      ...base,
      fontSize: "0.65rem",
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "#64748b",
      paddingLeft: 12,
      paddingBottom: 4,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "rgba(34, 211, 238, 0.1)" : "transparent",
      color: state.isSelected ? "#22d3ee" : "#e2e8f0",
      borderRadius: "8px",
      padding: "8px 12px",
      fontSize: "0.85rem",
      fontWeight: state.isSelected ? 600 : 400,
      cursor: "pointer",
      transition: "background 0.15s ease",
      "&:active": { backgroundColor: "rgba(34, 211, 238, 0.15)" },
    }),
    singleValue: (base) => ({
      ...base,
      color: "#f1f5f9",
      fontWeight: 600,
      fontSize: "0.9rem",
    }),
    input: (base) => ({
      ...base,
      color: "#f1f5f9",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#64748b",
      fontSize: "0.85rem",
    }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#64748b",
      padding: "4px",
      "&:hover": { color: "#94a3b8" },
    }),
  };

  return (
    <header
      className="sticky top-0 z-50 animate-fade-in"
      style={{
        background: "rgba(6, 13, 31, 0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
      }}
    >
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">

        {/* Left — Logo + Pair Selector */}
        <div className="flex items-center gap-5">

          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(34, 211, 238, 0.15), rgba(59, 130, 246, 0.15))",
                border: "1px solid rgba(34, 211, 238, 0.2)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight gradient-text leading-tight">
                AI Forex Terminal
              </h1>
              <p className="text-[10px] font-medium tracking-wider uppercase" style={{ color: "#64748b" }}>
                Live Trading Dashboard
              </p>
            </div>
          </div>

          {/* Pair Selector */}
          <div className="w-56 hidden sm:block">
            <Select
              options={formattedOptions}
              value={pair ? { label: pair, value: pair } : null}
              onChange={(selected) => setPair(selected.value)}
              placeholder="Search pair…"
              isSearchable
              styles={selectStyles}
            />
          </div>
        </div>

        {/* Right — Signal + Clock */}
        <div className="flex items-center gap-4">

          {/* Signal Badge */}
          {signal ? (
            <div
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
              style={{
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "#64748b" }}>
                Signal
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="relative flex h-2.5 w-2.5"
                >
                  <span
                    className="absolute inset-0 rounded-full animate-ping opacity-75"
                    style={{ backgroundColor: signalColor }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-2.5 w-2.5"
                    style={{ backgroundColor: signalColor }}
                  />
                </span>
                <span
                  className="font-bold text-base tracking-wide"
                  style={{ color: signalColor }}
                >
                  {signal.signal}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(15, 23, 42, 0.6)" }}>
              <div className="w-2 h-2 rounded-full bg-yellow-500/50 animate-pulse" />
              <span className="text-xs font-medium" style={{ color: "#64748b" }}>Connecting…</span>
            </div>
          )}

          {/* Clock */}
          <div
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.04)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="font-mono text-sm font-medium tabular-nums" style={{ color: "#94a3b8" }}>
              {clock}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;