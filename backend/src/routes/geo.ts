import express from "express";
import { geoController } from "../controllers/geo.controller.js";
import { routeHandler } from "../utils/routeHandler.js";
import { geoLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

/**
 * GET /api/geo
 * Get geolocation information for an IP address or current user's IP
 * Rate limited: 30 requests per 15 minutes per IP
 *
 * Query Parameters:
 * - ip (optional): IP address to lookup. If not provided, returns current user's IP geolocation
 */
router.get(
  "/geo",
  geoLimiter,
  routeHandler(geoController.getGeoLocation.bind(geoController))
);

export default router;
