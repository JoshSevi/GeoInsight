// Note: dotenv is loaded in config/index.ts before validation

import express from "express";
import cors from "cors";
import { config } from "./config/index.js";
import { logger } from "./utils/logger.js";
import { errorHandler, notFoundHandler } from "./middleware/index.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { registerRoutes } from "./routes/index.js";
import { dbClient } from "./database/client.js";

/**
 * Create and configure Express application
 */
function createApp(): express.Application {
  const app = express();

  // Trust proxy for accurate IP detection (must be before routes)
  app.set("trust proxy", true);

  // Global middleware
  app.use(
    cors({
      origin: config.cors.origin,
    })
  );
  app.use(express.json());

  // Apply general API rate limiting to all /api routes
  // (Specific routes may have stricter limits)
  app.use("/api", apiLimiter);

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

  // Register all API routes
  registerRoutes(app);

  // 404 handler for undefined routes
  app.use(notFoundHandler);

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
}

const app = createApp();

/**
 * Start the server
 */
function startServer(): void {
  const PORT = config.port;

  const server = app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`, {
      environment: config.nodeEnv,
      port: PORT,
    });
  });

  // Graceful shutdown
  const shutdown = (signal: string) => {
    logger.info(`${signal} signal received: closing HTTP server`);
    server.close(() => {
      logger.info("HTTP server closed");
      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

// Start the server
startServer();
