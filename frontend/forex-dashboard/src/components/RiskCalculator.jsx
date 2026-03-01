import React, { useState } from "react";

const RiskCalculator = () => {
  const [balance, setBalance] = useState(10000);
  const [riskPercent, setRiskPercent] = useState(1);
  const [stopLoss, setStopLoss] = useState(50);

  const riskAmount = (balance * riskPercent) / 100;
  const positionSize = stopLoss > 0 ? (riskAmount / stopLoss).toFixed(2) : 0;

  return (
    <div className="bg-[#111827] text-white p-6 rounded-2xl shadow-lg border border-white/5 space-y-4">
      <h2 className="text-xl font-bold border-b border-white/10 pb-4">
        Position Size Calculator
      </h2>

      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1 uppercase">Account Balance ($)</label>
          <input
            type="number"
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
            className="w-full p-3 rounded-lg bg-[#0f172a] border border-white/10 focus:border-cyan-500 focus:outline-none transition-colors text-white text-lg font-medium"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1 uppercase">Risk %</label>
            <input
              type="number"
              value={riskPercent}
              onChange={(e) => setRiskPercent(Number(e.target.value))}
              className="w-full p-3 rounded-lg bg-[#0f172a] border border-white/10 focus:border-cyan-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1 uppercase">Stop Loss (pips)</label>
            <input
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(Number(e.target.value))}
              className="w-full p-3 rounded-lg bg-[#0f172a] border border-white/10 focus:border-cyan-500 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Results Card */}
      <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 p-5 rounded-xl border border-cyan-500/20 mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300 text-sm">Risk Amount</span>
          <span className="font-bold text-red-400 text-xl">${riskAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm">Lot Size</span>
          <span className="font-bold text-green-400 text-xl">{positionSize} Lots</span>
        </div>
      </div>
    </div>
  );
};

export default RiskCalculator;