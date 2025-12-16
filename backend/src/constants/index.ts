/**
 * Application constants
 */
export const BCRYPT_SALT_ROUNDS = 10;
export const HISTORY_LIMIT = 10;
export const BEARER_TOKEN_PREFIX = "Bearer ";

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
} as const;
