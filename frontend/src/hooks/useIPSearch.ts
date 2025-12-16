import { useState, useCallback } from 'react';
import { isValidIP } from '../utils';

interface UseIPSearchReturn {
  ipInput: string;
  ipError: string | null;
  isSearching: boolean;
  setIpInput: (value: string) => void;
  validateIP: (ip: string) => boolean;
  clearInput: () => void;
  clearError: () => void;
  setSearching: (value: boolean) => void;
}

/**
 * Custom hook for managing IP search input and validation
 */
export function useIPSearch(): UseIPSearchReturn {
  const [ipInput, setIpInput] = useState('');
  const [ipError, setIpError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const validateIP = useCallback((ip: string): boolean => {
    const trimmedIP = ip.trim();

    if (!trimmedIP) {
      setIpError('Please enter an IP address');
      return false;
    }

    if (!isValidIP(trimmedIP)) {
      setIpError(
        'Invalid IP address format. Please enter a valid IPv4 (e.g., 8.8.8.8) or IPv6 address.'
      );
      return false;
    }

    setIpError(null);
    return true;
  }, []);

  const clearInput = useCallback(() => {
    setIpInput('');
    setIpError(null);
  }, []);

  const clearError = useCallback(() => {
    setIpError(null);
  }, []);

  const setSearching = useCallback((value: boolean) => {
    setIsSearching(value);
  }, []);

  return {
    ipInput,
    ipError,
    isSearching,
    setIpInput,
    validateIP,
    clearInput,
    clearError,
    setSearching,
  };
}

