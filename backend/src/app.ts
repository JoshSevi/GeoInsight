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
 * This is shared between the standalone server (src/index.ts)
 * and the Vercel serverless function entry point.
 */
export function createApp(): express.Application {
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

// Default export required by some serverless runtimes (including Vercel)
// An Express application is a callable function: (req, res) => void
const app = createApp();
export default app;
