import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function MDD() {
  const [symbol, setSymbol] = useState("MSFT");
  const [mdd, setMdd] = useState(null);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async (selectedSymbol) => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `http://localhost:4000/api/stocks?symbol=${selectedSymbol}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error fetching data");
        setMdd(null);
        setSeries([]);
        return;
      }

      setMdd(data.mdd);
      setSeries(data.series || []);
    } catch (err) {
      console.error(err);
      setError("Error fetching data");
      setMdd(null);
      setSeries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(symbol);
  }, [symbol]);

  return (
    <div className="p-3">
      <h1 className="text-2xl font-bold mb-4">
        Max Drawdown & Drawdown Curve
      </h1>

      <div className="mb-4">
        <label className="font-semibold mr-2">Select Stock:</label>
        <select
          className="border px-2 py-1"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        >
          <option value="MSFT">MSFT</option>
          <option value="NFLX">NFLX</option>
          <option value="SPY">SPY</option>
        </select>
      </div>

      {loading && <Loading />}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && mdd !== null && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Max Drawdown for {symbol}:{" "}
            <span className="font-bold">{mdd.toFixed(6)}%</span>
          </h2>
        </div>
      )}

      {!loading && !error && series.length > 0 && (
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <AreaChart data={series}>
              <defs>
                <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff4d4f" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ff4d4f" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="datetime" />
              <YAxis
                label={{
                  value: "Drawdown (%)",
                  angle: -90,
                  position: "insideLeft",
                }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip />

              <Area
                type="monotone"
                dataKey="drawdown"
                dot={false}
                stroke="#ab3a32"
                strokeWidth={2}
                fill="#ab3a32"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default MDD;
