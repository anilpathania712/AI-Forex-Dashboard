import { useEffect, useState } from "react";
import axios from "axios";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading.json";

const BacktestResults = ({ pair }) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Function to fetch data (allows manual refresh)
    const fetchData = async () => {
        if (!pair) return;

        setLoading(true);
        setError(null);
        setData(null);

        const startTime = Date.now();

        try {
            const res = await axios.get(
                `http://localhost:8000/backtest/${pair}`,
                { params: { t: new Date().getTime() } }
            );

            const rawData = res.data;

            if (!rawData.trades) {
                rawData.trades = [];
            }

            let cumulative = 0;
            const equityCurve = rawData.trades.map((trade, index) => {
                cumulative += trade.profit;
                return { name: `T${index + 1}`, uv: cumulative };
            });

            // ⏳ Ensure minimum loading time (2 seconds)
            const elapsed = Date.now() - startTime;
            const remainingTime = Math.max(1000 - elapsed, 0);

            setTimeout(() => {
                setData({ ...rawData, equityCurve });
                setLoading(false);
            }, remainingTime);

        } catch (err) {
            console.error(err);
            setError("Failed to load backtest data.");
            setLoading(false);
        }
    };
    // Fetch data on initial load or when pair changes
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pair]);

    if (error) return (
        <div className="bg-[#111827] p-6 rounded-2xl border border-red-500/20 text-red-400">
            Error: {error}
        </div>
    );

    if (!data && loading) return (
        <div className="bg-[#111827] p-6 rounded-2xl border border-white/5 h-80 flex flex-col items-center justify-center">

            <Lottie
                animationData={loadingAnimation}
                loop
                style={{ height: 200, width: 200 }}
            />

            <p className="text-gray-400 mt-4">Optimizing Strategy...</p>

        </div>
    );

    // Helper icon component
    const RefreshIcon = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`w-5 h-5 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`}
        >
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
        </svg>
    );

    return (
        <div className="bg-[#111827] p-6 rounded-2xl shadow-lg border border-white/5 space-y-6">
            <h2 className="text-xl font-bold border-b border-white/10 pb-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                    Backtest Performance
                    {/* Refresh Button */}
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="text-gray-500 hover:text-cyan-400 transition-colors disabled:cursor-not-allowed focus:outline-none"
                        title="Refresh Data"
                    >
                        <RefreshIcon />
                    </button>
                </div>
                <span className="text-xs font-normal px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded-full">{pair}</span>
            </h2>

            {/* Warning message if no trades */}
            {data && data.total_trades === 0 && (
                <div className="bg-yellow-500/10 text-yellow-400 p-4 rounded-lg text-sm">
                    {data.message || "No trades found for this period."}
                </div>
            )}

            {/* KPI Grid */}
            {data && (
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: "Total Return", value: `${data.total_return} pips`, color: data.total_return >= 0 ? 'text-green-400' : 'text-red-400' },
                        { label: "Win Rate", value: `${data.win_rate}%`, color: 'text-white' },
                        { label: "Profit Factor", value: data.profit_factor, color: 'text-blue-400' },
                        { label: "Total Trades", value: data.total_trades, color: 'text-gray-300' },
                    ].map((kpi) => (
                        <div key={kpi.label} className="bg-[#0f172a] p-3 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1 uppercase">{kpi.label}</p>
                            <p className={`text-lg font-bold ${kpi.color}`}>{kpi.value}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Equity Curve Chart - Only render if we have trades */}
            {data && data.trades.length > 0 && (
                <div className="h-56 w-full bg-[#0b1220] rounded-xl p-4 border border-white/5">
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-xs text-gray-400 uppercase tracking-wider">
                            Equity Curve
                        </p>
                        <span className={`text-sm font-semibold ${data.total_return >= 0 ? "text-green-400" : "text-red-400"
                            }`}>
                            {data.total_return >= 0 ? "+" : ""}
                            {data.total_return} pips
                        </span>
                    </div>

                    <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={data.equityCurve}>
                            <defs>
                                {/* Gradient Fill */}
                                <linearGradient id="modernGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.4} />
                                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                                </linearGradient>

                                {/* Glow Effect */}
                                <filter id="glow">
                                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#22d3ee" />
                                </filter>
                            </defs>

                            <XAxis
                                dataKey="name"
                                stroke="#475569"
                                tick={{ fill: '#94a3b8', fontSize: 10 }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <YAxis
                                stroke="#475569"
                                tick={{ fill: '#94a3b8', fontSize: 10 }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#0f172a",
                                    border: "1px solid rgba(255,255,255,0.05)",
                                    borderRadius: "12px",
                                    color: "#fff"
                                }}
                                labelStyle={{ color: "#94a3b8" }}
                                cursor={{ stroke: "#22d3ee", strokeOpacity: 0.2 }}
                            />

                            <Area
                                type="monotone"
                                dataKey="uv"
                                stroke="#22d3ee"
                                strokeWidth={3}
                                fill="url(#modernGradient)"
                                filter="url(#glow)"
                                dot={false}
                                activeDot={{ r: 6, fill: "#22d3ee", stroke: "#fff", strokeWidth: 2 }}
                                animationDuration={1200}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default BacktestResults;