import express from "express";
import { authController } from "../controllers/auth.controller.js";

const router = express.Router();

/**
 * POST /api/login
 * Authenticate user and return JWT token
 */
router.post("/login", (req, res, next) => {
  authController.login(req as express.Request, res, next).catch(next);
});

export default router;
