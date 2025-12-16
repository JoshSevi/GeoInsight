import { config } from "../config/index.js";
import { isValidIP } from "../utils/ipValidator.js";
import { ValidationError, ExternalServiceError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";
import { GeoLocationData } from "../types/index.js";

/**
 * Geolocation service
 */
export class GeoService {
  /**
   * Get geolocation information for an IP address
   */
  async getGeoLocation(ip?: string, clientIP?: string): Promise<GeoLocationData> {
    let targetIP: string | undefined = ip;

    // If no IP provided, use client IP
    if (!targetIP && clientIP) {
      // Handle localhost cases
      if (
        clientIP === "::1" ||
        clientIP === "127.0.0.1" ||
        clientIP.startsWith("::ffff:127")
      ) {
        // Use auto-detect endpoint for localhost
        targetIP = undefined;
      } else {
        targetIP = clientIP;
      }
    }

    // Validate IP if provided
    if (targetIP && !isValidIP(targetIP)) {
      throw new ValidationError("Invalid IP address format");
    }

    try {
      // Build API URL
      let apiUrl = targetIP
        ? `${config.ipinfo.baseUrl}/${targetIP}/geo`
        : `${config.ipinfo.baseUrl}/geo`;

      // Add token if available
      if (config.ipinfo.token) {
        apiUrl += `?token=${config.ipinfo.token}`;
      }

      logger.debug("Fetching geolocation", { ip: targetIP || "auto-detect" });

      // Fetch from IPInfo API
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error("IPInfo API error", new Error(errorText), {
          status: response.status,
          ip: targetIP,
        });
        throw new ExternalServiceError(
          "Failed to fetch geolocation data",
          "IPInfo"
        );
      }

      const data = (await response.json()) as GeoLocationData;
      logger.info("Geolocation fetched successfully", { ip: targetIP || "auto-detect" });

      return data;
    } catch (error) {
      if (
        error instanceof ValidationError ||
        error instanceof ExternalServiceError
      ) {
        throw error;
      }
      logger.error("Geo service error", error);
      throw new ExternalServiceError("Failed to fetch geolocation data", "IPInfo");
    }
  }

  /**
   * Extract client IP from request headers
   */
  extractClientIP(req: {
    ip?: string;
    headers: Record<string, string | string[] | undefined>;
  }): string {
    const forwardedFor = req.headers["x-forwarded-for"];
    const realIP = req.headers["x-real-ip"];
    const socketIP = req.ip;

    // Priority: x-forwarded-for > x-real-ip > req.ip
    if (forwardedFor && typeof forwardedFor === "string") {
      return forwardedFor.split(",")[0]?.trim() || "";
    }

    if (realIP && typeof realIP === "string") {
      return realIP.trim();
    }

    return socketIP || "";
  }
}

export const geoService = new GeoService();
