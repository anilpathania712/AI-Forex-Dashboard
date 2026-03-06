import React, { useState } from "react";
import RiskCalculator from "./components/RiskCalculator";
import BacktestResults from "./components/BacktestResults";
import Chart from "./components/Chart";
import Header from "./components/Header";
import TradeHistory from "./components/TradeHistory";
import PaperTrader from "./components/PaperTrader";

function App() {
  const [selectedPair, setSelectedPair] = useState("EURUSD");
  const [tradeHistory, setTradeHistory] = useState([]);

  return (
    <div className="min-h-screen text-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Header */}
      <Header pair={selectedPair} setPair={setSelectedPair} />

      {/* Main Content */}
      <main className="px-4 py-6 sm:px-6 lg:px-8 max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* Left Column — Chart & Backtest */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-5">
            <div className="animate-fade-in-up delay-1">
              <Chart pair={selectedPair} />
            </div>
            <div className="animate-fade-in-up delay-3">
              <BacktestResults pair={selectedPair} />
            </div>
          </div>

          {/* Right Column — Trading & Tools */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-5">
            <div className="animate-fade-in-up delay-2">
              <PaperTrader
                pair={selectedPair}
                setTradeHistory={setTradeHistory}
              />
            </div>
            <div className="animate-fade-in-up delay-4">
              <RiskCalculator />
            </div>
            <div className="animate-fade-in-up delay-5">
              <TradeHistory trades={tradeHistory} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;