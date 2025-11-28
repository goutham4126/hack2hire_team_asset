import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

function Home() {
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTicker, setSelectedTicker] = useState('MSFT');
  const [error, setError] = useState(null);

  const tickers = [
    { symbol: 'MSFT', name: 'Microsoft', color: '#00A4EF' },
    { symbol: 'NFLX', name: 'Netflix', color: '#E50914' },
    { symbol: 'SPY', name: 'S&P 500 ETF', color: '#10B981' }
  ];

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      setError(null);
      const data = {};

      for (const ticker of tickers) {
        try {
          const response = await fetch(
            `https://api.twelvedata.com/time_series?symbol=${ticker.symbol}&interval=1month&start_date=2019-12-01&end_date=2024-12-31&apikey=fcc6888d07144ba388277f067cbf1ba7`
          );
          const result = await response.json();
          
          if (result.values) {
            data[ticker.symbol] = result.values.reverse().map(item => ({
              date: item.datetime,
              close: parseFloat(item.close),
              open: parseFloat(item.open),
              high: parseFloat(item.high),
              low: parseFloat(item.low),
              volume: parseInt(item.volume)
            }));
          }
        } catch (err) {
          console.error(`Error fetching ${ticker.symbol}:`, err);
          setError(`Failed to fetch data for ${ticker.symbol}`);
        }
      }

      setStockData(data);
      setLoading(false);
    };

    fetchStockData();
  }, []);

  const calculateStats = (data) => {
    if (!data || data.length === 0) return null;
    
    const firstPrice = data[0].close;
    const lastPrice = data[data.length - 1].close;
    const change = lastPrice - firstPrice;
    const changePercent = ((change / firstPrice) * 100).toFixed(2);
    const highest = Math.max(...data.map(d => d.high));
    const lowest = Math.min(...data.map(d => d.low));
    
    return {
      currentPrice: lastPrice.toFixed(2),
      change: change.toFixed(2),
      changePercent,
      highest: highest.toFixed(2),
      lowest: lowest.toFixed(2),
      isPositive: change >= 0
    };
  };

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-black text-lg">Loading stock data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 max-w-md">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const selectedData = stockData[selectedTicker];
  const stats = calculateStats(selectedData);
  const selectedTickerInfo = tickers.find(t => t.symbol === selectedTicker);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Stock Portfolio Dashboard</h1>
          <p className="text-slate-400">Historical data from Dec 2019 to Dec 2024</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {tickers.map((ticker) => {
            const tickerStats = calculateStats(stockData[ticker.symbol]);
            return (
              <button
                key={ticker.symbol}
                onClick={() => setSelectedTicker(ticker.symbol)}
                className={`p-6 rounded-xl transition-all duration-300 ${
                  selectedTicker === ticker.symbol
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-xl shadow-blue-500/20 scale-105'
                    : 'bg-slate-800/50 hover:bg-slate-800 border border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{ticker.symbol}</h3>
                    <p className="text-slate-300 text-sm">{ticker.name}</p>
                  </div>
                  {tickerStats?.isPositive ? (
                    <TrendingUp className="text-green-400" size={24} />
                  ) : (
                    <TrendingDown className="text-red-400" size={24} />
                  )}
                </div>
                {tickerStats && (
                  <div className="text-left">
                    <p className="text-3xl font-bold text-white mb-1">
                      ${tickerStats.currentPrice}
                    </p>
                    <p className={`text-sm font-semibold ${
                      tickerStats.isPositive ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {tickerStats.isPositive ? '+' : ''}{tickerStats.changePercent}%
                    </p>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">
              {selectedTickerInfo?.name} - Price History
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={selectedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8' }}
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8' }}
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value) => [`$${value.toFixed(2)}`, 'Close']}
                  labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric' 
                  })}
                />
                <Legend wrapperStyle={{ color: '#94a3b8' }} />
                <Line 
                  type="monotone" 
                  dataKey="close" 
                  stroke={selectedTickerInfo?.color} 
                  strokeWidth={3}
                  dot={false}
                  name="Close Price"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
              {stats && (
                <div className="space-y-3">
                  <div>
                    <p className="text-slate-400 text-sm">Current Price</p>
                    <p className="text-2xl font-bold text-white">${stats.currentPrice}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Total Change</p>
                    <p className={`text-xl font-semibold ${stats.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {stats.isPositive ? '+' : ''}{stats.changePercent}%
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">5Y High</p>
                    <p className="text-lg font-semibold text-white">${stats.highest}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">5Y Low</p>
                    <p className="text-lg font-semibold text-white">${stats.lowest}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => handleNavigation('/mdd')}
            className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white p-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-purple-500/20 group"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-2">Maximum Drawdown</h3>
                <p className="text-purple-100">Analyze risk and volatility metrics</p>
              </div>
              <ArrowRight className="group-hover:translate-x-2 transition-transform" size={32} />
            </div>
          </button>

          <button
            onClick={() => handleNavigation('/wacc')}
            className="bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white p-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-emerald-500/20 group"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-2">WACC Calculator</h3>
                <p className="text-emerald-100">Calculate weighted average cost of capital</p>
              </div>
              <ArrowRight className="group-hover:translate-x-2 transition-transform" size={32} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;