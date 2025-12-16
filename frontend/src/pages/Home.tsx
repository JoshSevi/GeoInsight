import { useEffect, useState, useRef, FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { useGeo, useHistory, useIPSearch } from "../hooks";
import { filterHistory } from "../utils";
import { HistoryItem } from "../types";
import {
  Header,
  WelcomeSection,
  IPSearchSection,
  GeoInfoDisplay,
  SearchHistorySection,
  GeoMap,
} from "../components";

export default function Home() {
  const { user, logout, token } = useAuth();
  const { geoData, loading, error, fetchGeo, clearError } = useGeo();
  const {
    history: searchHistory,
    addToHistory,
    deleteHistoryItems,
  } = useHistory(token);
  const {
    ipInput,
    ipError,
    isSearching,
    setIpInput,
    validateIP,
    clearInput,
    clearError: clearIPError,
    setSearching,
  } = useIPSearch();

  const [currentUserIP, setCurrentUserIP] = useState<string | null>(null);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set()); // Store history item IDs
  const [isDeleting, setIsDeleting] = useState(false);
  const lastHistorySaveRef = useRef<{ ip: string; time: number } | null>(null);

  // Fetch current user's IP geolocation on mount
  useEffect(() => {
    fetchCurrentUserGeo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchCurrentUserGeo = async () => {
    clearInput();
    clearError();
    clearIPError();
    await fetchGeo(undefined, token || undefined);
  };

  // Update currentUserIP when geoData changes and no input
  useEffect(() => {
    if (geoData?.ip && !ipInput) {
      setCurrentUserIP(geoData.ip);
    }
  }, [geoData, ipInput]);

  // Add to history when geoData changes (if it's a search, not current user IP)
  useEffect(() => {
    if (geoData?.ip && geoData.ip !== currentUserIP && ipInput && token) {
      const now = Date.now();
      const last = lastHistorySaveRef.current;

      // Allow same IP to be recorded again if enough time has passed,
      // but prevent accidental duplicates from the same action (very close in time).
      const isDuplicateRecent =
        last && last.ip === geoData.ip && now - last.time < 1000;

      if (!isDuplicateRecent) {
        lastHistorySaveRef.current = { ip: geoData.ip, time: now };
        addToHistory(geoData.ip, geoData.city, geoData.country);
      }
    }
  }, [geoData, currentUserIP, ipInput, token, addToHistory]);

  // Filter history for dropdown
  const filteredHistory = filterHistory(searchHistory, ipInput);

  // Handle selecting an IP from history
  const handleHistorySelect = async (item: HistoryItem) => {
    setIpInput(item.ip_address);
    setShowHistoryDropdown(false);
    clearIPError();
    await handleSearchForIP(item.ip_address);
  };

  // Handle checkbox selection for deletion (using unique IDs)
  const handleCheckboxChange = (itemId: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Handle select all checkboxes
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(searchHistory.map((item) => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  // Handle delete selected items
  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) return;

    setIsDeleting(true);
    try {
      // Delete by IDs for precise deletion
      const selectedIds = Array.from(selectedItems);
      await deleteHistoryItems(selectedIds);
      setSelectedItems(new Set());
    } catch (error) {
      console.error("Error deleting search history:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Search for a specific IP
  const handleSearchForIP = async (ip: string) => {
    setSearching(true);
    clearError();
    clearIPError();

    try {
      await fetchGeo(ip, token || undefined);
    } catch (err) {
      // Error is handled by useGeo hook
    } finally {
      setSearching(false);
    }
  };

  const handleClear = () => {
    clearInput();
    clearIPError();
    clearError();
    fetchCurrentUserGeo();
  };

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedIP = ipInput.trim();

    if (!validateIP(trimmedIP)) {
      return;
    }

    // Hide history dropdown after submitting a search
    setShowHistoryDropdown(false);

    await handleSearchForIP(trimmedIP);
  };

  const handleInputChange = (value: string) => {
    setIpInput(value);
    if (ipError) {
      clearIPError();
    }
    if (value.length > 0) {
      setShowHistoryDropdown(true);
    }
  };

  const handleInputFocus = () => {
    if (searchHistory.length > 0) {
      setShowHistoryDropdown(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowHistoryDropdown(false), 200);
  };

  const handleViewAllHistory = () => {
    setShowHistoryDropdown(false);
    const historySection = document.querySelector("[data-history-section]");
    if (historySection) {
      historySection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const showClearButton = Boolean(
    ipInput || (currentUserIP && geoData?.ip !== currentUserIP)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Header onLogout={logout} />

        <WelcomeSection userEmail={user?.email} currentUserIP={currentUserIP} />

        <IPSearchSection
          ipInput={ipInput}
          ipError={ipError}
          isSearching={isSearching}
          loading={loading}
          showHistoryDropdown={showHistoryDropdown}
          filteredHistory={filteredHistory}
          onInputChange={handleInputChange}
          onInputFocus={handleInputFocus}
          onInputBlur={handleInputBlur}
          onSearch={handleSearch}
          onClear={handleClear}
          onHistorySelect={handleHistorySelect}
          onViewAllHistory={handleViewAllHistory}
          showClearButton={showClearButton}
        />

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            IP & Geolocation Information
          </h2>
          <GeoInfoDisplay
            geoData={geoData}
            loading={loading}
            error={error}
            isSearching={isSearching}
          />
          {/* Map */}
          <GeoMap geoData={geoData} />
        </div>

        <SearchHistorySection
          history={searchHistory}
          selectedItems={selectedItems}
          isDeleting={isDeleting}
          onToggleSelect={handleCheckboxChange}
          onSelectAll={handleSelectAll}
          onDeleteSelected={handleDeleteSelected}
          onHistorySelect={handleHistorySelect}
        />
      </div>
    </div>
  );
}
