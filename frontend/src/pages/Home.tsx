import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getGeo, GeoResponse } from '../lib/api';

export default function Home() {
  const { user, logout } = useAuth();
  const [geoData, setGeoData] = useState<GeoResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch current user's IP geolocation on mount
  useEffect(() => {
    fetchCurrentUserGeo();
  }, []);

  const fetchCurrentUserGeo = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getGeo(); // No IP parameter = current user's IP
      if (response.success && response.data) {
        setGeoData(response.data);
      } else {
        setError(response.message || 'Failed to fetch geolocation');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch geolocation');
    } finally {
      setLoading(false);
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
          <p className="text-gray-600">
            Welcome, <span className="font-semibold text-gray-900">{user?.email}</span>
          </p>
        </div>

        {/* IP & Geolocation Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your IP & Geolocation</h2>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-gray-600">Loading geolocation data...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {!loading && !error && geoData && (
            <div className="space-y-4">
              {/* IP Address */}
              <div className="border-b pb-4">
                <label className="block text-sm font-medium text-gray-500 mb-1">IP Address</label>
                <p className="text-xl font-mono text-gray-900">{geoData.ip}</p>
              </div>

              {/* Location Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {geoData.city && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">City</label>
                    <p className="text-lg text-gray-900">{geoData.city}</p>
                  </div>
                )}

                {geoData.region && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Region</label>
                    <p className="text-lg text-gray-900">{geoData.region}</p>
                  </div>
                )}

                {geoData.country && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Country</label>
                    <p className="text-lg text-gray-900">{geoData.country}</p>
                  </div>
                )}

                {geoData.postal && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Postal Code</label>
                    <p className="text-lg text-gray-900">{geoData.postal}</p>
                  </div>
                )}

                {geoData.timezone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Timezone</label>
                    <p className="text-lg text-gray-900">{geoData.timezone}</p>
                  </div>
                )}

                {geoData.loc && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Coordinates</label>
                    <p className="text-lg text-gray-900 font-mono">{geoData.loc}</p>
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

