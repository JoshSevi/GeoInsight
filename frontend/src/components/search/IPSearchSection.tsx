import { FormEvent } from 'react';
import { HistoryItem } from '../../types';
import HistoryDropdown from '../history/HistoryDropdown';
import Button from '../ui/Button';

interface IPSearchSectionProps {
  ipInput: string;
  ipError: string | null;
  isSearching: boolean;
  loading: boolean;
  showHistoryDropdown: boolean;
  filteredHistory: HistoryItem[];
  onInputChange: (value: string) => void;
  onInputFocus: () => void;
  onInputBlur: () => void;
  onSearch: (e: FormEvent<HTMLFormElement>) => void;
  onClear: () => void;
  onHistorySelect: (item: HistoryItem) => void;
  onViewAllHistory: () => void;
  showClearButton: boolean;
}

export default function IPSearchSection({
  ipInput,
  ipError,
  isSearching,
  loading,
  showHistoryDropdown,
  filteredHistory,
  onInputChange,
  onInputFocus,
  onInputBlur,
  onSearch,
  onClear,
  onHistorySelect,
  onViewAllHistory,
  showClearButton,
}: IPSearchSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Search IP Address
      </h2>
      <form onSubmit={onSearch} className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={ipInput}
              onChange={(e) => onInputChange(e.target.value)}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
              placeholder="Enter IP address (e.g., 8.8.8.8)"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                ipError ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              disabled={loading || isSearching}
            />
            {showHistoryDropdown && filteredHistory.length > 0 && (
              <HistoryDropdown
                history={filteredHistory}
                searchTerm={ipInput}
                onSelect={onHistorySelect}
                onViewAll={onViewAllHistory}
              />
            )}
            {ipError && (
              <p className="mt-2 text-sm text-red-600">{ipError}</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={loading || isSearching}
            loading={isSearching}
          >
            Search
          </Button>
        </div>
        {showClearButton && (
          <Button
            type="button"
            variant="secondary"
            onClick={onClear}
            disabled={loading || isSearching}
            className="text-sm"
          >
            Clear Search
          </Button>
        )}
      </form>
    </div>
  );
}

