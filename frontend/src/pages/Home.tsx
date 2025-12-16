import { useEffect, useState, FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { getGeo, GeoResponse } from "../lib/api";
import { isValidIP } from "../utils/ipValidator";

export default function Home() {
  const { user, logout } = useAuth();
  const [geoData, setGeoData] = useState<GeoResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ipInput, setIpInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentUserIP, setCurrentUserIP] = useState<string | null>(null);
  const [ipError, setIpError] = useState<string | null>(null);

  // Fetch current user's IP geolocation on mount
  useEffect(() => {
    fetchCurrentUserGeo();
  }, []);

  const fetchCurrentUserGeo = async () => {
    setLoading(true);
    setError(null);
    setIpError(null);
    setIpInput(""); // Clear input when fetching current user's IP
    try {
      const response = await getGeo(); // No IP parameter = current user's IP
      if (response.success && response.data) {
        setGeoData(response.data);
        setCurrentUserIP(response.data.ip); // Store current user's IP
      } else {
        setError(response.message || "Failed to fetch geolocation");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch geolocation"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setIpInput("");
    setIpError(null);
    setError(null);
    fetchCurrentUserGeo();
  };

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedIP = ipInput.trim();

    // Clear previous errors
    setIpError(null);
    setError(null);

    if (!trimmedIP) {
      setIpError("Please enter an IP address");
      return;
    }

    // Validate IP format
    if (!isValidIP(trimmedIP)) {
      setIpError(
        "Invalid IP address format. Please enter a valid IPv4 (e.g., 8.8.8.8) or IPv6 address."
      );
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await getGeo(trimmedIP);
      if (response.success && response.data) {
        setGeoData(response.data);
        setIpError(null); // Clear any IP errors on success
      } else {
        // Backend validation error (e.g., invalid IP format)
        const errorMsg = response.message || "Failed to fetch geolocation";
        setIpError(errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to fetch geolocation";
      // Check if it's an IP validation error from backend
      if (errorMsg.includes("Invalid IP") || errorMsg.includes("invalid")) {
        setIpError(errorMsg);
      }
      setError(errorMsg);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">GeoInsight</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Logged in as</p>
              <p className="text-lg font-semibold text-gray-900">
                {user?.email}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Your IP Address</p>
              {currentUserIP && (
                <p className="text-lg font-mono font-semibold text-indigo-600">
                  {currentUserIP}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* IP Search Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Search IP Address
          </h2>
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={ipInput}
                  onChange={(e) => {
                    setIpInput(e.target.value);
                    // Clear error when user starts typing
                    if (ipError) {
                      setIpError(null);
                    }
                  }}
                  placeholder="Enter IP address (e.g., 8.8.8.8)"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    ipError ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  disabled={loading || isSearching}
                />
                {ipError && (
                  <p className="mt-2 text-sm text-red-600">{ipError}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || isSearching}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSearching ? "Searching..." : "Search"}
              </button>
            </div>
            {(ipInput || (currentUserIP && geoData?.ip !== currentUserIP)) && (
              <button
                type="button"
                onClick={handleClear}
                disabled={loading || isSearching}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Clear Search
              </button>
            )}
          </form>
        </div>

        {/* IP & Geolocation Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            IP & Geolocation Information
          </h2>

          {(loading || isSearching) && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-gray-600">
                {isSearching
                  ? "Searching geolocation data..."
                  : "Loading geolocation data..."}
              </span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {!loading && !isSearching && !error && geoData && (
            <div className="space-y-4">
              {/* IP Address */}
              <div className="border-b pb-4">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  IP Address
                </label>
                <p className="text-xl font-mono text-gray-900">{geoData.ip}</p>
              </div>

              {/* Location Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {geoData.city && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      City
                    </label>
                    <p className="text-lg text-gray-900">{geoData.city}</p>
                  </div>
                )}

                {geoData.region && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Region
                    </label>
                    <p className="text-lg text-gray-900">{geoData.region}</p>
                  </div>
                )}

                {geoData.country && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Country
                    </label>
                    <p className="text-lg text-gray-900">{geoData.country}</p>
                  </div>
                )}

                {geoData.postal && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Postal Code
                    </label>
                    <p className="text-lg text-gray-900">{geoData.postal}</p>
                  </div>
                )}

                {geoData.timezone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Timezone
                    </label>
                    <p className="text-lg text-gray-900">{geoData.timezone}</p>
                  </div>
                )}

                {geoData.loc && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Coordinates
                    </label>
                    <p className="text-lg text-gray-900 font-mono">
                      {geoData.loc}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
