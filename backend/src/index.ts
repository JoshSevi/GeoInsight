import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import geoRoutes from "./routes/geo.js";
import historyRoutes from "./routes/history.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Trust proxy for accurate IP detection
app.set("trust proxy", true);

// Routes
app.use("/api", authRoutes);
app.use("/api", geoRoutes);
app.use("/api", historyRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "GeoInsight API is running" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
