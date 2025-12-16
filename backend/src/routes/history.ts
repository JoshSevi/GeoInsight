import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { historyController } from "../controllers/history.controller.js";
import { routeHandler } from "../utils/routeHandler.js";

const router = express.Router();

// All history routes require authentication
router.use(authenticateToken, requireAuth);

/**
 * GET /api/history
 * Get user's search history
 */
router.get(
  "/history",
  routeHandler(historyController.getUserHistory.bind(historyController))
);

/**
 * POST /api/history
 * Add entry to search history
 */
router.post(
  "/history",
  routeHandler(historyController.addHistory.bind(historyController))
);

/**
 * DELETE /api/history
 * Delete search history entries
 */
router.delete(
  "/history",
  routeHandler(historyController.deleteHistory.bind(historyController))
);

export default router;
