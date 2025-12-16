import { Response, NextFunction } from "express";
import {
  AuthRequest,
  HistoryCreateRequest,
  HistoryDeleteRequest,
} from "../types/index.js";
import { historyService } from "../services/history.service.js";
import { sendSuccess } from "../utils/response.js";

/**
 * Search history controller
 */
export class HistoryController {
  /**
   * Get user's search history
   */
  async getUserHistory(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // userId is guaranteed by requireAuth middleware
    const userId = req.userId!;
    const data = await historyService.getUserHistory(userId);
    sendSuccess(res, data);
  }

  /**
   * Add entry to search history
   */
  async addHistory(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // userId is guaranteed by requireAuth middleware
    const userId = req.userId!;
    const historyData = req.body as HistoryCreateRequest;
    await historyService.addHistory(userId, historyData);

    sendSuccess(res, undefined, "Search history saved");
  }

  /**
   * Delete search history entries
   */
  async deleteHistory(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // userId is guaranteed by requireAuth middleware
    const userId = req.userId!;
    const deleteRequest = req.body as HistoryDeleteRequest;
    await historyService.deleteHistory(userId, deleteRequest);

    sendSuccess(res, undefined, "Search history deleted");
  }
}

export const historyController = new HistoryController();
