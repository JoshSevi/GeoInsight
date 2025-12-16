import { HistoryItem } from '../../types';
import { HISTORY_DROPDOWN_LIMIT } from '../../constants';

interface HistoryDropdownProps {
  history: HistoryItem[];
  searchTerm: string;
  onSelect: (item: HistoryItem) => void;
  onViewAll: () => void;
}

export default function HistoryDropdown({
  history,
  searchTerm,
  onSelect,
  onViewAll,
}: HistoryDropdownProps) {
  const filtered = history
    .filter((item) =>
      item.ip_address.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, HISTORY_DROPDOWN_LIMIT);

  if (filtered.length === 0) {
    return null;
  }

  return (
    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
      <div className="p-2 text-xs font-semibold text-gray-500 uppercase border-b">
        Recent Searches
      </div>
      {filtered.map((item, index) => (
        <button
          key={`${item.ip_address}-${index}`}
          type="button"
          onClick={() => onSelect(item)}
          className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-gray-900 font-medium">
              {item.ip_address}
            </span>
            {(item.city || item.country) && (
              <span className="text-xs text-gray-500">
                {[item.city, item.country].filter(Boolean).join(', ')}
              </span>
            )}
          </div>
        </button>
      ))}
      <div className="border-t p-2">
        <button
          type="button"
          onClick={onViewAll}
          className="w-full px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors font-medium text-center"
        >
          View All Search History
        </button>
      </div>
    </div>
  );
}

