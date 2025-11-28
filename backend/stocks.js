
import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());


app.get("/api/stocks", async (req, res) => {
  try {
    const symbol = (req.query.symbol || "MSFT").toUpperCase();

    const response = await axios.get("http://localhost:5001/stocks", {
      params: { symbol },
    });

    res.json(response.data);
  } catch (err) {
    console.error("Error fetching stocks from Python:", err.message);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Node backend running at http://localhost:${PORT}`);
});
