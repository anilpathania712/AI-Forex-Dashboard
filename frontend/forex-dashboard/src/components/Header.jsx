import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

const Header = ({ pair, setPair }) => {
  const [signal, setSignal] = useState(null);
  const [pairGroups, setPairGroups] = useState({});

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

  return (
    <header className="bg-[#0b1120]/80 backdrop-blur-md border-b border-white/10 px-8 py-4 flex justify-between items-center sticky top-0 z-50">

      {/* Left Section */}
      <div className="flex items-center gap-6">

        <h1 className="text-2xl font-bold tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
          AI Forex Terminal
        </h1>

        {/* Professional Searchable Dropdown */}
        <div className="w-64">
          <Select
            options={formattedOptions}
            value={
              pair
                ? { label: pair, value: pair }
                : null
            }
            onChange={(selected) => setPair(selected.value)}
            placeholder="Search Pair..."
            isSearchable
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#111827",
                borderColor: "#1f2937",
                color: "white",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#111827",
              }),
              singleValue: (base) => ({
                ...base,
                color: "white",
              }),
            }}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary25: "#0ea5e9",
                primary: "#06b6d4",
              },
            })}
          />
        </div>

      </div>

      {/* Signal section stays same */}
      <div className="flex items-center gap-4">
        {signal ? (
          <div className="flex items-center gap-3 bg-[#111827] px-4 py-2 rounded-lg border border-white/5">
            <span className="text-gray-400 text-xs uppercase tracking-wider">
              Current Signal
            </span>

            <span
              className={`flex items-center gap-2 font-bold text-lg ${
                signal.signal === "BUY"
                  ? "text-green-400"
                  : signal.signal === "SELL"
                  ? "text-red-400"
                  : "text-yellow-400"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  signal.signal === "BUY"
                    ? "bg-green-400 animate-ping"
                    : signal.signal === "SELL"
                    ? "bg-red-400 animate-ping"
                    : "bg-yellow-400"
                }`}
              ></span>
              {signal.signal}
            </span>
          </div>
        ) : (
          <span className="text-gray-500 text-sm">Connecting...</span>
        )}
      </div>

    </header>
  );
};

export default Header;