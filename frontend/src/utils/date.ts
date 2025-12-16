/**
 * Date formatting utilities
 */

/**
 * Format date header with relative labels (Today, Yesterday, or full date)
 */
export function formatDateHeader(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time for comparison
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const dateFormatted = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  if (dateOnly.getTime() === todayOnly.getTime()) {
    return `Today - ${dayName}, ${dateFormatted}`;
  } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
    return `Yesterday - ${dayName}, ${dateFormatted}`;
  } else {
    return `${dayName}, ${dateFormatted}`;
  }
}

/**
 * Format time from date string
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get date key for grouping (YYYY-MM-DD format)
 */
export function getDateKey(dateString: string): string {
  const date = new Date(dateString);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
    .toISOString()
    .split('T')[0];
}

