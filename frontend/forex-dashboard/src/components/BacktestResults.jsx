import { useEffect, useState } from "react";
import axios from "axios";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading.json";

const BacktestResults = ({ pair }) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

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
            if (!rawData.trades) rawData.trades = [];

            let cumulative = 0;
            const equityCurve = rawData.trades.map((trade, index) => {
                cumulative += trade.profit;
                return { name: `T${index + 1}`, uv: cumulative };
            });

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

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pair]);

    if (error) return (
        <div className="glass-card p-6" style={{ borderColor: "rgba(244, 63, 94, 0.2)" }}>
            <div className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <span className="text-rose-400 text-sm font-medium">Error: {error}</span>
            </div>
        </div>
    );

    if (!data && loading) return (
        <div className="glass-card p-6 h-80 flex flex-col items-center justify-center">
            <Lottie animationData={loadingAnimation} loop style={{ height: 180, width: 180 }} />
            <p className="mt-3 text-sm font-medium" style={{ color: "#64748b" }}>Optimizing Strategy…</p>
        </div>
    );

    const RefreshIcon = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`w-4 h-4 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`}
        >
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
        </svg>
    );

    // KPI data
    const kpis = data ? [
        {
            label: "Total Return",
            value: `${data.total_return} pips`,
            color: data.total_return >= 0 ? "#34d399" : "#f43f5e",
            icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={data.total_return >= 0 ? "#34d399" : "#f43f5e"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points={data.total_return >= 0 ? "23 6 13.5 15.5 8.5 10.5 1 18" : "23 18 13.5 8.5 8.5 13.5 1 6"} />
                    <polyline points={data.total_return >= 0 ? "17 6 23 6 23 12" : "17 18 23 18 23 12"} />
                </svg>
            ),
        },
        {
            label: "Win Rate",
            value: `${data.win_rate}%`,
            color: "#f1f5f9",
            icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            ),
        },
        {
            label: "Profit Factor",
            value: data.profit_factor,
            color: "#60a5fa",
            icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
            ),
        },
        {
            label: "Total Trades",
            value: data.total_trades,
            color: "#94a3b8",
            icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
            ),
        },
    ] : [];

    return (
        <div className="glass-card glow-border-top p-5 space-y-5">

            {/* Header */}
            <div className="section-header">
                <div className="flex items-center gap-2.5">
                    <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{
                            background: "linear-gradient(135deg, rgba(34, 211, 238, 0.12), rgba(59, 130, 246, 0.12))",
                            border: "1px solid rgba(34, 211, 238, 0.15)",
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                    </div>
                    <span className="section-title">Backtest Performance</span>
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="ml-1 transition-colors disabled:cursor-not-allowed cursor-pointer"
                        style={{ color: "#64748b" }}
                        onMouseEnter={(e) => !loading && (e.currentTarget.style.color = "#22d3ee")}
                        onMouseLeave={(e) => e.currentTarget.style.color = "#64748b"}
                        title="Refresh Data"
                    >
                        <RefreshIcon />
                    </button>
                </div>
                <span className="badge badge-cyan">{pair}</span>
            </div>

            {/* No trades warning */}
            {data && data.total_trades === 0 && (
                <div
                    className="flex items-center gap-2 p-3 rounded-xl text-sm"
                    style={{
                        background: "rgba(251, 191, 36, 0.06)",
                        border: "1px solid rgba(251, 191, 36, 0.12)",
                        color: "#fbbf24",
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    {data.message || "No trades found for this period."}
                </div>
            )}

            {/* KPI Cards */}
            {data && (
                <div className="grid grid-cols-2 gap-3">
                    {kpis.map((kpi, i) => (
                        <div key={kpi.label} className={`stat-card animate-fade-in-up delay-${i + 1}`}>
                            <div className="flex items-center gap-1.5 mb-1.5">
                                {kpi.icon}
                                <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "#64748b" }}>{kpi.label}</p>
                            </div>
                            <p className="text-lg font-bold font-mono" style={{ color: kpi.color }}>{kpi.value}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Equity Curve */}
            {data && data.trades.length > 0 && (
                <div
                    className="rounded-xl p-4"
                    style={{
                        background: "rgba(6, 13, 31, 0.5)",
                        border: "1px solid rgba(255, 255, 255, 0.04)",
                    }}
                >
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "#64748b" }}>
                            Equity Curve
                        </p>
                        <span className={`text-sm font-bold font-mono ${data.total_return >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                            {data.total_return >= 0 ? "+" : ""}{data.total_return} pips
                        </span>
                    </div>

                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.equityCurve}>
                                <defs>
                                    <linearGradient id="modernGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
                                        <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                                    </linearGradient>
                                    <filter id="glow">
                                        <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#22d3ee" floodOpacity="0.3" />
                                    </filter>
                                </defs>

                                <XAxis
                                    dataKey="name"
                                    stroke="transparent"
                                    tick={{ fill: '#64748b', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    stroke="transparent"
                                    tick={{ fill: '#64748b', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "rgba(15, 23, 42, 0.95)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        borderRadius: "12px",
                                        color: "#f1f5f9",
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: "0.8rem",
                                        backdropFilter: "blur(8px)",
                                        boxShadow: "0 8px 32px -8px rgba(0,0,0,0.5)",
                                    }}
                                    labelStyle={{ color: "#64748b", fontSize: "0.7rem", fontWeight: 600 }}
                                    cursor={{ stroke: "#22d3ee", strokeOpacity: 0.15, strokeWidth: 1 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="uv"
                                    stroke="#22d3ee"
                                    strokeWidth={2.5}
                                    fill="url(#modernGradient)"
                                    filter="url(#glow)"
                                    dot={false}
                                    activeDot={{
                                        r: 5,
                                        fill: "#22d3ee",
                                        stroke: "#0f172a",
                                        strokeWidth: 2,
                                    }}
                                    animationDuration={1200}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BacktestResults;