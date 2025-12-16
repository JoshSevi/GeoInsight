import { HistoryItem } from '../../types';
import { formatDateHeader, groupHistoryByDate } from '../../utils';
import HistoryItemComponent from './HistoryItem';
import Button from '../ui/Button';

interface SearchHistorySectionProps {
  history: HistoryItem[];
  selectedItems: Set<string>; // Stores history item IDs
  isDeleting: boolean;
  onToggleSelect: (itemId: string) => void;
  onSelectAll: (checked: boolean) => void;
  onDeleteSelected: () => void;
  onHistorySelect: (item: HistoryItem) => void;
}

export default function SearchHistorySection({
  history,
  selectedItems,
  isDeleting,
  onToggleSelect,
  onSelectAll,
  onDeleteSelected,
  onHistorySelect,
}: SearchHistorySectionProps) {
  if (history.length === 0) {
    return null;
  }

  const allSelected = history.length > 0 && selectedItems.size === history.length;

  return (
    <div
      className="bg-white rounded-lg shadow p-6 mt-6"
      data-history-section
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Search History</h2>
        {selectedItems.size > 0 && (
          <Button
            variant="danger"
            onClick={onDeleteSelected}
            disabled={isDeleting}
            loading={isDeleting}
            className="text-sm"
          >
            Delete {selectedItems.size}{' '}
            {selectedItems.size === 1 ? 'item' : 'items'}
          </Button>
        )}
      </div>
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {/* Select All Checkbox */}
        <div className="flex items-center p-2 border-b border-gray-200 sticky top-0 bg-white z-10">
          <input
            type="checkbox"
            id="select-all"
            checked={allSelected}
            onChange={(e) => onSelectAll(e.target.checked)}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label
            htmlFor="select-all"
            className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
          >
            Select All
          </label>
        </div>
        {/* Grouped History Items */}
        {groupHistoryByDate(history).map(([dateKey, items]) => (
          <div key={dateKey} className="space-y-2">
            {/* Date Header */}
            <div className="text-sm font-medium text-gray-500 pt-2">
              {formatDateHeader(items[0].created_at)}
            </div>
            {/* History Items for this date */}
            {items.map((item, index) => (
              <HistoryItemComponent
                key={`${item.id}-${dateKey}-${index}`}
                item={item}
                dateKey={dateKey}
                index={index}
                isSelected={selectedItems.has(item.id)}
                onToggleSelect={onToggleSelect}
                onSelect={onHistorySelect}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

