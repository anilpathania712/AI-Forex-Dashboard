import React, { useState } from "react";
import RiskCalculator from "./components/RiskCalculator";
import BacktestResults from "./components/BacktestResults";
import Chart from "./components/Chart";
import Header from "./components/Header";
import TradeHistory from "./components/TradeHistory";
import PaperTrader from "./components/PaperTrader";

function App() {
  // Central state for the selected pair
  const [selectedPair, setSelectedPair] = useState("EURUSD");
  const [tradeHistory, setTradeHistory] = useState([]);

  return (
    <div className="min-h-screen bg-[#0b1120] text-white font-sans">
      
      {/* Dynamic Header */}
      <Header pair={selectedPair} setPair={setSelectedPair} />

      {/* Main Content */}
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (Chart & History) */}
          <div className="lg:col-span-2 space-y-6">
             <Chart pair={selectedPair} />
<BacktestResults pair={selectedPair} />
<TradeHistory trades={tradeHistory} />
          </div>

          {/* Right Column (Tools) */}
          <div className="space-y-6">
            <PaperTrader 
  pair={selectedPair} 
  setTradeHistory={setTradeHistory} 
/>
            <RiskCalculator />
            
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;