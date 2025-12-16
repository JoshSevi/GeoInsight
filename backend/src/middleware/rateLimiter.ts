import rateLimit from "express-rate-limit";
import { Request, Response } from "express";
import { config } from "../config/index.js";
import { logger } from "../utils/logger.js";

/**
 * General API rate limiter
 * Limits: 300 requests per 1 minute per IP
 */
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip rate limiting in test environment
  skip: () => config.nodeEnv === "test",
  // Custom handler to log rate limit violations
  handler: (req: Request, res: Response) => {
    logger.warn("API rate limit exceeded", {
      ip: req.ip,
      path: req.path,
      method: req.method,
    });
    res.status(429).json({
      success: false,
      message: "Too many requests from this IP, please try again later.",
    });
  },
});

/**
 * Strict rate limiter for authentication endpoints
 * Limits: 5 requests per 1 minute per IP
 * Prevents brute force attacks on login/signup
 */
export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 login/signup attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => config.nodeEnv === "test",
  // Skip successful requests (only count failed attempts)
  skipSuccessfulRequests: false,
  // Custom handler to log rate limit violations and return proper error
  handler: (req: Request, res: Response) => {
    logger.warn(
      "Authentication rate limit exceeded - possible brute force attack",
      {
        ip: req.ip,
        path: req.path,
        method: req.method,
        body: req.body?.email ? { email: req.body.email } : undefined, // Log email for tracking
      }
    );
    res.status(429).json({
      success: false,
      message:
        "Too many authentication attempts, please try again after 1 minute.",
    });
  },
});

/**
 * Geo API rate limiter
 * Limits: 50 requests per 5 minutes per IP
 * Prevents abuse of geolocation API
 */
export const geoLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // Limit each IP to 30 geo requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => config.nodeEnv === "test",
  // Custom handler to log rate limit violations
  handler: (req: Request, res: Response) => {
    logger.warn("Geo API rate limit exceeded", {
      ip: req.ip,
      path: req.path,
      method: req.method,
    });
    res.status(429).json({
      success: false,
      message: "Too many geolocation requests, please try again later.",
    });
  },
});
