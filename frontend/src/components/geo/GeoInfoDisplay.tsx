import { GeoLocationData } from '../../types';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

interface GeoInfoDisplayProps {
  geoData: GeoLocationData | null;
  loading: boolean;
  error: string | null;
  isSearching: boolean;
}

export default function GeoInfoDisplay({
  geoData,
  loading,
  error,
  isSearching,
}: GeoInfoDisplayProps) {
  if (loading || isSearching) {
    return (
      <LoadingSpinner
        message={
          isSearching
            ? 'Searching geolocation data...'
            : 'Loading geolocation data...'
        }
      />
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!geoData) {
    return null;
  }

  return (
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
            <p className="text-lg text-gray-900 font-mono">{geoData.loc}</p>
          </div>
        )}
      </div>
    </div>
  );
}

