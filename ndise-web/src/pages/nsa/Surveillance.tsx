import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Camera, AlertTriangle, MapPin, Activity, Maximize2, Play, Pause, Film,
  Radio, Satellite, Car, Users, Eye, Zap, Target, Navigation, Shield,
  Clock, UserCheck, Crosshair, Wifi
} from 'lucide-react';
import CCTVSurveillance from '../../components/CCTVSurveillance';

interface CameraFeed {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  status: 'online' | 'offline' | 'warning';
  type: 'Airport' | 'Border' | 'City' | 'Port' | 'Government' | 'Highway' | 'Satellite' | 'Drone';
  alerts: number;
  recordingQuality: '4K' | '1080p' | '720p';
  nightVision: boolean;
  motionDetection: boolean;
}

interface FacialTrack {
  id: string;
  personName: string;
  confidence: number;
  firstSeen: string;
  lastSeen: string;
  cameras: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  onWatchlist: boolean;
  timeline: { camera: string; time: string; location: string }[];
}

interface VehicleTrack {
  id: string;
  licensePlate: string;
  vehicleType: string;
  color: string;
  status: 'normal' | 'stolen' | 'suspicious' | 'wanted';
  firstSeen: string;
  lastSeen: string;
  cameras: string[];
  route: { camera: string; time: string; location: string }[];
}

interface Alert {
  id: string;
  type: 'facial_match' | 'stolen_vehicle' | 'suspicious_behavior' | 'perimeter_breach' | 'crowd_anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  location: string;
  camera: string;
  timestamp: string;
  resolved: boolean;
}

export default function Surveillance() {
  const [searchParams] = useSearchParams();
  const [selectedFeed, setSelectedFeed] = useState<string>('CAM-001');
  const [isLive, setIsLive] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'airport' | 'border' | 'city' | 'port' | 'government' | 'highway' | 'aerial'>('all');
  const [showTracking, setShowTracking] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);

  // Check if we have a target person for enhanced surveillance
  const targetId = searchParams.get('targetId');
  const targetName = searchParams.get('targetName');
  const targetPerson = targetId && targetName ? {
    nationalId: targetId,
    name: targetName,
  } : undefined;

  // Generate 24 comprehensive camera feeds
  const feeds: CameraFeed[] = [
    // Airport (4)
    { id: 'CAM-001', name: 'RIA Terminal Main Entrance', location: 'Roberts Intl Airport', coordinates: { lat: 6.234, lng: -10.362 }, status: 'online', type: 'Airport', alerts: 2, recordingQuality: '4K', nightVision: true, motionDetection: true },
    { id: 'CAM-002', name: 'RIA Customs & Immigration', location: 'Roberts Intl Airport', coordinates: { lat: 6.235, lng: -10.363 }, status: 'online', type: 'Airport', alerts: 0, recordingQuality: '4K', nightVision: true, motionDetection: true },
    { id: 'CAM-003', name: 'RIA Baggage Claim Area', location: 'Roberts Intl Airport', coordinates: { lat: 6.236, lng: -10.361 }, status: 'online', type: 'Airport', alerts: 1, recordingQuality: '1080p', nightVision: false, motionDetection: true },
    { id: 'CAM-004', name: 'RIA Departure Gates', location: 'Roberts Intl Airport', coordinates: { lat: 6.237, lng: -10.364 }, status: 'online', type: 'Airport', alerts: 0, recordingQuality: '1080p', nightVision: false, motionDetection: true },

    // Border (5)
    { id: 'CAM-005', name: 'Bo Waterside Border Crossing', location: 'Grand Cape Mount', coordinates: { lat: 7.275, lng: -11.032 }, status: 'online', type: 'Border', alerts: 3, recordingQuality: '4K', nightVision: true, motionDetection: true },
    { id: 'CAM-006', name: 'Ganta Border Post Main Gate', location: 'Nimba County', coordinates: { lat: 7.235, lng: -8.983 }, status: 'online', type: 'Border', alerts: 1, recordingQuality: '1080p', nightVision: true, motionDetection: true },
    { id: 'CAM-007', name: 'Ganta Border Vehicle Inspection', location: 'Nimba County', coordinates: { lat: 7.236, lng: -8.984 }, status: 'warning', type: 'Border', alerts: 5, recordingQuality: '1080p', nightVision: true, motionDetection: true },
    { id: 'CAM-008', name: 'Harper Border Checkpoint', location: 'Maryland County', coordinates: { lat: 4.375, lng: -7.717 }, status: 'online', type: 'Border', alerts: 0, recordingQuality: '720p', nightVision: true, motionDetection: true },
    { id: 'CAM-009', name: 'Loguatuo Border Post', location: 'Lofa County', coordinates: { lat: 8.281, lng: -9.752 }, status: 'online', type: 'Border', alerts: 2, recordingQuality: '1080p', nightVision: true, motionDetection: true },

    // City (6)
    { id: 'CAM-010', name: 'Red Light Junction', location: 'Paynesville, Monrovia', coordinates: { lat: 6.298, lng: -10.747 }, status: 'online', type: 'City', alerts: 4, recordingQuality: '4K', nightVision: true, motionDetection: true },
    { id: 'CAM-011', name: 'Broad Street Downtown', location: 'Central Monrovia', coordinates: { lat: 6.301, lng: -10.797 }, status: 'online', type: 'City', alerts: 1, recordingQuality: '4K', nightVision: true, motionDetection: true },
    { id: 'CAM-012', name: 'Sinkor Supermarket Area', location: 'Sinkor, Monrovia', coordinates: { lat: 6.316, lng: -10.790 }, status: 'online', type: 'City', alerts: 0, recordingQuality: '1080p', nightVision: true, motionDetection: true },
    { id: 'CAM-013', name: 'Tubman Boulevard Junction', location: 'Congo Town', coordinates: { lat: 6.321, lng: -10.777 }, status: 'online', type: 'City', alerts: 2, recordingQuality: '1080p', nightVision: true, motionDetection: true },
    { id: 'CAM-014', name: 'SKD Boulevard & 12th Street', location: 'Sinkor', coordinates: { lat: 6.324, lng: -10.785 }, status: 'warning', type: 'City', alerts: 6, recordingQuality: '4K', nightVision: true, motionDetection: true },
    { id: 'CAM-015', name: 'Duport Road Checkpoint', location: 'Paynesville', coordinates: { lat: 6.302, lng: -10.732 }, status: 'online', type: 'City', alerts: 1, recordingQuality: '1080p', nightVision: true, motionDetection: true },

    // Port (2)
    { id: 'CAM-016', name: 'Freeport Main Gate', location: 'Bushrod Island', coordinates: { lat: 6.347, lng: -10.788 }, status: 'online', type: 'Port', alerts: 0, recordingQuality: '4K', nightVision: true, motionDetection: true },
    { id: 'CAM-017', name: 'Freeport Container Terminal', location: 'Bushrod Island', coordinates: { lat: 6.348, lng: -10.789 }, status: 'online', type: 'Port', alerts: 0, recordingQuality: '1080p', nightVision: true, motionDetection: true },

    // Government (3)
    { id: 'CAM-018', name: 'Capitol Building Perimeter', location: 'Capitol Hill', coordinates: { lat: 6.314, lng: -10.804 }, status: 'online', type: 'Government', alerts: 0, recordingQuality: '4K', nightVision: true, motionDetection: true },
    { id: 'CAM-019', name: 'Ministry of Justice Entrance', location: 'Central Monrovia', coordinates: { lat: 6.307, lng: -10.799 }, status: 'online', type: 'Government', alerts: 0, recordingQuality: '4K', nightVision: true, motionDetection: true },
    { id: 'CAM-020', name: 'Executive Mansion Gate', location: 'Capitol Hill', coordinates: { lat: 6.315, lng: -10.803 }, status: 'online', type: 'Government', alerts: 1, recordingQuality: '4K', nightVision: true, motionDetection: true },

    // Highway (2)
    { id: 'CAM-021', name: 'Kakata Highway KM 45', location: 'Margibi County', coordinates: { lat: 6.529, lng: -10.348 }, status: 'online', type: 'Highway', alerts: 1, recordingQuality: '1080p', nightVision: true, motionDetection: true },
    { id: 'CAM-022', name: 'Robertsport Highway Junction', location: 'Grand Cape Mount', coordinates: { lat: 6.756, lng: -11.368 }, status: 'online', type: 'Highway', alerts: 0, recordingQuality: '720p', nightVision: true, motionDetection: true },

    // Aerial (2)
    { id: 'SAT-001', name: 'Monrovia Satellite Overview', location: 'Orbital - Greater Monrovia', coordinates: { lat: 6.315, lng: -10.801 }, status: 'online', type: 'Satellite', alerts: 0, recordingQuality: '4K', nightVision: false, motionDetection: false },
    { id: 'DRONE-001', name: 'Tactical Drone Alpha', location: 'Mobile - Border Region', coordinates: { lat: 7.280, lng: -11.035 }, status: 'online', type: 'Drone', alerts: 2, recordingQuality: '4K', nightVision: true, motionDetection: true },
  ];

  // Active facial recognition tracks
  const facialTracks: FacialTrack[] = [
    {
      id: 'FACE-9012',
      personName: 'Ahmed Hassan',
      confidence: 94,
      firstSeen: '14:22:15',
      lastSeen: '14:45:33',
      cameras: ['CAM-010', 'CAM-011', 'CAM-013'],
      riskLevel: 'critical',
      onWatchlist: true,
      timeline: [
        { camera: 'CAM-010', time: '14:22:15', location: 'Red Light Junction' },
        { camera: 'CAM-011', time: '14:31:42', location: 'Broad Street Downtown' },
        { camera: 'CAM-013', time: '14:45:33', location: 'Tubman Boulevard Junction' }
      ]
    },
    {
      id: 'FACE-9013',
      personName: 'Sarah Williams',
      confidence: 89,
      firstSeen: '13:15:22',
      lastSeen: '14:52:11',
      cameras: ['CAM-001', 'CAM-002', 'CAM-010'],
      riskLevel: 'high',
      onWatchlist: true,
      timeline: [
        { camera: 'CAM-001', time: '13:15:22', location: 'RIA Terminal Main' },
        { camera: 'CAM-002', time: '13:28:45', location: 'RIA Customs' },
        { camera: 'CAM-010', time: '14:52:11', location: 'Red Light Junction' }
      ]
    },
    {
      id: 'FACE-9014',
      personName: 'Emmanuel Togba',
      confidence: 91,
      firstSeen: '12:05:18',
      lastSeen: '14:12:30',
      cameras: ['CAM-005', 'CAM-021'],
      riskLevel: 'medium',
      onWatchlist: false,
      timeline: [
        { camera: 'CAM-005', time: '12:05:18', location: 'Bo Waterside Border' },
        { camera: 'CAM-021', time: '14:12:30', location: 'Kakata Highway' }
      ]
    }
  ];

  // Vehicle tracking
  const vehicleTracks: VehicleTrack[] = [
    {
      id: 'VEH-4521',
      licensePlate: 'LBR-A-8742',
      vehicleType: 'Toyota Corolla',
      color: 'White',
      status: 'stolen',
      firstSeen: '11:23:45',
      lastSeen: '14:48:12',
      cameras: ['CAM-010', 'CAM-013', 'CAM-021'],
      route: [
        { camera: 'CAM-010', time: '11:23:45', location: 'Red Light Junction' },
        { camera: 'CAM-013', time: '12:15:20', location: 'Tubman Boulevard' },
        { camera: 'CAM-021', time: '14:48:12', location: 'Kakata Highway' }
      ]
    },
    {
      id: 'VEH-4522',
      licensePlate: 'LBR-B-3291',
      vehicleType: 'Honda CRV',
      color: 'Black',
      status: 'suspicious',
      firstSeen: '13:45:12',
      lastSeen: '14:52:30',
      cameras: ['CAM-007', 'CAM-009'],
      route: [
        { camera: 'CAM-007', time: '13:45:12', location: 'Ganta Border' },
        { camera: 'CAM-009', time: '14:52:30', location: 'Loguatuo Border' }
      ]
    },
    {
      id: 'VEH-4523',
      licensePlate: 'LBR-C-1156',
      vehicleType: 'Toyota Hilux',
      color: 'Silver',
      status: 'wanted',
      firstSeen: '10:12:08',
      lastSeen: '14:55:21',
      cameras: ['CAM-005', 'DRONE-001'],
      route: [
        { camera: 'CAM-005', time: '10:12:08', location: 'Bo Waterside Border' },
        { camera: 'DRONE-001', time: '14:55:21', location: 'Border Region' }
      ]
    }
  ];

  // Real-time alerts
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 'ALT-001', type: 'facial_match', severity: 'critical', message: 'WATCHLIST MATCH: Ahmed Hassan detected at Red Light Junction', location: 'Red Light Junction', camera: 'CAM-010', timestamp: '14:45:33', resolved: false },
    { id: 'ALT-002', type: 'stolen_vehicle', severity: 'high', message: 'STOLEN VEHICLE: LBR-A-8742 spotted on Kakata Highway', location: 'Kakata Highway', camera: 'CAM-021', timestamp: '14:48:12', resolved: false },
    { id: 'ALT-003', type: 'suspicious_behavior', severity: 'medium', message: 'Loitering detected for 45+ minutes at Ganta Border', location: 'Ganta Border', camera: 'CAM-007', timestamp: '14:32:18', resolved: false },
    { id: 'ALT-004', type: 'facial_match', severity: 'high', message: 'WATCHLIST MATCH: Sarah Williams at RIA Airport', location: 'RIA Terminal', camera: 'CAM-001', timestamp: '13:15:22', resolved: true },
    { id: 'ALT-005', type: 'crowd_anomaly', severity: 'medium', message: 'Unusual crowd density detected at SKD Boulevard', location: 'SKD Boulevard', camera: 'CAM-014', timestamp: '14:22:05', resolved: false },
    { id: 'ALT-006', type: 'perimeter_breach', severity: 'high', message: 'Unauthorized access attempt at Capitol Building perimeter', location: 'Capitol Building', camera: 'CAM-018', timestamp: '14:15:40', resolved: true },
    { id: 'ALT-007', type: 'stolen_vehicle', severity: 'critical', message: 'WANTED VEHICLE: LBR-C-1156 tracked by tactical drone', location: 'Border Region', camera: 'DRONE-001', timestamp: '14:55:21', resolved: false }
  ]);

  // Auto-rotate through cameras
  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      setSelectedFeed(prev => {
        const currentIndex = feeds.findIndex(f => f.id === prev);
        const nextIndex = (currentIndex + 1) % feeds.length;
        return feeds[nextIndex].id;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [autoRotate]);

  // Simulate new alerts
  useEffect(() => {
    const interval = setInterval(() => {
      const newAlertTypes: Alert['type'][] = ['suspicious_behavior', 'crowd_anomaly', 'perimeter_breach'];
      const randomType = newAlertTypes[Math.floor(Math.random() * newAlertTypes.length)];
      const randomCamera = feeds[Math.floor(Math.random() * feeds.length)];

      if (Math.random() < 0.3) { // 30% chance every 15 seconds
        const newAlert: Alert = {
          id: `ALT-${Date.now()}`,
          type: randomType,
          severity: Math.random() > 0.7 ? 'high' : 'medium',
          message: `New ${randomType.replace('_', ' ')} detected`,
          location: randomCamera.location,
          camera: randomCamera.id,
          timestamp: new Date().toLocaleTimeString(),
          resolved: false
        };
        setAlerts(prev => [newAlert, ...prev].slice(0, 20));
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const selectedFeedData = feeds.find(f => f.id === selectedFeed);

  const filteredFeeds = activeTab === 'all'
    ? feeds
    : activeTab === 'aerial'
    ? feeds.filter(f => f.type === 'Satellite' || f.type === 'Drone')
    : feeds.filter(f => f.type.toLowerCase() === activeTab);

  const stats = {
    totalCameras: feeds.length,
    online: feeds.filter(f => f.status === 'online').length,
    totalAlerts: feeds.reduce((acc, f) => acc + f.alerts, 0),
    criticalAlerts: alerts.filter(a => !a.resolved && a.severity === 'critical').length,
    activeTracking: facialTracks.length + vehicleTracks.length,
    watchlistDetections: facialTracks.filter(f => f.onWatchlist).length
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-300';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'low': return 'text-blue-600 bg-blue-100 border-blue-300';
      default: return 'text-slate-600 bg-slate-100 border-slate-300';
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'facial_match': return <UserCheck className="w-4 h-4" />;
      case 'stolen_vehicle': return <Car className="w-4 h-4" />;
      case 'suspicious_behavior': return <Eye className="w-4 h-4" />;
      case 'perimeter_breach': return <Shield className="w-4 h-4" />;
      case 'crowd_anomaly': return <Users className="w-4 h-4" />;
    }
  };

  // If we have a target person, show enhanced CCTV surveillance
  if (targetPerson) {
    return (
      <CCTVSurveillance
        targetPerson={targetPerson}
        onDetection={(detection) => {
          console.log('Target detected:', detection);
          // TODO: Trigger alerts, notifications, etc.
        }}
      />
    );
  }

  return (
    <div className="space-y-6 bg-slate-950 min-h-screen p-6 -m-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Wifi className="w-8 h-8 text-green-500 animate-pulse" />
            National Surveillance Grid
          </h1>
          <p className="text-slate-400 mt-1">Real-time AI-powered monitoring • 24 active feeds • Multi-location tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-lg flex items-center gap-2 font-medium animate-pulse">
            <AlertTriangle className="w-5 h-5" />
            {stats.criticalAlerts} Critical Alerts
          </div>
          <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
            <Activity className="w-4 h-4" />
            {stats.online}/{stats.totalCameras} Online
          </div>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors ${
              autoRotate
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Radio className="w-4 h-4" />
            Auto-Rotate {autoRotate ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-6 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-sm">Total Cameras</div>
              <div className="text-3xl font-bold text-white">{stats.totalCameras}</div>
            </div>
            <Camera className="w-8 h-8 text-blue-500 opacity-50" />
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-sm">Active Alerts</div>
              <div className="text-3xl font-bold text-red-500">{stats.totalAlerts}</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500 opacity-50" />
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-sm">Live Tracking</div>
              <div className="text-3xl font-bold text-yellow-500">{stats.activeTracking}</div>
            </div>
            <Target className="w-8 h-8 text-yellow-500 opacity-50" />
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-sm">Watchlist Hits</div>
              <div className="text-3xl font-bold text-orange-500">{stats.watchlistDetections}</div>
            </div>
            <Crosshair className="w-8 h-8 text-orange-500 opacity-50" />
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-sm">Facial Tracks</div>
              <div className="text-3xl font-bold text-purple-500">{facialTracks.length}</div>
            </div>
            <Users className="w-8 h-8 text-purple-500 opacity-50" />
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-sm">Vehicle Tracks</div>
              <div className="text-3xl font-bold text-cyan-500">{vehicleTracks.length}</div>
            </div>
            <Car className="w-8 h-8 text-cyan-500 opacity-50" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Feed + Camera Grid */}
        <div className="xl:col-span-2 space-y-6">
          {/* Main Viewer */}
          <div className="bg-black rounded-xl overflow-hidden shadow-2xl border-2 border-slate-800">
            <div className="relative aspect-video bg-slate-900 group">
              {/* Simulated Camera Feed */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-black flex items-center justify-center">
                <div className="text-center text-slate-600">
                  <Camera className="w-24 h-24 mx-auto mb-4 opacity-20" />
                  <div className="font-mono text-sm">{selectedFeedData?.name}</div>
                  <div className="text-xs mt-2 opacity-50">Live Feed Simulation</div>
                </div>
              </div>

              {/* Overlay UI */}
              <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded animate-pulse flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                  LIVE
                </span>
                <span className="bg-black/80 text-white text-xs font-medium px-3 py-1.5 rounded backdrop-blur-sm border border-white/10">
                  {selectedFeedData?.name}
                </span>
                <span className={`text-xs font-bold px-3 py-1.5 rounded backdrop-blur-sm border ${
                  selectedFeedData?.recordingQuality === '4K' ? 'bg-blue-500/20 border-blue-500 text-blue-400' :
                  selectedFeedData?.recordingQuality === '1080p' ? 'bg-green-500/20 border-green-500 text-green-400' :
                  'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                }`}>
                  {selectedFeedData?.recordingQuality}
                </span>
              </div>

              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                <span className="bg-black/80 text-white text-xs font-medium px-3 py-1.5 rounded backdrop-blur-sm flex items-center gap-2 border border-white/10">
                  <MapPin className="w-3 h-3" />
                  {selectedFeedData?.location}
                </span>
                {selectedFeedData?.nightVision && (
                  <span className="bg-green-500/20 border border-green-500 text-green-400 text-xs font-medium px-3 py-1.5 rounded backdrop-blur-sm flex items-center gap-1.5">
                    <Eye className="w-3 h-3" />
                    Night Vision
                  </span>
                )}
                {selectedFeedData && selectedFeedData.alerts > 0 && (
                  <span className="bg-red-500/20 border border-red-500 text-red-400 text-xs font-bold px-3 py-1.5 rounded backdrop-blur-sm flex items-center gap-1.5 animate-pulse">
                    <AlertTriangle className="w-3 h-3" />
                    {selectedFeedData.alerts} Alerts
                  </span>
                )}
              </div>

              {/* AI Detection Overlays */}
              {showTracking && (
                <>
                  <div className="absolute top-1/4 left-1/4 w-32 h-48 border-2 border-green-500 rounded animate-pulse">
                    <div className="absolute -top-7 left-0 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                      <UserCheck className="w-3 h-3" />
                      Person: 98%
                    </div>
                  </div>

                  <div className="absolute bottom-1/3 right-1/3 w-48 h-32 border-2 border-red-500 rounded animate-pulse">
                    <div className="absolute -top-7 left-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                      <Car className="w-3 h-3" />
                      Vehicle: Stolen (92%)
                    </div>
                  </div>

                  <div className="absolute top-1/2 right-1/4 w-28 h-40 border-2 border-yellow-500 rounded animate-pulse">
                    <div className="absolute -top-7 left-0 bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      Watchlist: 94%
                    </div>
                  </div>
                </>
              )}

              {/* Timestamp & Grid Lines */}
              <div className="absolute bottom-4 left-4 font-mono text-xs text-green-500 bg-black/80 px-3 py-1.5 rounded backdrop-blur-sm border border-green-500/30">
                {new Date().toLocaleTimeString()} | CAM-ID: {selectedFeedData?.id}
              </div>

              {/* Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsLive(!isLive)}
                      className="hover:bg-white/10 p-2 rounded transition-colors"
                    >
                      {isLive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </button>
                    <button
                      onClick={() => setShowTracking(!showTracking)}
                      className={`text-xs font-medium px-3 py-1.5 rounded transition-colors ${
                        showTracking ? 'bg-green-500 text-white' : 'bg-white/10 text-white'
                      }`}
                    >
                      AI Tracking {showTracking ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="hover:bg-white/10 p-2 rounded transition-colors"><Film className="w-5 h-5" /></button>
                    <button className="hover:bg-white/10 p-2 rounded transition-colors"><Maximize2 className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>
            </div>

            {/* Camera Type Tabs */}
            <div className="bg-slate-900 border-t border-slate-800 px-4 py-3 flex items-center gap-2 overflow-x-auto">
              {(['all', 'airport', 'border', 'city', 'port', 'government', 'highway', 'aerial'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} ({
                    tab === 'all' ? feeds.length :
                    tab === 'aerial' ? feeds.filter(f => f.type === 'Satellite' || f.type === 'Drone').length :
                    feeds.filter(f => f.type.toLowerCase() === tab).length
                  })
                </button>
              ))}
            </div>
          </div>

          {/* Camera Grid */}
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredFeeds.map((feed) => (
              <div
                key={feed.id}
                onClick={() => setSelectedFeed(feed.id)}
                className={`relative bg-slate-900 border-2 rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-xl ${
                  selectedFeed === feed.id ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  {feed.type === 'Satellite' ? (
                    <Satellite className="w-8 h-8 text-slate-600" />
                  ) : feed.type === 'Drone' ? (
                    <Navigation className="w-8 h-8 text-slate-600" />
                  ) : (
                    <Camera className="w-8 h-8 text-slate-600" />
                  )}
                </div>

                <div className="absolute top-1 left-1">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    feed.status === 'online' ? 'bg-green-500 text-white' :
                    feed.status === 'warning' ? 'bg-yellow-500 text-black' :
                    'bg-red-500 text-white'
                  }`}>
                    {feed.status === 'online' ? '●' : feed.status === 'warning' ? '▲' : '✕'}
                  </span>
                </div>

                {feed.alerts > 0 && (
                  <div className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 animate-pulse">
                    {feed.alerts}
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-1.5">
                  <div className="text-[9px] font-medium text-white truncate">{feed.name}</div>
                  <div className="text-[8px] text-slate-400 truncate">{feed.id}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Tracking + Alerts */}
        <div className="space-y-6">
          {/* Live Tracking */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-yellow-500" />
              Live Cross-Camera Tracking
            </h2>

            {/* Facial Recognition */}
            <div className="space-y-3 mb-6">
              <div className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Facial Recognition ({facialTracks.length})
              </div>
              {facialTracks.map((track) => (
                <div key={track.id} className={`bg-slate-800 border rounded-lg p-3 ${
                  track.onWatchlist ? 'border-red-500' : 'border-slate-700'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-white text-sm flex items-center gap-2">
                        {track.personName}
                        {track.onWatchlist && (
                          <span className="text-[9px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded">WATCHLIST</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">Confidence: {track.confidence}%</div>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-1 rounded border ${getRiskColor(track.riskLevel)}`}>
                      {track.riskLevel.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {track.firstSeen} → {track.lastSeen}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Camera className="w-3 h-3" />
                      {track.cameras.length} cameras
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-700">
                    <div className="text-[10px] text-slate-500 mb-1">Movement Timeline:</div>
                    {track.timeline.slice(-2).map((point, idx) => (
                      <div key={idx} className="text-[10px] text-slate-400 flex items-center gap-1">
                        <span className="text-green-500">→</span> {point.time} {point.location}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Vehicle Tracking */}
            <div className="space-y-3">
              <div className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Car className="w-4 h-4" />
                Vehicle Tracking ({vehicleTracks.length})
              </div>
              {vehicleTracks.map((track) => (
                <div key={track.id} className={`bg-slate-800 border rounded-lg p-3 ${
                  track.status === 'stolen' || track.status === 'wanted' ? 'border-red-500' :
                  track.status === 'suspicious' ? 'border-yellow-500' :
                  'border-slate-700'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-white text-sm font-mono">{track.licensePlate}</div>
                      <div className="text-xs text-slate-400">{track.color} {track.vehicleType}</div>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-1 rounded uppercase ${
                      track.status === 'stolen' || track.status === 'wanted' ? 'bg-red-600 text-white' :
                      track.status === 'suspicious' ? 'bg-yellow-600 text-black' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {track.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {track.firstSeen} → {track.lastSeen}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      {track.route.length} locations tracked
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-700">
                    <div className="text-[10px] text-slate-500 mb-1">Route History:</div>
                    {track.route.slice(-2).map((point, idx) => (
                      <div key={idx} className="text-[10px] text-slate-400 flex items-center gap-1">
                        <span className="text-cyan-500">→</span> {point.time} {point.location}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alert Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-red-500" />
              Real-Time Alerts
            </h2>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`rounded-lg p-3 border ${
                    alert.resolved
                      ? 'bg-slate-800 border-slate-700 opacity-50'
                      : alert.severity === 'critical'
                      ? 'bg-red-950/50 border-red-500/50'
                      : alert.severity === 'high'
                      ? 'bg-orange-950/50 border-orange-500/50'
                      : 'bg-yellow-950/50 border-yellow-500/50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`p-1.5 rounded ${
                      alert.severity === 'critical' ? 'bg-red-500' :
                      alert.severity === 'high' ? 'bg-orange-500' :
                      'bg-yellow-500'
                    }`}>
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white mb-1">{alert.message}</div>
                      <div className="text-xs text-slate-400 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3" />
                          {alert.location} • {alert.camera}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          {alert.timestamp}
                        </div>
                      </div>
                    </div>
                    {!alert.resolved && (
                      <button
                        onClick={() => {
                          setAlerts(prev => prev.map(a =>
                            a.id === alert.id ? { ...a, resolved: true } : a
                          ));
                        }}
                        className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 rounded transition-colors"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
