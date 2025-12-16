import express from "express";
import { authController } from "../controllers/auth.controller.js";
import { routeHandler } from "../utils/routeHandler.js";

const router = express.Router();

/**
 * POST /api/login
 * Authenticate user and return JWT token
 */
router.post("/login", routeHandler(authController.login.bind(authController)));

/**
 * POST /api/signup
 * Register a new user and return JWT token
 */
router.post("/signup", routeHandler(authController.signup.bind(authController)));

export default router;
