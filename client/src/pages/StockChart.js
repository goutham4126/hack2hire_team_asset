import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const NFLX_DATA = [
  {"datetime":"2024-12-01","close":89.13200,"volume":572070000},
  {"datetime":"2024-11-01","close":88.68100,"volume":641615000},
  {"datetime":"2024-10-01","close":75.60300,"volume":853369000},
  {"datetime":"2024-09-01","close":70.92700,"volume":531021000},
  {"datetime":"2024-08-01","close":70.13500,"volume":673177000},
  {"datetime":"2024-07-01","close":62.83500,"volume":809087000},
  {"datetime":"2024-06-01","close":67.48800,"volume":542109000},
  {"datetime":"2024-05-01","close":64.16200,"volume":689993000},
  {"datetime":"2024-04-01","close":55.063999,"volume":940103000},
  {"datetime":"2024-03-01","close":60.73300,"volume":601511000},
  {"datetime":"2024-02-01","close":60.29200,"volume":716465000},
  {"datetime":"2024-01-01","close":56.41100,"volume":1459217000},
  {"datetime":"2023-12-01","close":48.68800,"volume":804230000},
  {"datetime":"2023-11-01","close":47.39700,"volume":717437000},
  {"datetime":"2023-10-01","close":41.16900,"volume":1640406000},
  {"datetime":"2023-09-01","close":37.76000,"volume":1002925000},
  {"datetime":"2023-08-01","close":43.36800,"volume":1073031000},
  {"datetime":"2023-07-01","close":43.89700,"volume":1686120000},
  {"datetime":"2023-06-01","close":44.049000,"volume":1472532000},
  {"datetime":"2023-05-01","close":39.52300,"volume":1454850000},
  {"datetime":"2023-04-01","close":32.99300,"volume":1279910000},
  {"datetime":"2023-03-01","close":34.54800,"volume":1575554000},
  {"datetime":"2023-02-01","close":32.21300,"volume":1233741000},
  {"datetime":"2023-01-01","close":35.38600,"volume":2064174000},
  {"datetime":"2022-12-01","close":29.48800,"volume":1930809000},
  {"datetime":"2022-11-01","close":30.55300,"volume":1856830000},
  {"datetime":"2022-10-01","close":29.18800,"volume":3352638000},
  {"datetime":"2022-09-01","close":23.54400,"volume":2339207000},
  {"datetime":"2022-08-01","close":22.35600,"volume":1522583000},
  {"datetime":"2022-07-01","close":22.49000,"volume":2700837000},
  {"datetime":"2022-06-01","close":17.48700,"volume":1925527000},
  {"datetime":"2022-05-01","close":19.74400,"volume":2516158000},
  {"datetime":"2022-04-01","close":19.035999,"volume":4033254000},
  {"datetime":"2022-03-01","close":37.45900,"volume":1194919000},
  {"datetime":"2022-02-01","close":39.45200,"volume":1510107000},
  {"datetime":"2022-01-01","close":42.71400,"volume":2416620000},
  {"datetime":"2021-12-01","close":60.24400,"volume":599753000},
  {"datetime":"2021-11-01","close":64.19000,"volume":645302000},
  {"datetime":"2021-10-01","close":69.030998,"volume":985763000},
  {"datetime":"2021-09-01","close":61.034000,"volume":823175000},
  {"datetime":"2021-08-01","close":56.91900,"volume":547477000},
  {"datetime":"2021-07-01","close":51.75700,"volume":772212000},
  {"datetime":"2021-06-01","close":52.82100,"volume":785606000},
  {"datetime":"2021-05-01","close":50.28100,"volume":669276000},
  {"datetime":"2021-04-01","close":51.34700,"volume":1115733000},
  {"datetime":"2021-03-01","close":52.16600,"volume":901839000},
  {"datetime":"2021-02-01","close":53.88500,"volume":619023000},
  {"datetime":"2021-01-01","close":53.23900,"volume":1399886000},
  {"datetime":"2020-12-01","close":54.073002,"volume":775641000},
  {"datetime":"2020-11-01","close":49.070000,"volume":917889000},
  {"datetime":"2020-10-01","close":47.57400,"volume":1543024000},
  {"datetime":"2020-09-01","close":50.0029984,"volume":1187969000},
  {"datetime":"2020-08-01","close":52.95600,"volume":1162619000},
  {"datetime":"2020-07-01","close":48.88800,"volume":2322063000},
  {"datetime":"2020-06-01","close":45.50400,"volume":1172799000},
  {"datetime":"2020-05-01","close":41.97300,"volume":1350558000},
  {"datetime":"2020-04-01","close":41.98500,"volume":2251116000},
  {"datetime":"2020-03-01","close":37.55000,"volume":2019791000},
  {"datetime":"2020-02-01","close":36.90300,"volume":1140560000},
  {"datetime":"2020-01-01","close":34.50900,"volume":1698740000},
  {"datetime":"2019-12-01","close":32.35700,"volume":1247236000}
];

const MSFT_DATA = [
  {"datetime":"2024-12-01","close":421.5,"volume":439902400},
  {"datetime":"2024-11-01","close":423.45999,"volume":442321200},
  {"datetime":"2024-10-01","close":406.35001,"volume":440745500},
  {"datetime":"2024-09-01","close":430.29999,"volume":376921200},
  {"datetime":"2024-08-01","close":417.14001,"volume":451919000},
  {"datetime":"2024-07-01","close":418.35001,"volume":440449200},
  {"datetime":"2024-06-01","close":446.95001,"volume":342370400},
  {"datetime":"2024-05-01","close":415.13000,"volume":413800800},
  {"datetime":"2024-04-01","close":389.32999,"volume":440777700},
  {"datetime":"2024-03-01","close":420.72000,"volume":426349600},
  {"datetime":"2024-02-01","close":413.64001,"volume":444176300},
  {"datetime":"2024-01-01","close":397.57999,"volume":528399000},
  {"datetime":"2023-12-01","close":376.040009,"volume":522003700},
  {"datetime":"2023-11-01","close":378.91000,"volume":563880300},
  {"datetime":"2023-10-01","close":338.10999,"volume":540907000},
  {"datetime":"2023-09-01","close":315.75,"volume":416680700},
  {"datetime":"2023-08-01","close":327.76001,"volume":479456700},
  {"datetime":"2023-07-01","close":335.92001,"volume":666764400},
  {"datetime":"2023-06-01","close":340.54001,"volume":547588700},
  {"datetime":"2023-05-01","close":328.39001,"volume":600807200},
  {"datetime":"2023-04-01","close":307.26001,"volume":551497100},
  {"datetime":"2023-03-01","close":288.29999,"volume":747635000},
  {"datetime":"2023-02-01","close":249.42000,"volume":615501000},
  {"datetime":"2023-01-01","close":247.81000,"volume":666168100},
  {"datetime":"2022-12-01","close":239.82001,"volume":591358700},
  {"datetime":"2022-11-01","close":255.14000,"volume":615296000},
  {"datetime":"2022-10-01","close":232.13000,"volume":671225100},
  {"datetime":"2022-09-01","close":232.89999,"volume":575586600},
  {"datetime":"2022-08-01","close":261.47000,"volume":477157600},
  {"datetime":"2022-07-01","close":280.73999,"volume":534891800},
  {"datetime":"2022-06-01","close":256.82999,"volume":621372300},
  {"datetime":"2022-05-01","close":271.87000,"volume":742902000},
  {"datetime":"2022-04-01","close":277.51999,"volume":627343400},
  {"datetime":"2022-03-01","close":308.31000,"volume":734334200},
  {"datetime":"2022-02-01","close":298.79001,"volume":697050600},
  {"datetime":"2022-01-01","close":310.98001,"volume":947531400},
  {"datetime":"2021-12-01","close":336.32001,"volume":625674800},
  {"datetime":"2021-11-01","close":330.59000,"volume":509885200},
  {"datetime":"2021-10-01","close":331.62000,"volume":516515800},
  {"datetime":"2021-09-01","close":281.92001,"volume":502918700},
  {"datetime":"2021-08-01","close":301.88000,"volume":441308900},
  {"datetime":"2021-07-01","close":284.91000,"volume":522672700},
  {"datetime":"2021-06-01","close":270.89999,"volume":508572200},
  {"datetime":"2021-05-01","close":249.67999,"volume":495084900},
  {"datetime":"2021-04-01","close":252.17999,"volume":568661600},
  {"datetime":"2021-03-01","close":235.77000,"volume":724945800},
  {"datetime":"2021-02-01","close":232.38000,"volume":490962200},
  {"datetime":"2021-01-01","close":231.96001,"volume":648076400},
  {"datetime":"2020-12-01","close":222.42000,"volume":594761700},
  {"datetime":"2020-11-01","close":214.070007,"volume":573443000},
  {"datetime":"2020-10-01","close":202.47000,"volume":631618000},
  {"datetime":"2020-09-01","close":210.33000,"volume":768176300},
  {"datetime":"2020-08-01","close":225.53000,"volume":692423900},
  {"datetime":"2020-07-01","close":205.0099945,"volume":770190800},
  {"datetime":"2020-06-01","close":203.50999,"volume":764965400},
  {"datetime":"2020-05-01","close":183.25,"volume":688845000},
  {"datetime":"2020-04-01","close":179.21001,"volume":984705000},
  {"datetime":"2020-03-01","close":157.71001,"volume":1612695500},
  {"datetime":"2020-02-01","close":162.0099945,"volume":887522300},
  {"datetime":"2020-01-01","close":170.23000,"volume":558530000},
  {"datetime":"2019-12-01","close":157.70000,"volume":450303300}
];

const SPY_DATA = [
  {"datetime":"2024-12-01","close":586.080017,"volume":1059516700},
  {"datetime":"2024-11-01","close":602.54999,"volume":901843000},
  {"datetime":"2024-10-01","close":568.64001,"volume":976068800},
  {"datetime":"2024-09-01","close":573.76001,"volume":1045061400},
  {"datetime":"2024-08-01","close":563.67999,"volume":1244599000},
  {"datetime":"2024-07-01","close":550.81000,"volume":1038465500},
  {"datetime":"2024-06-01","close":544.21997,"volume":888923200},
  {"datetime":"2024-05-01","close":527.37000,"volume":1153264400},
  {"datetime":"2024-04-01","close":501.98001,"volume":1592974000},
  {"datetime":"2024-03-01","close":523.070007,"volume":1473246900},
  {"datetime":"2024-02-01","close":508.079987,"volume":1393465400},
  {"datetime":"2024-01-01","close":482.88000,"volume":1700630800},
  {"datetime":"2023-12-01","close":475.31000,"volume":1643108100},
  {"datetime":"2023-11-01","close":456.39999,"volume":1499960600},
  {"datetime":"2023-10-01","close":418.20001,"volume":1999149700},
  {"datetime":"2023-09-01","close":427.48001,"volume":1588673200},
  {"datetime":"2023-08-01","close":450.35001,"volume":1754764700},
  {"datetime":"2023-07-01","close":457.79001,"volume":1374632400},
  {"datetime":"2023-06-01","close":443.28000,"volume":1749755000},
  {"datetime":"2023-05-01","close":417.85001,"volume":1780705600},
  {"datetime":"2023-04-01","close":415.92999,"volume":1395683000},
  {"datetime":"2023-03-01","close":409.39001,"volume":2515995800},
  {"datetime":"2023-02-01","close":396.26001,"volume":1603094700},
  {"datetime":"2023-01-01","close":406.48001,"volume":1575450100},
  {"datetime":"2022-12-01","close":382.42999,"volume":1735973600},
  {"datetime":"2022-11-01","close":407.67999,"volume":1745985300},
  {"datetime":"2022-10-01","close":386.20999,"volume":2024732000},
  {"datetime":"2022-09-01","close":357.17999,"volume":1998908600},
  {"datetime":"2022-08-01","close":395.17999,"volume":1443394400},
  {"datetime":"2022-07-01","close":411.98999,"volume":1437748400},
  {"datetime":"2022-06-01","close":377.25,"volume":1958611900},
  {"datetime":"2022-05-01","close":412.92999,"volume":2418478100},
  {"datetime":"2022-04-01","close":412,"volume":1856757400},
  {"datetime":"2022-03-01","close":451.64001,"volume":2380929500},
  {"datetime":"2022-02-01","close":436.63000,"volume":2297975100},
  {"datetime":"2022-01-01","close":449.91000,"volume":2485167800},
  {"datetime":"2021-12-01","close":474.95999,"volume":1927433900},
  {"datetime":"2021-11-01","close":455.56000,"volume":1335351500},
  {"datetime":"2021-10-01","close":459.25,"volume":1508665200},
  {"datetime":"2021-09-01","close":429.14001,"volume":1745559600},
  {"datetime":"2021-08-01","close":451.56000,"volume":1254001400},
  {"datetime":"2021-07-01","close":438.51001,"volume":1422104700},
  {"datetime":"2021-06-01","close":428.059998,"volume":1282152400},
  {"datetime":"2021-05-01","close":420.040009,"volume":1547235900},
  {"datetime":"2021-04-01","close":417.29999,"volume":1462106600},
  {"datetime":"2021-03-01","close":396.32999,"volume":2401715800},
  {"datetime":"2021-02-01","close":380.35999,"volume":1307806200},
  {"datetime":"2021-01-01","close":370.070007,"volume":1402265400},
  {"datetime":"2020-12-01","close":373.88000,"volume":1344541500},
  {"datetime":"2020-11-01","close":362.059998,"volume":1535244300},
  {"datetime":"2020-10-01","close":326.54001,"volume":1629016100},
  {"datetime":"2020-09-01","close":334.89001,"volume":1814712700},
  {"datetime":"2020-08-01","close":349.31000,"volume":1045563300},
  {"datetime":"2020-07-01","close":326.51999,"volume":1505145300},
  {"datetime":"2020-06-01","close":308.35999,"volume":2358674500},
  {"datetime":"2020-05-01","close":304.32001,"volume":1910460500},
  {"datetime":"2020-04-01","close":290.48001,"volume":2819312300},
  {"datetime":"2020-03-01","close":257.75,"volume":5926017600},
  {"datetime":"2020-02-01","close":296.26001,"volume":2110214900},
  {"datetime":"2020-01-01","close":321.73001,"volume":1392003800},
  {"datetime":"2019-12-01","close":321.85999,"volume":1285175800}
];

const DATASETS = {
  MSFT: MSFT_DATA,
  NFLX: NFLX_DATA,
  SPY: SPY_DATA
};

function prepareDF(data) {
  const sorted = [...data].sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
  const returns = [];
  
  for (let i = 1; i < sorted.length; i++) {
    const prevClose = sorted[i - 1].close;
    const currClose = sorted[i].close;
    returns.push({
      datetime: sorted[i].datetime,
      monthlyReturn: (currClose - prevClose) / prevClose
    });
  }
  
  return returns;
}

function computeSPY5YAnnualized() {
  const spyReturns = prepareDF(SPY_DATA);
  const last60 = spyReturns.slice(-60);
  
  if (last60.length === 0) return 0;
  
  let growth = 1;
  last60.forEach(r => {
    growth *= (1 + r.monthlyReturn);
  });
  
  const years = 5.0;
  return Math.pow(growth, 1 / years) - 1;
}

function computeBeta(ticker) {
  const stockReturns = prepareDF(DATASETS[ticker]);
  const spyReturns = prepareDF(SPY_DATA);
  
  const merged = [];
  stockReturns.forEach(sr => {
    const match = spyReturns.find(spy => spy.datetime === sr.datetime);
    if (match) {
      merged.push({
        stockRet: sr.monthlyReturn,
        spyRet: match.monthlyReturn
      });
    }
  });
  
  if (merged.length < 2) return 0;
  
  const stockMean = merged.reduce((sum, m) => sum + m.stockRet, 0) / merged.length;
  const spyMean = merged.reduce((sum, m) => sum + m.spyRet, 0) / merged.length;
  
  let cov = 0;
  let spyVar = 0;
  
  merged.forEach(m => {
    cov += (m.stockRet - stockMean) * (m.spyRet - spyMean);
    spyVar += Math.pow(m.spyRet - spyMean, 2);
  });
  
  cov /= (merged.length - 1);
  spyVar /= (merged.length - 1);
  
  if (spyVar === 0) return 0;
  return cov / spyVar;
}

function calculateWACC(ticker) {
  const rf = 0.04;
  const taxRate = 0.30;
  
  const marketReturn = computeSPY5YAnnualized();
  const beta = computeBeta(ticker);
  
  const baseDERatio = ticker === "MSFT" ? 0.25 : 0.63;
  
  const unleveredBeta = beta !== 0 ? beta / (1 + (1 - taxRate) * baseDERatio) : 0;
  
  const curve = [];
  
  for (let debtPercent = 0; debtPercent < 100; debtPercent++) {
    const dOverV = debtPercent / 100.0;
    const eOverV = 1.0 - dOverV;
    
    if (eOverV <= 0) continue;
    
    const dOverE = dOverV / eOverV;
    const releveredBeta = unleveredBeta * (1 + (1 - taxRate) * dOverE);
    const re = rf + releveredBeta * (marketReturn - rf);
    const rd = 0.04 + 0.001 * debtPercent;
    const wacc = eOverV * re + dOverV * rd * (1 - taxRate);
    
    curve.push({
      debtPercent,
      equityPercent: eOverV * 100,
      betaRelevered: releveredBeta,
      re,
      rd,
      wacc
    });
  }
  
  let minWacc = curve[0];
  curve.forEach(point => {
    if (point.wacc < minWacc.wacc) {
      minWacc = point;
    }
  });
  
  return {
    ticker,
    riskFreeRate: rf,
    taxRate,
    marketReturn,
    beta,
    unleveredBeta,
    baseDERatio,
    optimal: minWacc,
    curve
  };
}

export default function WACCCalculator() {
  const [ticker, setTicker] = useState("MSFT");
  const [result, setResult] = useState(null);

  const fmtPct = (x) => (x * 100).toFixed(6) + "%";

  const handleCalculate = () => {
    const data = calculateWACC(ticker);
    setResult(data);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Optimal WACC Calculator</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Ticker:
          </label>
          <select
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="MSFT">MSFT</option>
            <option value="NFLX">NFLX</option>
          </select>
        </div>

        <button
          onClick={handleCalculate}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Calculate
        </button>

        {result && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Results for {result.ticker}
            </h3>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-3 text-gray-800">Input Parameters</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Risk-free rate (rf):</span> {fmtPct(result.riskFreeRate)}</p>
                  <p><span className="font-medium">Tax rate (Tc):</span> {fmtPct(result.taxRate)}</p>
                  <p><span className="font-medium">SPY 5Y Annualized Market Return:</span> {fmtPct(result.marketReturn)}</p>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-3 text-gray-800">Beta Analysis</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Levered Beta:</span> {result.beta.toFixed(6)}</p>
                  <p><span className="font-medium">Unlevered Beta:</span> {result.unleveredBeta.toFixed(6)}</p>
                  <p><span className="font-medium">Base D/E for unlevering:</span> {result.baseDERatio.toFixed(6)}</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg mb-8">
              <h4 className="text-xl font-semibold mb-4 text-gray-800">Optimal Capital Structure</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="mb-2"><span className="font-medium">Optimal WACC:</span> <span className="text-lg font-bold text-green-700">{fmtPct(result.optimal.wacc)}</span></p>
                  <p className="mb-2"><span className="font-medium">Optimal Debt %:</span> {result.optimal.debtPercent.toFixed(6)}%</p>
                  <p className="mb-2"><span className="font-medium">Optimal Equity %:</span> {result.optimal.equityPercent.toFixed(6)}%</p>
                </div>
                <div>
                  <p className="mb-2"><span className="font-medium">Re at optimum:</span> {fmtPct(result.optimal.re)}</p>
                  <p className="mb-2"><span className="font-medium">Rd at optimum:</span> {fmtPct(result.optimal.rd)}</p>
                  <p className="mb-2"><span className="font-medium">Relevered Beta:</span> {result.optimal.betaRelevered.toFixed(6)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="text-xl font-semibold mb-4 text-gray-800">WACC Curve</h4>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={result.curve}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="debtPercent" 
                    label={{ value: 'Debt %', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    label={{ value: 'WACC', angle: -90, position: 'insideLeft' }}
                    tickFormatter={(value) => (value * 100).toFixed(1) + '%'}
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'wacc' || name === 're' || name === 'rd') {
                        return [(value * 100).toFixed(2) + '%', name.toUpperCase()];
                      }
                      return [value.toFixed(4), name];
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="wacc" stroke="#2563eb" strokeWidth={2} dot={false} name="WACC" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}