import { useMemo } from "react";
// Note: we intentionally keep relaxed typing for React-Leaflet here because
// of known type issues with strict/bundler TS configs. Runtime behavior is
// correct; this is only to keep type-checking from blocking builds.
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { GeoLocationData } from "../../types";

// Temporary relaxed typings for React-Leaflet components to avoid build-time
// TypeScript issues in certain bundler/TS configurations. This keeps runtime
// behavior unchanged while allowing deployment to succeed.
// Once the React-Leaflet + Leaflet typings are fully stable with bundler mode,
// these aliases can be removed and components used directly.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TypedMapContainer = MapContainer as unknown as React.ComponentType<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TypedTileLayer = TileLayer as unknown as React.ComponentType<any>;

interface GeoMapProps {
  geoData: GeoLocationData | null;
}

// Fix default marker icon paths for Leaflet when bundled
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

export default function GeoMap({ geoData }: GeoMapProps) {
  const position = useMemo(() => {
    if (!geoData?.loc) return null;
    const [latStr, lonStr] = geoData.loc.split(",");
    const lat = parseFloat(latStr);
    const lon = parseFloat(lonStr);
    if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
    return [lat, lon] as [number, number];
  }, [geoData?.loc]);

  if (!position) {
    return null;
  }

  return (
    <div className="mt-6 h-96 w-full rounded-lg overflow-hidden border border-gray-200">
      <TypedMapContainer
        center={position}
        zoom={12}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TypedTileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <div className="text-sm">
              <div className="font-semibold">
                {geoData?.city && geoData?.country
                  ? `${geoData.city}, ${geoData.country}`
                  : geoData?.ip}
              </div>
              {geoData?.ip && (
                <div className="text-gray-600">IP: {geoData.ip}</div>
              )}
              {geoData?.loc && (
                <div className="text-gray-600">Coords: {geoData.loc}</div>
              )}
            </div>
          </Popup>
        </Marker>
      </TypedMapContainer>
    </div>
  );
}
