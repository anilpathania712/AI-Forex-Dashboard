import React, { useState, useEffect } from "react";
import axios from "axios";

const PaperTrader = ({ pair, setTradeHistory }) => {
  const [balance, setBalance] = useState(10000);
  const [positions, setPositions] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [lotSize, setLotSize] = useState(0.1);
  const [message, setMessage] = useState("");

  // Load saved data from LocalStorage on startup
  useEffect(() => {
    const savedBalance = localStorage.getItem("paper_balance");
    const savedPositions = localStorage.getItem("paper_positions");
    const savedHistory = localStorage.getItem("paper_history");

    if (savedBalance) setBalance(parseFloat(savedBalance));
    if (savedPositions) setPositions(JSON.parse(savedPositions));
    if (savedHistory) setTradeHistory(JSON.parse(savedHistory));
  }, []);

  // Fetch current price every 5 seconds
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/signals/${pair}`);
        setCurrentPrice(res.data.price);
      } catch (e) {
        console.error("Failed to update price");
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 5000);
    return () => clearInterval(interval);
  }, [pair]);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem("paper_balance", balance.toString());
    localStorage.setItem("paper_positions", JSON.stringify(positions));
  }, [balance, positions]);

  const openTrade = (type) => {
    if (currentPrice === 0) return;

    const trade = {
      id: Date.now(),
      pair: pair,
      type: type,
      entryPrice: currentPrice,
      lotSize: parseFloat(lotSize),
      timestamp: new Date().toLocaleTimeString(),
    };

    setPositions([...positions, trade]);
    setMessage(`Opened ${type} ${lotSize} Lots on ${pair} @ ${currentPrice}`);
    setTimeout(() => setMessage(""), 3000);
  };

  const closeTrade = (trade) => {
    let pips;
    if (trade.type === "BUY") {
      pips = currentPrice - trade.entryPrice;
    } else {
      pips = trade.entryPrice - currentPrice;
    }

    const profit = pips * trade.lotSize * 100000 * 0.0001;

    setBalance((prev) => prev + profit);

    const closedTrade = {
      entry: trade.entryPrice,
      exit: currentPrice,
      profit: profit,
      type: trade.type,
      lotSize: trade.lotSize,
      pair: trade.pair,
      timestamp: new Date().toLocaleString(),
    };

    setTradeHistory(prev => [closedTrade, ...prev]);
    setPositions(positions.filter((p) => p.id !== trade.id));

    setMessage(`Closed trade: Profit $${profit.toFixed(2)}`);
    setTimeout(() => setMessage(""), 3000);
  };

  const calculateFloatingPL = (trade) => {
    if (!currentPrice) return 0;
    let pips = trade.type === "BUY"
      ? (currentPrice - trade.entryPrice)
      : (trade.entryPrice - currentPrice);

    return (pips * trade.lotSize * 100000 * 0.0001);
  };

  const totalEquity = balance + positions.reduce((acc, t) => acc + calculateFloatingPL(t), 0);

  return (
    <div className="glass-card p-5 space-y-4">

      {/* Header */}
      <div className="section-header">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(251, 191, 36, 0.12), rgba(245, 158, 11, 0.12))",
              border: "1px solid rgba(251, 191, 36, 0.15)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <span className="section-title">Virtual Trading</span>
        </div>
        <span className="badge badge-amber">Paper Mode</span>
      </div>

      {/* Balance & Equity */}
      <div className="grid grid-cols-2 gap-3">
        <div className="stat-card text-center">
          <p className="text-[10px] font-semibold tracking-widest uppercase mb-1" style={{ color: "#64748b" }}>Balance</p>
          <p className="text-lg font-bold font-mono text-white">${balance.toFixed(2)}</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-[10px] font-semibold tracking-widest uppercase mb-1" style={{ color: "#64748b" }}>Equity</p>
          <p className={`text-lg font-bold font-mono ${totalEquity >= balance ? 'text-emerald-400' : 'text-rose-400'}`}>
            ${totalEquity.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Live Price */}
      <div
        className="text-center py-3 rounded-xl"
        style={{
          background: "linear-gradient(135deg, rgba(34, 211, 238, 0.06), rgba(59, 130, 246, 0.06))",
          border: "1px solid rgba(34, 211, 238, 0.1)",
        }}
      >
        <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "#22d3ee" }}>
          Live Price
        </p>
        <p className="text-2xl font-mono font-bold text-white mt-1 tabular-nums">{currentPrice}</p>
      </div>

      {/* Trading Controls */}
      <div className="space-y-3">
        <input
          type="number"
          value={lotSize}
          onChange={(e) => setLotSize(e.target.value)}
          className="input-modern font-mono"
          placeholder="Lot Size (e.g. 0.1)"
        />
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => openTrade("BUY")} className="btn-trade btn-buy">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
            </svg>
            BUY
          </button>
          <button onClick={() => openTrade("SELL")} className="btn-trade btn-sell">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
            </svg>
            SELL
          </button>
        </div>
      </div>

      {/* Toast */}
      {message && (
        <div className="trade-toast">{message}</div>
      )}

      {/* Open Positions */}
      {positions.length > 0 && (
        <div className="space-y-2 pt-2">
          <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "#64748b" }}>
            Open Positions ({positions.length})
          </p>
          {positions.map((pos) => {
            const pl = calculateFloatingPL(pos);
            return (
              <div
                key={pos.id}
                className="flex justify-between items-center p-3 rounded-xl text-sm animate-slide-in"
                style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.04)",
                }}
              >
                <div>
                  <span className={`font-bold text-xs ${pos.type === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {pos.type}
                  </span>
                  <span className="text-xs ml-2" style={{ color: "#94a3b8" }}>{pos.lotSize} Lots</span>
                  <p className="text-xs font-mono mt-0.5" style={{ color: "#64748b" }}>{pos.entryPrice.toFixed(5)}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold font-mono text-sm ${pl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {pl >= 0 ? '+' : ''}{pl.toFixed(2)} $
                  </p>
                  <button
                    onClick={() => closeTrade(pos)}
                    className="text-[11px] mt-0.5 font-medium transition-colors cursor-pointer"
                    style={{ color: "#64748b" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#f1f5f9"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#64748b"}
                  >
                    Close Position
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PaperTrader;