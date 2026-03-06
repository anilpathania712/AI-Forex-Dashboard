import React, { useState } from "react";

const TradeHistory = ({ trades }) => {
  const [showAll, setShowAll] = useState(false);

  const isEmpty = !trades || trades.length === 0;
  const visibleTrades = showAll ? trades : trades?.slice(0, 5);

  return (
    <div className="glass-card p-5">

      {/* Header */}
      <div className="section-header">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(52, 211, 153, 0.12), rgba(16, 185, 129, 0.12))",
              border: "1px solid rgba(52, 211, 153, 0.15)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <span className="section-title">Trade History</span>
        </div>
        {!isEmpty && (
          <span
            className="text-xs font-mono font-medium px-2 py-1 rounded-md"
            style={{ background: "rgba(255,255,255,0.04)", color: "#94a3b8" }}
          >
            {trades.length}
          </span>
        )}
      </div>

      {/* Empty State */}
      {isEmpty ? (
        <div className="text-center py-8">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <p className="text-sm font-medium" style={{ color: "#475569" }}>No trades yet</p>
          <p className="text-xs mt-1" style={{ color: "#334155" }}>Execute a trade to see history</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Entry</th>
                  <th>Exit</th>
                  <th className="text-right">P/L ($)</th>
                </tr>
              </thead>
              <tbody>
                {visibleTrades.map((trade, index) => (
                  <tr key={index} className="animate-fade-in">
                    <td className="font-mono" style={{ color: "#64748b" }}>{index + 1}</td>
                    <td className="font-mono font-medium" style={{ color: "#f1f5f9" }}>
                      {trade.entry?.toFixed(5)}
                    </td>
                    <td className="font-mono font-medium" style={{ color: "#f1f5f9" }}>
                      {trade.exit?.toFixed(5)}
                    </td>
                    <td className="text-right font-mono font-bold">
                      <span style={{ color: trade.profit > 0 ? "#34d399" : "#f43f5e" }}>
                        {trade.profit > 0 ? "+" : ""}
                        {trade.profit?.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* View More */}
          {trades.length > 5 && (
            <div className="text-center mt-4">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-xs font-semibold transition-colors cursor-pointer"
                style={{ color: "#22d3ee" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#67e8f9"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#22d3ee"}
              >
                {showAll ? "Show Less ↑" : `View All ${trades.length} Trades ↓`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TradeHistory;