import { useEffect, useRef } from "react";

const Chart = ({ pair }) => {
    const chartContainer = useRef();

    const handleFullscreen = () => {
        if (chartContainer.current?.requestFullscreen) {
            chartContainer.current.requestFullscreen();
        }
    };

    useEffect(() => {
        const container = document.getElementById("tradingview_chart");
        if (container) container.innerHTML = "";

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/tv.js";
        script.async = true;
        script.onload = () => {
            if (window.TradingView) {
                new window.TradingView.widget({
                    container_id: "tradingview_chart",
                    symbol: `FX:${pair}`,
                    interval: "60",
                    theme: "dark",
                    style: "1",
                    locale: "en",
                    autosize: true,
                    hide_side_toolbar: false,
                    allow_symbol_change: false,
                });
            }
        };
        document.body.appendChild(script);

        return () => {
            const existingScript = document.querySelector('script[src="https://s3.tradingview.com/tv.js"]');
            if (existingScript) existingScript.remove();
        };
    }, [pair]);

    return (
        <div className="glass-card glow-border-top overflow-hidden">

            {/* Header Bar */}
            <div className="flex justify-between items-center px-5 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center gap-3">
                    <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{
                            background: "linear-gradient(135deg, rgba(34, 211, 238, 0.12), rgba(59, 130, 246, 0.12))",
                            border: "1px solid rgba(34, 211, 238, 0.15)",
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <line x1="3" y1="9" x2="21" y2="9" />
                            <line x1="9" y1="21" x2="9" y2="9" />
                        </svg>
                    </div>
                    <div>
                        <span className="text-sm font-semibold text-white">{pair}</span>
                        <span className="text-xs ml-2" style={{ color: "#64748b" }}>• 1H</span>
                    </div>
                </div>
                <button
                    onClick={handleFullscreen}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                    style={{
                        background: "rgba(34, 211, 238, 0.08)",
                        border: "1px solid rgba(34, 211, 238, 0.15)",
                        color: "#22d3ee",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(34, 211, 238, 0.15)";
                        e.currentTarget.style.borderColor = "rgba(34, 211, 238, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(34, 211, 238, 0.08)";
                        e.currentTarget.style.borderColor = "rgba(34, 211, 238, 0.15)";
                    }}
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 3 21 3 21 9" />
                        <polyline points="9 21 3 21 3 15" />
                        <line x1="21" y1="3" x2="14" y2="10" />
                        <line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                    Fullscreen
                </button>
            </div>

            {/* Chart Container */}
            <div className="h-[520px]">
                <div id="tradingview_chart" ref={chartContainer} className="h-full w-full" />
            </div>
        </div>
    );
};

export default Chart;