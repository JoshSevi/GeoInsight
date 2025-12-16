import express from "express";
import { geoController } from "../controllers/geo.controller.js";

const router = express.Router();

/**
 * GET /api/geo
 * Get geolocation information for an IP address or current user's IP
 *
 * Query Parameters:
 * - ip (optional): IP address to lookup. If not provided, returns current user's IP geolocation
 */
router.get("/geo", (req, res, next) => {
  geoController.getGeoLocation(req as express.Request, res, next).catch(next);
});

export default router;
