/**
 * Validation utilities
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize email (lowercase and trim)
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Validate password (basic validation)
 */
export function isValidPassword(password: string): boolean {
  return typeof password === "string" && password.length >= 6;
}

/**
 * Validate required field
 */
export function isRequired(value: unknown, fieldName: string): void {
  if (value === undefined || value === null || value === "") {
    throw new Error(`${fieldName} is required`);
  }
}
