import React, { useState } from "react";

const TradeHistory = ({ trades }) => {
  const [showAll, setShowAll] = useState(false);

  if (!trades || trades.length === 0) {
    return (
      <div className="bg-[#111827] p-6 rounded-2xl shadow-lg border border-white/5 mt-6">
        <h2 className="text-xl font-bold mb-4 text-white">Recent Trade History</h2>
        <p className="text-gray-500 text-sm">No trades yet</p>
      </div>
    );
  }

  const visibleTrades = showAll ? trades : trades.slice(0, 3);

  return (
    <div className="bg-[#111827] p-6 rounded-2xl shadow-lg border border-white/5 mt-6">
      <h2 className="text-xl font-bold mb-4 text-white">Recent Trade History</h2>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm">
          <thead className="text-gray-500 border-b border-white/10">
            <tr>
              <th className="text-left p-3 font-medium">S.No</th>
              <th className="text-left p-3 font-medium">Entry Price</th>
              <th className="text-left p-3 font-medium">Exit Price</th>
              <th className="text-right p-3 font-medium">P/L ($)</th>
            </tr>
          </thead>

          <tbody>
            {visibleTrades.map((trade, index) => (
              <tr
                key={index}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="p-3 text-gray-400">{index + 1}</td>
                <td className="p-3 text-white font-mono">
                  {trade.entry?.toFixed(5)}
                </td>
                <td className="p-3 text-white font-mono">
                  {trade.exit?.toFixed(5)}
                </td>
                <td
                  className={`p-3 text-right font-bold font-mono ${
                    trade.profit > 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {trade.profit > 0 ? "+" : ""}
                  {trade.profit?.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View More / Show Less Button */}
      {trades.length > 5 && (
        <div className="text-center mt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-cyan-400 hover:text-cyan-300 underline transition"
          >
            {showAll ? "Show Less" : `View More (${trades.length - 5} more)`}
          </button>
        </div>
      )}
    </div>
  );
};

export default TradeHistory;