import express from "express";
import { authController } from "../controllers/auth.controller.js";
import { routeHandler } from "../utils/routeHandler.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

/**
 * POST /api/login
 * Authenticate user and return JWT token
 * Rate limited: 5 requests per 15 minutes per IP
 */
router.post(
  "/login",
  authLimiter,
  routeHandler(authController.login.bind(authController))
);

/**
 * POST /api/signup
 * Register a new user and return JWT token
 * Rate limited: 5 requests per 15 minutes per IP
 */
router.post(
  "/signup",
  authLimiter,
  routeHandler(authController.signup.bind(authController))
);

export default router;
