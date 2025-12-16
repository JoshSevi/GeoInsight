// Note: dotenv is loaded in config/index.ts before validation

import { createApp } from "./app.js";
import { config } from "./config/index.js";
import { logger } from "./utils/logger.js";

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

// Start the server only when not running in Vercel serverless environment
if (!process.env.VERCEL) {
  startServer();
}

export { app, startServer };
