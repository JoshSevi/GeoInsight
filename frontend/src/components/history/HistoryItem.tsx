import { HistoryItem as HistoryItemType } from '../../types';
import { formatTime } from '../../utils';

interface HistoryItemProps {
  item: HistoryItemType;
  dateKey: string;
  index: number;
  isSelected: boolean;
  onToggleSelect: (ip: string) => void;
  onSelect: (item: HistoryItemType) => void;
}

export default function HistoryItem({
  item,
  dateKey,
  index,
  isSelected,
  onToggleSelect,
  onSelect,
}: HistoryItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
      <input
        type="checkbox"
        id={`history-${dateKey}-${index}`}
        checked={isSelected}
        onChange={() => onToggleSelect(item.ip_address)}
        onClick={(e) => e.stopPropagation()}
        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 flex-shrink-0"
      />
      <button
        onClick={() => onSelect(item)}
        className="flex-1 flex items-center gap-2 text-left"
      >
        <span className="font-mono text-gray-900 font-medium">
          {item.ip_address}
        </span>
        {(item.city || item.country) && (
          <span className="text-sm text-gray-600">
            {[item.city, item.country].filter(Boolean).join(', ')}
          </span>
        )}
      </button>
      <span className="text-sm text-gray-500 flex-shrink-0">
        {formatTime(item.created_at)}
      </span>
    </div>
  );
}

