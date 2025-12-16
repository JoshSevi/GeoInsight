/**
 * Validates if a string is a valid IP address (IPv4 or IPv6)
 */
export function isValidIP(ip: string): boolean {
  if (!ip || typeof ip !== "string") {
    return false;
  }

  const trimmedIp = ip.trim();
  if (!trimmedIp) {
    return false;
  }

  // IPv4 regex pattern
  const ipv4Pattern =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  // IPv6 regex pattern (simplified)
  const ipv6Pattern =
    /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$|^(?:[0-9a-fA-F]{1,4}:)*::(?:[0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4}$/;

  return ipv4Pattern.test(trimmedIp) || ipv6Pattern.test(trimmedIp);
}

