import { useState, useCallback, useEffect } from 'react';
import { getHistory, saveHistory, deleteHistory } from '../lib/api';
import { HistoryItem } from '../types';

interface UseHistoryReturn {
  history: HistoryItem[];
  loading: boolean;
  error: string | null;
  loadHistory: () => Promise<void>;
  addToHistory: (ip: string, city?: string, country?: string) => Promise<void>;
  deleteHistoryItems: (ips: string[]) => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for managing search history
 */
export function useHistory(token: string | null): UseHistoryReturn {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    if (!token) {
      setHistory([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getHistory(token);
      if (response.success && response.data) {
        setHistory(response.data);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error('Error loading search history:', err);
      setHistory([]);
      setError('Failed to load search history');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addToHistory = useCallback(
    async (ip: string, city?: string, country?: string) => {
      if (!token) return;

      try {
        await saveHistory(ip, token, city, country);
        // Reload history to get updated list
        await loadHistory();
      } catch (err) {
        console.error('Error saving search history:', err);
        // Don't set error state for background operations
      }
    },
    [token, loadHistory]
  );

  const deleteHistoryItems = useCallback(
    async (ids: string[]) => {
      if (!token || ids.length === 0) return;

      setLoading(true);
      setError(null);

      try {
        await deleteHistory(ids, token);
        await loadHistory();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete search history';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [token, loadHistory]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load history when token changes
  useEffect(() => {
    if (token) {
      loadHistory();
    }
  }, [token, loadHistory]);

  return {
    history,
    loading,
    error,
    loadHistory,
    addToHistory,
    deleteHistoryItems,
    clearError,
  };
}

