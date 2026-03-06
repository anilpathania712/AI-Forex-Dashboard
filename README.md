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

# 🎨 Modern UI Design

The frontend features a premium **trading terminal** aesthetic with:

- **Glassmorphism Cards** — Semi-transparent panels with backdrop blur and subtle gradient borders
- **Inter + JetBrains Mono** fonts — Professional sans-serif typography paired with monospace for prices/data
- **Micro-Animations** — Staggered fade-in entrances, pulse-glow signal indicators, and smooth hover effects
- **Gradient Trade Buttons** — Multi-stop gradient BUY/SELL buttons with glow shadows and lift-on-hover
- **Live Clock** — Real-time clock in the header for a terminal-style experience
- **CSS Design System** — Centralized custom properties, reusable utility classes (`.glass-card`, `.stat-card`, `.input-modern`, `.btn-trade`), and keyframe animations
- **Custom Scrollbar** — Minimal styled scrollbar matching the dark theme
- **Responsive Layout** — Adaptive grid that works across desktop and tablet viewports

# 🛠️ Tech Stack

## Backend:

- Python 3.9+
- FastAPI
- yfinance (Market Data)
- pandas_ta (Technical Analysis)
- NumPy & Pandas

## Frontend:

- React 19 (Vite 7)
- Tailwind CSS v4
- Recharts (Data Visualization)
- Axios
- React Select
- Lottie React (Loading Animations)
- Google Fonts (Inter, JetBrains Mono)

# Installation & Setup

### Follow these steps to run the project locally.

## Prerequisites

- Node.js & npm installed
- Python 3.9+ installed

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd AI-Forex-Dashboard
```

### 2. Backend Setup (Python/FastAPI)

#### 1. Navigate to the backend folder (where main.py is located).

#### 2. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### 3. Install dependencies:

```bash
 pip install fastapi uvicorn yfinance pandas pandas_ta numpyRun the server:
```

#### 4. Run the server:

```bash
python main.py
```

- The API will be running at http://localhost:8000

### 3. Frontend Setup (React)

#### 1. Navigate to the frontend folder.

#### 2. Install dependencies:

```bash
npm install axios react-select recharts lottie-react
```

(Ensure Tailwind CSS is configured in your project).

#### 3. Run the development server:

```bash
npm run dev
```

The app will be running at http://localhost:5173

# 🔌 API Endpoints

| Method | Endpoint           | Description                                   |
| ------ | ------------------ | --------------------------------------------- |
| GET    | `/`                | Root health check                             |
| GET    | `/pairs`           | Returns list of available forex pairs         |
| GET    | `/signals/{pair}`  | Returns current price, RSI, MACD, and signal  |
| GET    | `/backtest/{pair}` | Returns backtest statistics and trade history |

# ⚙️ Logic Overview

## Signal Generation

#### The /signals endpoint calculates:

- RSI (14): If RSI < 30 ➔ **BUY**. If RSI > 70 ➔ SELL.
- MACD (12, 26, 9): Used for trend confirmation visualization.

## Backtesting

#### The /backtest endpoint simulates a simple RSI reversal strategy over the last 6 months (1h timeframe):

- Entry: Buy when RSI drops below 30.
- Exit: Sell when RSI rises above 70.
- Metrics: Calculates Win Rate, Profit Factor, Max Drawdown, and Total Return in pips.

# 🎨 Customization

- Adding Pairs: Modify the /pairs endpoint in main.py to add more currency pairs.
- Strategy Logic: Edit the get_signals or backtest functions in main.py to implement different indicators (e.g., Bollinger Bands, Moving Averages).
- Styling: The frontend uses a custom CSS design system built on Tailwind CSS v4. Edit `src/index.css` to change colors, animations, and card styles via CSS custom properties. Component-level styling uses reusable classes like `.glass-card`, `.stat-card`, and `.btn-trade`.

# 📜 License

This project is open-source and available under the MIT License.
