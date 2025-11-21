import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Maximize2, Minimize2, Layers, Crosshair, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export interface MapMarker {
  id: string;
  position: [number, number]; // [lat, lng]
  title: string;
  description?: string;
  type: 'camera' | 'border' | 'checkpoint' | 'incident' | 'person' | 'vehicle' | 'alert' | 'government' | 'airport' | 'port';
  status?: 'active' | 'warning' | 'critical' | 'normal' | 'offline';
  data?: any;
  iconColor?: string;
}

export interface HeatmapPoint {
  position: [number, number];
  intensity: number; // 0-100
  radius?: number;
  color?: string;
}

export interface RouteData {
  id: string;
  path: [number, number][];
  color?: string;
  label?: string;
  dashArray?: string;
}

export interface GeospatialMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  heatmapPoints?: HeatmapPoint[];
  routes?: RouteData[];
  height?: string;
  showControls?: boolean;
  showLayers?: boolean;
  enableFullscreen?: boolean;
  onMarkerClick?: (marker: MapMarker) => void;
  className?: string;
}

// Custom marker icons based on type and status
const createCustomIcon = (type: MapMarker['type'], status?: string, color?: string) => {
  const getColor = () => {
    if (color) return color;
    if (status === 'critical') return '#ef4444';
    if (status === 'warning') return '#f59e0b';
    if (status === 'active') return '#10b981';
    if (status === 'offline') return '#6b7280';

    // Default colors by type
    switch (type) {
      case 'camera': return '#3b82f6';
      case 'border': return '#8b5cf6';
      case 'checkpoint': return '#ec4899';
      case 'incident': return '#ef4444';
      case 'person': return '#f59e0b';
      case 'vehicle': return '#06b6d4';
      case 'alert': return '#dc2626';
      case 'government': return '#6366f1';
      case 'airport': return '#14b8a6';
      case 'port': return '#0891b2';
      default: return '#3b82f6';
    }
  };

  const getSymbol = () => {
    switch (type) {
      case 'camera': return '📹';
      case 'border': return '🛂';
      case 'checkpoint': return '🚧';
      case 'incident': return '⚠️';
      case 'person': return '👤';
      case 'vehicle': return '🚗';
      case 'alert': return '🚨';
      case 'government': return '🏛️';
      case 'airport': return '✈️';
      case 'port': return '⚓';
      default: return '📍';
    }
  };

  const iconColor = getColor();
  const symbol = getSymbol();

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative;">
        <div style="
          width: 32px;
          height: 32px;
          background: ${iconColor};
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="
            transform: rotate(45deg);
            font-size: 16px;
          ">${symbol}</span>
        </div>
        ${status === 'critical' || status === 'warning' ? `
          <div style="
            position: absolute;
            top: -4px;
            right: -4px;
            width: 12px;
            height: 12px;
            background: ${status === 'critical' ? '#dc2626' : '#f59e0b'};
            border: 2px solid white;
            border-radius: 50%;
            animation: pulse 2s infinite;
          "></div>
        ` : ''}
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      </style>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Component to handle map layer changes
function MapLayerControl({ layer }: { layer: string }) {
  const map = useMap();

  useEffect(() => {
    // Clear existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    // Add new tile layer based on selection
    let tileLayer;
    switch (layer) {
      case 'satellite':
        tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Esri',
          maxZoom: 18,
        });
        break;
      case 'dark':
        tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: 'CartoDB',
          maxZoom: 19,
        });
        break;
      case 'terrain':
        tileLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
          attribution: 'OpenTopoMap',
          maxZoom: 17,
        });
        break;
      default: // streets
        tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'OpenStreetMap',
          maxZoom: 19,
        });
    }

    tileLayer.addTo(map);
  }, [layer, map]);

  return null;
}

// Component to handle centering on coordinates
function MapCenterControl({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

export default function GeospatialMap({
  center = [6.315, -10.801], // Monrovia, Liberia default
  zoom = 10,
  markers = [],
  heatmapPoints = [],
  routes = [],
  height = '600px',
  showControls = true,
  showLayers = true,
  enableFullscreen = true,
  onMarkerClick,
  className = '',
}: GeospatialMapProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState('streets');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!mapContainerRef.current) return;

    if (!isFullscreen) {
      if (mapContainerRef.current.requestFullscreen) {
        mapContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'active': return 'bg-green-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div
      ref={mapContainerRef}
      className={`relative rounded-lg overflow-hidden shadow-lg border border-slate-200 ${className}`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        zoomControl={false}
      >
        <MapLayerControl layer={selectedLayer} />
        <MapCenterControl center={center} />

        {/* Markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={createCustomIcon(marker.type, marker.status, marker.iconColor)}
            eventHandlers={{
              click: () => onMarkerClick?.(marker),
            }}
          >
            <Popup>
              <div className="p-2">
                <div className="font-bold text-sm mb-1">{marker.title}</div>
                {marker.description && (
                  <div className="text-xs text-slate-600 mb-2">{marker.description}</div>
                )}
                {marker.status && (
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(marker.status)}`} />
                    <span className="text-xs capitalize">{marker.status}</span>
                  </div>
                )}
                <div className="text-xs text-slate-500 mt-1">
                  {marker.position[0].toFixed(4)}, {marker.position[1].toFixed(4)}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Heatmap circles */}
        {showHeatmap && heatmapPoints.map((point, index) => (
          <Circle
            key={`heatmap-${index}`}
            center={point.position}
            radius={point.radius || (point.intensity * 100)}
            pathOptions={{
              color: point.color || '#ef4444',
              fillColor: point.color || '#ef4444',
              fillOpacity: point.intensity / 200,
              weight: 1,
            }}
          />
        ))}

        {/* Routes */}
        {showRoutes && routes.map((route) => (
          <Polyline
            key={route.id}
            positions={route.path}
            pathOptions={{
              color: route.color || '#3b82f6',
              weight: 3,
              opacity: 0.7,
              dashArray: route.dashArray,
            }}
          >
            {route.label && (
              <Popup>
                <div className="text-sm font-medium">{route.label}</div>
              </Popup>
            )}
          </Polyline>
        ))}

        {/* Default tile layer - will be replaced by MapLayerControl */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
      </MapContainer>

      {/* Controls Overlay */}
      {showControls && (
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
          {/* Fullscreen Toggle */}
          {enableFullscreen && (
            <button
              onClick={toggleFullscreen}
              className="bg-white hover:bg-slate-50 text-slate-700 p-2 rounded-lg shadow-lg transition-colors border border-slate-200"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          )}

          {/* Layer Selector */}
          {showLayers && (
            <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-2">
              <div className="flex items-center gap-1 mb-2 px-1">
                <Layers className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-medium text-slate-600">Map Layer</span>
              </div>
              <div className="space-y-1">
                {[
                  { value: 'streets', label: 'Streets' },
                  { value: 'satellite', label: 'Satellite' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'terrain', label: 'Terrain' },
                ].map((layer) => (
                  <button
                    key={layer.value}
                    onClick={() => setSelectedLayer(layer.value)}
                    className={`w-full text-left px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      selectedLayer === layer.value
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {layer.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Toggle Controls */}
          <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-2 space-y-1">
            {heatmapPoints.length > 0 && (
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`w-full text-left px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  showHeatmap
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Crosshair className="w-3 h-3" />
                  Heatmap
                </div>
              </button>
            )}
            {routes.length > 0 && (
              <button
                onClick={() => setShowRoutes(!showRoutes)}
                className={`w-full text-left px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  showRoutes
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Navigation className="w-3 h-3" />
                  Routes
                </div>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      {markers.length > 0 && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200 p-3 max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-slate-600" />
            <span className="text-xs font-bold text-slate-700">Map Legend</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Array.from(new Set(markers.map(m => m.type))).map((type) => (
              <div key={type} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full border border-white shadow-sm"
                  style={{
                    background: (() => {
                      const iconHtml = createCustomIcon(type as any).options.html;
                      if (typeof iconHtml === 'string') {
                        if (iconHtml.includes('#ef4444')) return '#ef4444';
                        if (iconHtml.includes('#f59e0b')) return '#f59e0b';
                        if (iconHtml.includes('#10b981')) return '#10b981';
                      }
                      return '#3b82f6';
                    })()
                  }}
                />
                <span className="text-slate-600 capitalize">{type}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
