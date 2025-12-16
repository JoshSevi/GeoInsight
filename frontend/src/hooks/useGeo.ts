import { useState, useCallback } from 'react';
import { getGeo, GeoResponse } from '../lib/api';
import { GeoLocationData } from '../types';

interface UseGeoReturn {
  geoData: GeoLocationData | null;
  loading: boolean;
  error: string | null;
  fetchGeo: (ip?: string, token?: string) => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for managing geolocation data
 */
export function useGeo(): UseGeoReturn {
  const [geoData, setGeoData] = useState<GeoLocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGeo = useCallback(async (ip?: string, token?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response: GeoResponse = await getGeo(ip, token);
      if (response.success && response.data) {
        setGeoData(response.data);
      } else {
        setError(response.message || 'Failed to fetch geolocation');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch geolocation';
      setError(errorMessage);
      setGeoData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    geoData,
    loading,
    error,
    fetchGeo,
    clearError,
  };
}

