/**
 * Application constants
 */
export const STORAGE_KEYS = {
  TOKEN: 'geoinsight_token',
  USER: 'geoinsight_user',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
} as const;

export const API_ENDPOINTS = {
  LOGIN: '/api/login',
  GEO: '/api/geo',
  HISTORY: '/api/history',
} as const;

export const DATE_FORMAT_OPTIONS = {
  WEEKDAY: 'long',
  MONTH: 'long',
  DAY: 'numeric',
  YEAR: 'numeric',
} as const;

export const TIME_FORMAT_OPTIONS = {
  HOUR: 'numeric',
  MINUTE: '2-digit',
  HOUR12: true,
} as const;

export const HISTORY_DROPDOWN_LIMIT = 5;

