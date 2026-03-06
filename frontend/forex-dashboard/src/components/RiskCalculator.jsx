import React, { useState } from "react";

const RiskCalculator = () => {
  const [balance, setBalance] = useState(10000);
  const [riskPercent, setRiskPercent] = useState(1);
  const [stopLoss, setStopLoss] = useState(50);

  const riskAmount = (balance * riskPercent) / 100;
  const positionSize = stopLoss > 0 ? (riskAmount / stopLoss).toFixed(2) : 0;

  return (
    <div className="glass-card p-5 space-y-4">

      {/* Header */}
      <div className="section-header">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(168, 85, 247, 0.12))",
              border: "1px solid rgba(139, 92, 246, 0.2)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
              <rect x="9" y="9" width="6" height="6" />
              <line x1="9" y1="1" x2="9" y2="4" />
              <line x1="15" y1="1" x2="15" y2="4" />
              <line x1="9" y1="20" x2="9" y2="23" />
              <line x1="15" y1="20" x2="15" y2="23" />
              <line x1="20" y1="9" x2="23" y2="9" />
              <line x1="20" y1="14" x2="23" y2="14" />
              <line x1="1" y1="9" x2="4" y2="9" />
              <line x1="1" y1="14" x2="4" y2="14" />
            </svg>
          </div>
          <span className="section-title">Position Calculator</span>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-3">
        <div>
          <label className="block text-[10px] font-semibold tracking-widest uppercase mb-1.5" style={{ color: "#64748b" }}>
            Account Balance ($)
          </label>
          <input
            type="number"
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
            className="input-modern font-mono"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-semibold tracking-widest uppercase mb-1.5" style={{ color: "#64748b" }}>
              Risk %
            </label>
            <input
              type="number"
              value={riskPercent}
              onChange={(e) => setRiskPercent(Number(e.target.value))}
              className="input-modern font-mono"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-widest uppercase mb-1.5" style={{ color: "#64748b" }}>
              Stop Loss (pips)
            </label>
            <input
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(Number(e.target.value))}
              className="input-modern font-mono"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div
        className="p-4 rounded-xl space-y-3"
        style={{
          background: "linear-gradient(135deg, rgba(139, 92, 246, 0.06), rgba(59, 130, 246, 0.06))",
          border: "1px solid rgba(139, 92, 246, 0.12)",
        }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span className="text-sm" style={{ color: "#94a3b8" }}>Risk Amount</span>
          </div>
          <span className="font-bold font-mono text-lg text-rose-400">${riskAmount.toFixed(2)}</span>
        </div>
        <div
          style={{ height: "1px", background: "rgba(255,255,255,0.06)" }}
        />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            <span className="text-sm" style={{ color: "#94a3b8" }}>Lot Size</span>
          </div>
          <span className="font-bold font-mono text-lg text-emerald-400">{positionSize} Lots</span>
        </div>
      </div>
    </div>
  );
};

export default RiskCalculator;