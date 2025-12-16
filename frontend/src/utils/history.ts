import { HistoryItem } from '../types';

/**
 * Group history items by date
 * Returns array of [dateKey, items[]] tuples sorted by date (most recent first)
 */
export function groupHistoryByDate(history: HistoryItem[]): [string, HistoryItem[]][] {
  const grouped: { [key: string]: HistoryItem[] } = {};

  history.forEach((item) => {
    const date = new Date(item.created_at);
    const dateKey = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      .toISOString()
      .split('T')[0];

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(item);
  });

  // Sort dates in descending order (most recent first)
  return Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0]));
}

/**
 * Filter history items by search term
 */
export function filterHistory(history: HistoryItem[], searchTerm: string): HistoryItem[] {
  if (!searchTerm.trim()) {
    return history;
  }

  const lowerSearch = searchTerm.toLowerCase();
  return history.filter((item) =>
    item.ip_address.toLowerCase().includes(lowerSearch)
  );
}

