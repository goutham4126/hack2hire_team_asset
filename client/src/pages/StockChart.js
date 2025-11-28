import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

function StockChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4000/api/stocks")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  const labels = data.map(d => d.date);
  const prices = data.map(d => d.close);
  const sma = data.map(d => d.close_sma_3);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Price",
        data: prices,
        borderColor: "blue",
        backgroundColor: "blue",
        borderWidth: 2,
        tension: 0.3,
      },
      {
        label: "SMA 3",
        data: sma,
        borderColor: "green",
        backgroundColor: "green",
        borderWidth: 2,
        borderDash: [5, 3],
        tension: 0.3,
      },
    ],
  };

  return (
    <div style={{ width: "600px", margin: "auto" }}>
      <h2>Stock Price Chart</h2>
      <Line data={chartData} />
      <pre>{JSON.stringify(data,null,2)}</pre>
    </div>
  );
}

export default StockChart;
