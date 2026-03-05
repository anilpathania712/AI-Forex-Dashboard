import { useEffect, useRef } from "react";

const Chart = ({ pair }) => {
    const chartContainer = useRef();

    const handleFullscreen = () => {
        if (chartContainer.current.requestFullscreen) {
            chartContainer.current.requestFullscreen();
        }
    };

    useEffect(() => {
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

        // Cleanup to avoid duplicate scripts on re-renders
        return () => {
            const existingScript = document.querySelector('script[src="https://s3.tradingview.com/tv.js"]');
            if (existingScript) existingScript.remove();
        };
    }, [pair]);

    return (
        <div className="bg-[#111827] rounded-2xl overflow-hidden border border-white/5 shadow-xl relative">

            {/* Header OUTSIDE iframe */}
            <div className="flex justify-between items-center px-2 py-2 text-xs text-gray-500 uppercase tracking-wider font-bold">
                <span>Market View</span>
                <button
                    onClick={handleFullscreen}
                    className="text-white text-xs bg-blue-600 px-2 py-1 rounded hover:bg-sky-700 cursor-pointer"
                >
                    Fullscreen
                </button>
            </div>

            {/* Chart Container */}
            <div className="h-[500px]">
                <div id="tradingview_chart" ref={chartContainer} className="h-full w-full" />
            </div>

        </div>
    );
};

export default Chart;