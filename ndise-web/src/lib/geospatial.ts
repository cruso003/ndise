/**
 * Geospatial Intelligence Service
 * Provides location tracking and spatial analysis
 */

export interface LocationPoint {
  latitude: number;
  longitude: number;
  accuracy?: number; // meters
  timestamp: string;
  source: 'gps' | 'cell_tower' | 'border_checkpoint' | 'manual';
}

export interface PersonLocation {
  personId: string;
  personName: string;
  personType: 'citizen' | 'foreigner';
  currentLocation?: LocationPoint;
  lastKnownLocation: LocationPoint;
  locationHistory: LocationPoint[];
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
}

export interface BorderCheckpoint {
  id: string;
  name: string;
  type: 'airport' | 'seaport' | 'land';
  location: LocationPoint;
  status: 'operational' | 'closed' | 'limited';
  crossingsToday: number;
  alertsToday: number;
}

export interface ThreatMarker {
  id: string;
  personId: string;
  personName: string;
  location: LocationPoint;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  threatType: 'wanted_person' | 'overstay' | 'suspicious_activity' | 'border_alert';
  description: string;
  timestamp: string;
}

// Border checkpoints in Liberia
const borderCheckpoints: BorderCheckpoint[] = [
  {
    id: 'ria',
    name: 'Roberts International Airport',
    type: 'airport',
    location: { latitude: 6.2338, longitude: -10.3623, timestamp: new Date().toISOString(), source: 'manual' },
    status: 'operational',
    crossingsToday: 320,
    alertsToday: 2
  },
  {
    id: 'jfk',
    name: 'James Spriggs Payne Airport',
    type: 'airport',
    location: { latitude: 6.2891, longitude: -10.7597, timestamp: new Date().toISOString(), source: 'manual' },
    status: 'operational',
    crossingsToday: 45,
    alertsToday: 0
  },
  {
    id: 'port_monrovia',
    name: 'Freeport of Monrovia',
    type: 'seaport',
    location: { latitude: 6.3156, longitude: -10.8074, timestamp: new Date().toISOString(), source: 'manual' },
    status: 'operational',
    crossingsToday: 89,
    alertsToday: 1
  },
  {
    id: 'bo_waterside',
    name: 'Bo Waterside (Sierra Leone border)',
    type: 'land',
    location: { latitude: 7.0167, longitude: -11.2833, timestamp: new Date().toISOString(), source: 'manual' },
    status: 'operational',
    crossingsToday: 234,
    alertsToday: 3
  },
  {
    id: 'ganta',
    name: 'Ganta (Guinea border)',
    type: 'land',
    location: { latitude: 7.2333, longitude: -8.9833, timestamp: new Date().toISOString(), source: 'manual' },
    status: 'operational',
    crossingsToday: 156,
    alertsToday: 1
  }
];

export function getBorderCheckpoints(): BorderCheckpoint[] {
  return borderCheckpoints;
}

export function getThreatMarkers(): ThreatMarker[] {
  // Mock threat markers for map display
  return [
    {
      id: 'threat-001',
      personId: '1990010112345679',
      personName: 'Ahmed Hassan',
      location: {
        latitude: 6.3156,
        longitude: -10.7874,
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        source: 'cell_tower'
      },
      threatLevel: 'critical',
      threatType: 'wanted_person',
      description: 'Wanted for armed robbery, spotted near city center',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
    },
    {
      id: 'threat-002',
      personId: 'FID-2025-NGR-012',
      personName: 'Adeola Smith',
      location: {
        latitude: 6.4281,
        longitude: -9.4295,
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        source: 'cell_tower'
      },
      threatLevel: 'high',
      threatType: 'overstay',
      description: 'Visa overstay: 45 days, last active SIM location',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    }
  ];
}

export function getPersonLocation(personId: string): PersonLocation | null {
  // Mock person location tracking
  return {
    personId,
    personName: 'Ahmed Hassan',
    personType: 'foreigner',
    lastKnownLocation: {
      latitude: 6.3156,
      longitude: -10.7874,
      accuracy: 50,
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      source: 'cell_tower'
    },
    locationHistory: [
      {
        latitude: 6.2338,
        longitude: -10.3623,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'border_checkpoint'
      },
      {
        latitude: 6.3156,
        longitude: -10.8074,
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'cell_tower'
      }
    ],
    riskLevel: 'critical'
  };
}

export function generateHeatMapData() {
  // Generate heat map data for criminal activity, overstays, etc.
  return {
    overstayHotspots: [
      { latitude: 6.3156, longitude: -10.8074, intensity: 0.8, count: 23 }, // Monrovia
      { latitude: 6.7528, longitude: -10.7605, intensity: 0.5, count: 12 }, // Buchanan
    ],
    criminalActivity: [
      { latitude: 6.3156, longitude: -10.8074, intensity: 0.9, count: 45 },
      { latitude: 7.0167, longitude: -11.2833, intensity: 0.6, count: 18 },
    ]
  };
}
