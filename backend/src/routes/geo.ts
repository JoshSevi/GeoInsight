import express from "express";
import { isValidIP } from "../utils/ipValidator.js";

const router = express.Router();

const IPINFO_BASE_URL = "https://ipinfo.io";
const IPINFO_TOKEN = process.env.IPINFO_TOKEN || "";

/**
 * GET /api/geo
 * Get geolocation information for an IP address or current user's IP
 *
 * Query Parameters:
 * - ip (optional): IP address to lookup. If not provided, returns current user's IP geolocation
 */
router.get("/geo", async (req, res) => {
  try {
    const { ip } = req.query;
    const clientIP = req.ip || req.socket.remoteAddress || "";

    let apiUrl: string;

    // If IP is provided, validate it and use it
    if (ip) {
      const ipString = String(ip).trim();

      // Validate IP address format
      if (!isValidIP(ipString)) {
        return res.status(400).json({
          success: false,
          message: "Invalid IP address format",
        });
      }

      // Get geolocation for specified IP
      apiUrl = `${IPINFO_BASE_URL}/${ipString}/geo`;
    } else {
      // Get geolocation for current user's IP
      // Extract IP from request (handles proxy headers)
      const userIP =
        (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
        (req.headers["x-real-ip"] as string) ||
        clientIP;

      // If we detect localhost (::1 or 127.0.0.1), use IPInfo's auto-detect endpoint
      // which will detect the actual public IP of the request origin
      if (!userIP || userIP === "::1" || userIP === "127.0.0.1" || userIP.startsWith("::ffff:127")) {
        // Use IPInfo's auto-detect endpoint - it will detect the client's real IP
        apiUrl = `${IPINFO_BASE_URL}/geo`;
      } else {
        // Use the detected IP
        apiUrl = `${IPINFO_BASE_URL}/${userIP}/geo`;
      }
    }

    // Add token if available
    if (IPINFO_TOKEN) {
      apiUrl += `?token=${IPINFO_TOKEN}`;
    }

    // Fetch from IPInfo API
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("IPInfo API error:", errorText);
      return res.status(response.status).json({
        success: false,
        message: "Failed to fetch geolocation data",
        error: errorText,
      });
    }

    const data = await response.json();

    // Return success response
    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Geo API error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;

