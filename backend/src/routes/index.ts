import express from "express";
import authRoutes from "./auth.js";
import geoRoutes from "./geo.js";
import historyRoutes from "./history.js";

/**
 * Register all API routes
 */
export function registerRoutes(app: express.Application): void {
  // API routes
  app.use("/api", authRoutes);
  app.use("/api", geoRoutes);
  app.use("/api", historyRoutes);
}

