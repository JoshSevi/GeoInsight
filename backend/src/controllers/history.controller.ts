import { Response, NextFunction } from "express";
import {
  AuthRequest,
  HistoryCreateRequest,
  HistoryDeleteRequest,
} from "../types/index.js";
import { historyService } from "../services/history.service.js";
import { sendSuccess } from "../utils/response.js";
import { AuthenticationError } from "../utils/errors.js";

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
    try {
      const userId = req.userId;
      if (!userId) {
        throw new AuthenticationError("User not authenticated");
      }

      const data = await historyService.getUserHistory(userId);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add entry to search history
   */
  async addHistory(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        throw new AuthenticationError("User not authenticated");
      }

      const historyData = req.body as HistoryCreateRequest;
      await historyService.addHistory(userId, historyData);

      sendSuccess(res, undefined, "Search history saved");
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete search history entries
   */
  async deleteHistory(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        throw new AuthenticationError("User not authenticated");
      }

      const deleteRequest = req.body as HistoryDeleteRequest;
      await historyService.deleteHistory(userId, deleteRequest);

      sendSuccess(res, undefined, "Search history deleted");
    } catch (error) {
      next(error);
    }
  }
}

export const historyController = new HistoryController();
