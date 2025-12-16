import express from "express";
import cors from "cors";
import { config } from "./config/index.js";
import { logger } from "./utils/logger.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import geoRoutes from "./routes/geo.js";
import historyRoutes from "./routes/history.js";
import { dbClient } from "./database/client.js";

const app = express();

// Trust proxy for accurate IP detection (must be before routes)
app.set("trust proxy", true);

// Middleware
app.use(
  cors({
    origin: config.cors.origin,
  })
);
app.use(express.json());

// Request logging middleware (development only)
if (config.nodeEnv === "development") {
  app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.path}`, {
      query: req.query,
      body: req.body,
    });
    next();
  });
}

// Health check endpoint
app.get("/api/health", async (req, res) => {
  const dbHealth = await dbClient.healthCheck();
  const status = dbHealth ? "healthy" : "unhealthy";
  const statusCode = dbHealth ? 200 : 503;

  res.status(statusCode).json({
    status,
    message: "GeoInsight API",
    timestamp: new Date().toISOString(),
    services: {
      database: dbHealth ? "connected" : "disconnected",
    },
  });
});

// API Routes
app.use("/api", authRoutes);
app.use("/api", geoRoutes);
app.use("/api", historyRoutes);

// 404 handler for undefined routes
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`, {
    environment: config.nodeEnv,
    port: PORT,
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT signal received: closing HTTP server");
  process.exit(0);
});
