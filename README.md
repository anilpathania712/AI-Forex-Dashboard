# AI Forex Dashboard 📊
A comprehensive, all-in-one Forex trading dashboard built with FastAPI and React. This application provides real-time market data, AI-generated trading signals, strategy backtesting, and a risk-free paper trading environment.
Python - 3.9+
React - 18+
# Key Features
- Real-Time Market Data: Integrated with TradingView widgets for professional charting.
- AI Trading Signals: Generates BUY/SELL signals based on RSI and MACD technical indicators using yfinance and pandas_ta.
- Strategy Backtesting: Visualize historical strategy performance with an interactive equity curve chart.
- Paper Trading Simulator: Practice trading with virtual money ($10,000 starting balance). Positions and history are persisted via LocalStorage.
- Position Size Calculator: Built-in risk management tool to calculate lot sizes based on account balance and stop loss.
- Dynamic Pair Selection: Supports Major pairs, JPY crosses, and Metals (XAUUSD).
