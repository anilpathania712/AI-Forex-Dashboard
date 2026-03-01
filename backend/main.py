from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import pandas as pd
import pandas_ta as ta
import numpy as np

app = FastAPI(title="AI Forex Signal API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Forex AI Running 🚀"}

@app.get("/pairs")
def get_pairs():
    return {
        "Majors": [
            "EURUSD", "GBPUSD", "USDJPY", "USDCHF",
            "AUDUSD", "USDCAD", "NZDUSD"
        ],
        "JPY Crosses": [
            "EURJPY", "GBPJPY", "AUDJPY", "CHFJPY"
        ],
        "Metals": [
            "XAUUSD"
        ]
    }

# Helper function to safely get dataframe
def get_forex_data(pair, period, interval):
    try:
        # Yahoo finance format for forex pairs is usually PAIR=X
        df = yf.download(pair + "=X", period=period, interval=interval, progress=False)
        
        if df.empty:
            return None
            
        # Flatten MultiIndex columns if they exist (common in yfinance)
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)
            
        return df
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None

@app.get("/signals/{pair}")
def get_signals(pair: str):
    df = get_forex_data(pair, "1mo", "1h")
    
    if df is None or df.empty:
        raise HTTPException(status_code=404, detail="No data found for pair")

    try:
        # Calculate RSI
        df["RSI"] = ta.rsi(df["Close"], length=14)
        
        # Calculate MACD
        macd_df = ta.macd(df["Close"])
        if macd_df is not None:
            # Concatenate safely
            df = pd.concat([df, macd_df], axis=1)
        
        # Drop NaN values created by indicators
        df.dropna(inplace=True)
        
        if df.empty:
             raise HTTPException(status_code=500, detail="Data empty after calculation")

        latest = df.iloc[-1]

        # Safe access to MACD column (name varies by pandas_ta version)
        macd_val = 0.0
        # Try finding the MACD column by partial name match
        macd_cols = [c for c in df.columns if 'MACD_12_26_9' in c]
        if macd_cols:
            macd_val = latest[macd_cols[0]]
        elif 'MACD_12_26_9' in latest:
             macd_val = latest['MACD_12_26_9']

        signal = "HOLD"
        if latest["RSI"] < 30:
            signal = "BUY"
        elif latest["RSI"] > 70:
            signal = "SELL"

        return {
            "pair": pair,
            "price": round(float(latest["Close"]), 5),
            "rsi": round(float(latest["RSI"]), 2),
            "macd": round(float(macd_val), 5),
            "signal": signal
        }

    except Exception as e:
        print(f"Calculation Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/backtest/{pair}")
def backtest(pair: str):
    df = get_forex_data(pair, "6mo", "1h")

    if df is None or df.empty:
        raise HTTPException(status_code=404, detail="No data found")

    try:
        df["RSI"] = ta.rsi(df["Close"], length=14)
        df.dropna(inplace=True)

        position = None
        entry_price = 0.0
        trades = []
        trade_history = []

        for i in range(len(df)):
            rsi = df["RSI"].iloc[i]
            price = df["Close"].iloc[i]

            # BUY entry
            if rsi < 30 and position is None:
                position = "BUY"
                entry_price = price

            # SELL exit
            elif rsi > 70 and position == "BUY":
                profit = price - entry_price
                trades.append(profit)
                trade_history.append({
                    "entry": float(entry_price),
                    "exit": float(price),
                    "profit": float(profit)
                })
                position = None

        if len(trades) == 0:
            # Return valid empty structure instead of error to prevent frontend crash
            return {
                "pair": pair,
                "total_trades": 0,
                "win_rate": 0,
                "profit_factor": 0,
                "total_return": 0,
                "max_drawdown": 0,
                "trades": [],
                "message": "No trades generated in this period."
            }

        trades_arr = np.array(trades)
        wins = trades_arr[trades_arr > 0]
        losses = trades_arr[trades_arr < 0]

        win_rate = (len(wins) / len(trades_arr)) * 100
        profit_factor = abs(wins.sum() / losses.sum()) if len(losses) > 0 and losses.sum() != 0 else 0
        total_return = trades_arr.sum()

        # Max Drawdown
        equity_curve = np.cumsum(trades_arr)
        peak = np.maximum.accumulate(equity_curve)
        drawdown = peak - equity_curve
        max_drawdown = drawdown.max()

        return {
            "pair": pair,
            "total_trades": len(trades_arr),
            "win_rate": round(float(win_rate), 2),
            "profit_factor": round(float(profit_factor), 2),
            "total_return": round(float(total_return), 5),
            "max_drawdown": round(float(max_drawdown), 5),
            "trades": trade_history
        }

    except Exception as e:
        print(f"Backtest Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",      
        host="127.0.0.1",
        port=8000,
        reload=True   
    )