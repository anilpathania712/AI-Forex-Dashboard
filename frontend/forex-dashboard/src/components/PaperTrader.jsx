import React, { useState, useEffect } from "react";
import axios from "axios";
import TradeHistory from "./TradeHistory";

const PaperTrader = ({ pair, setTradeHistory }) => {
  // State for the simulator
  const [balance, setBalance] = useState(10000); // Virtual Money
  const [positions, setPositions] = useState([]); // Open trades
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

  // Fetch current price every 5 seconds to update P/L
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
    const interval = setInterval(fetchPrice, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [pair]);

  // Save to LocalStorage whenever balance or positions change
 useEffect(() => {
  localStorage.setItem("paper_balance", balance.toString());
  localStorage.setItem("paper_positions", JSON.stringify(positions));
}, [balance, positions]);
  // EXECUTE TRADE
  const openTrade = (type) => {
    if (currentPrice === 0) return;

    // Simple calculation: 1 Standard Lot = 100,000 units
    // For Forex, 1 pip move on 1 lot is approx $10.
    // We will simplify: Profit = (Exit - Entry) * LotSize * 100,000 * PipValue
    // To keep it simple for UI: Multiplier = 10 (1 lot = $10/pip)
    
    const trade = {
      id: Date.now(),
      pair: pair,
      type: type, // "BUY" or "SELL"
      entryPrice: currentPrice,
      lotSize: parseFloat(lotSize),
      timestamp: new Date().toLocaleTimeString(),
    };

    setPositions([...positions, trade]);
    setMessage(`Opened ${type} ${lotSize} Lots on ${pair} @ ${currentPrice}`);
    setTimeout(() => setMessage(""), 3000);
  };

  // CLOSE TRADE
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

  // Remove from open positions
  setPositions(positions.filter((p) => p.id !== trade.id));

  setMessage(`Closed trade: Profit $${profit.toFixed(2)}`);
  setTimeout(() => setMessage(""), 3000);
};

  // Calculate Floating P/L for open positions
  const calculateFloatingPL = (trade) => {
    if (!currentPrice) return 0;
    let pips = trade.type === "BUY" 
      ? (currentPrice - trade.entryPrice) 
      : (trade.entryPrice - currentPrice);
      
    return (pips * trade.lotSize * 100000 * 0.0001);
  };

  const totalEquity = balance + positions.reduce((acc, t) => acc + calculateFloatingPL(t), 0);

  return (
    <div className="bg-[#111827] p-6 rounded-2xl shadow-lg border border-white/5 space-y-4">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <h2 className="text-xl font-bold text-white">Virtual Trading</h2>
        <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded font-bold">PAPER MODE</span>
      </div>

      {/* Account Info */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-[#0f172a] p-3 rounded-lg">
          <p className="text-xs text-gray-500 uppercase">Balance</p>
          <p className="text-xl font-bold text-white">${balance.toFixed(2)}</p>
        </div>
        <div className="bg-[#0f172a] p-3 rounded-lg">
          <p className="text-xs text-gray-500 uppercase">Equity</p>
          <p className={`text-xl font-bold ${totalEquity >= balance ? 'text-green-400' : 'text-red-400'}`}>
            ${totalEquity.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Current Price Display */}
      <div className="text-center py-2 bg-cyan-900/20 rounded-lg border border-cyan-500/10">
        <p className="text-xs text-cyan-400 uppercase tracking-widest">Live Price</p>
        <p className="text-2xl font-mono font-bold text-white">{currentPrice}</p>
      </div>

      {/* Trading Controls */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <input 
            type="number" 
            value={lotSize} 
            onChange={(e) => setLotSize(e.target.value)}
            className="w-full p-3 bg-[#0f172a] border border-white/10 rounded-lg text-white"
            placeholder="Lot Size (e.g. 0.1)"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => openTrade("BUY")}
            className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-lg font-bold transition-all shadow-lg shadow-green-500/20"
          >
            BUY
          </button>
          <button 
            onClick={() => openTrade("SELL")}
            className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-lg font-bold transition-all shadow-lg shadow-red-500/20"
          >
            SELL
          </button>
        </div>
      </div>

      {/* Message / Notification */}
      {message && (
        <div className="text-center text-sm text-cyan-300 animate-pulse bg-cyan-900/20 py-1 rounded">
          {message}
        </div>
      )}

      {/* Open Positions List */}
      {positions.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="text-sm text-gray-400 uppercase font-semibold">Open Positions</h3>
          {positions.map((pos) => {
            const pl = calculateFloatingPL(pos);
            return (
              <div key={pos.id} className="flex justify-between items-center bg-[#0f172a] p-3 rounded-lg text-sm">
                <div>
                  <span className={`font-bold ${pos.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                    {pos.type}
                  </span>
                  <span className="text-gray-400 ml-2">{pos.lotSize} Lots</span>
                  <p className="text-xs text-gray-500">{pos.entryPrice.toFixed(5)}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold font-mono ${pl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {pl >= 0 ? '+' : ''}{pl.toFixed(2)} $                   </p>
                  <button 
                    onClick={() => closeTrade(pos)}
                    className="text-xs text-gray-400 hover:text-white underline mt-1"
                  >
                    Close
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