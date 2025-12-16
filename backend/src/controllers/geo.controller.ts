import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/index.js";
import { geoService } from "../services/geo.service.js";
import { sendSuccess } from "../utils/response.js";

/**
 * Geolocation controller
 */
export class GeoController {
  /**
   * Get geolocation information
   */
  async getGeoLocation(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { ip } = req.query;
    const clientIP = geoService.extractClientIP(req);

    const ipString = ip ? String(ip).trim() : undefined;
    const data = await geoService.getGeoLocation(ipString, clientIP);

    sendSuccess(res, data);
  }
}

export const geoController = new GeoController();
