import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { historyController } from "../controllers/history.controller.js";

const router = express.Router();

/**
 * GET /api/history
 * Get user's search history
 */
router.get("/history", authenticateToken, (req, res, next) => {
  historyController
    .getUserHistory(req as express.Request, res, next)
    .catch(next);
});

/**
 * POST /api/history
 * Add entry to search history
 */
router.post("/history", authenticateToken, (req, res, next) => {
  historyController.addHistory(req as express.Request, res, next).catch(next);
});

/**
 * DELETE /api/history
 * Delete search history entries
 */
router.delete("/history", authenticateToken, (req, res, next) => {
  historyController
    .deleteHistory(req as express.Request, res, next)
    .catch(next);
});

export default router;
