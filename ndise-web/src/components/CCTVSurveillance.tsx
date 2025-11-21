import { useState, useEffect } from 'react';
import {
  Camera,
  Video,
  Play,
  Pause,
  Square,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  MapPin,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  Crosshair,
  Target,
  Eye,
  Radio,
  Loader,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Scan,
  Shield,
  Bell,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { createCCTVDetectionAlert } from '../services/alertService';

interface CCTVCamera {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  resolution: string;
  fps: number;
  hasAI: boolean;
  hasPTZ: boolean; // Pan-Tilt-Zoom capability
  coverage: string;
  coordinates: { lat: number; lng: number };
}

interface Detection {
  id: string;
  cameraId: string;
  cameraName: string;
  timestamp: Date;
  personId: string;
  personName: string;
  confidence: number; // 0-100%
  snapshot?: string;
  location: string;
}

interface ActiveTracking {
  targetId: string;
  targetName: string;
  camerasMonitoring: string[];
  lastSeen?: Detection;
  alertsEnabled: boolean;
  startedAt: Date;
}

interface CCTVSurveillanceProps {
  targetPerson?: {
    nationalId: string;
    name: string;
    photo?: string;
  };
  onDetection?: (detection: Detection) => void;
}

export default function CCTVSurveillance({ targetPerson, onDetection }: CCTVSurveillanceProps) {
  const [cameras, setCameras] = useState<CCTVCamera[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<CCTVCamera | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [activeTracking, setActiveTracking] = useState<ActiveTracking | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'single' | 'map'>('grid');
  const [ptzPosition, setPtzPosition] = useState({ pan: 0, tilt: 0, zoom: 1 });
  const [isRecording, setIsRecording] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Initialize cameras
    const initialCameras: CCTVCamera[] = [
      {
        id: 'cam-001',
        name: 'Roberts Intl Airport - Arrival',
        location: 'Roberts International Airport, Terminal 1',
        status: 'online',
        resolution: '4K',
        fps: 30,
        hasAI: true,
        hasPTZ: true,
        coverage: 'Immigration Counters 1-8',
        coordinates: { lat: 6.2338, lng: -10.3622 },
      },
      {
        id: 'cam-002',
        name: 'Paynesville Market - North',
        location: 'Paynesville Market, North Entrance',
        status: 'online',
        resolution: '1080p',
        fps: 25,
        hasAI: true,
        hasPTZ: false,
        coverage: 'Main Market Area',
        coordinates: { lat: 6.2895, lng: -10.7464 },
      },
      {
        id: 'cam-003',
        name: 'Bo Waterside Border - Main Gate',
        location: 'Bo Waterside Border Checkpoint',
        status: 'online',
        resolution: '4K',
        fps: 30,
        hasAI: true,
        hasPTZ: true,
        coverage: 'Vehicle Inspection Zone',
        coordinates: { lat: 7.2667, lng: -11.1333 },
      },
      {
        id: 'cam-004',
        name: 'Downtown Monrovia - Broad St',
        location: 'Broad Street, Central Monrovia',
        status: 'online',
        resolution: '1080p',
        fps: 30,
        hasAI: true,
        hasPTZ: true,
        coverage: 'Commercial District',
        coordinates: { lat: 6.3156, lng: -10.8074 },
      },
      {
        id: 'cam-005',
        name: 'Ministry Complex - Security',
        location: 'Government Ministry Complex',
        status: 'online',
        resolution: '4K',
        fps: 60,
        hasAI: true,
        hasPTZ: true,
        coverage: 'Main Entrance & Perimeter',
        coordinates: { lat: 6.3023, lng: -10.7970 },
      },
      {
        id: 'cam-006',
        name: 'Freeport Terminal - Gate 2',
        location: 'Freeport of Monrovia',
        status: 'online',
        resolution: '1080p',
        fps: 25,
        hasAI: true,
        hasPTZ: false,
        coverage: 'Container Terminal Access',
        coordinates: { lat: 6.3398, lng: -10.6955 },
      },
      {
        id: 'cam-007',
        name: 'Ganta Border Post - Checkpoint',
        location: 'Ganta Border Crossing (Guinea)',
        status: 'maintenance',
        resolution: '720p',
        fps: 20,
        hasAI: false,
        hasPTZ: false,
        coverage: 'Pedestrian Crossing',
        coordinates: { lat: 7.2333, lng: -8.9833 },
      },
      {
        id: 'cam-008',
        name: 'SKD Boulevard - Traffic Cam',
        location: 'SKD Boulevard, Sinkor',
        status: 'online',
        resolution: '1080p',
        fps: 30,
        hasAI: true,
        hasPTZ: true,
        coverage: 'Major Intersection',
        coordinates: { lat: 6.3181, lng: -10.7828 },
      },
    ];

    setCameras(initialCameras);
    setSelectedCamera(initialCameras[0]);
  }, []);

  const startTracking = () => {
    if (!targetPerson) return;

    setIsScanning(true);
    setActiveTracking({
      targetId: targetPerson.nationalId,
      targetName: targetPerson.name,
      camerasMonitoring: cameras.filter(c => c.hasAI && c.status === 'online').map(c => c.id),
      alertsEnabled: true,
      startedAt: new Date(),
    });

    // Simulate AI scanning across cameras
    setTimeout(() => {
      setIsScanning(false);
      // Simulate detection after 3 seconds
      simulateDetection();
    }, 3000);
  };

  const stopTracking = () => {
    setActiveTracking(null);
    setIsScanning(false);
  };

  const simulateDetection = () => {
    if (!targetPerson || !activeTracking) return;

    const aiCameras = cameras.filter(c => c.hasAI && c.status === 'online');
    const randomCamera = aiCameras[Math.floor(Math.random() * aiCameras.length)];

    const newDetection: Detection = {
      id: `det-${Date.now()}`,
      cameraId: randomCamera.id,
      cameraName: randomCamera.name,
      timestamp: new Date(),
      personId: targetPerson.nationalId,
      personName: targetPerson.name,
      confidence: 85 + Math.random() * 15, // 85-100%
      location: randomCamera.location,
    };

    setDetections(prev => [newDetection, ...prev]);
    setActiveTracking(prev => prev ? { ...prev, lastSeen: newDetection } : null);

    // Create NDISE alert for this detection
    createCCTVDetectionAlert({
      nationalId: targetPerson.nationalId,
      personName: targetPerson.name,
      cameraId: randomCamera.id,
      location: randomCamera.location,
      confidence: Math.round(newDetection.confidence),
    });

    if (onDetection) {
      onDetection(newDetection);
    }

    // Continue scanning
    if (activeTracking) {
      const nextScanDelay = 5000 + Math.random() * 10000; // 5-15 seconds
      setTimeout(simulateDetection, nextScanDelay);
    }
  };

  const handlePTZ = (action: 'pan-left' | 'pan-right' | 'tilt-up' | 'tilt-down' | 'zoom-in' | 'zoom-out') => {
    setPtzPosition(prev => {
      const step = 10;
      switch (action) {
        case 'pan-left':
          return { ...prev, pan: Math.max(prev.pan - step, -180) };
        case 'pan-right':
          return { ...prev, pan: Math.min(prev.pan + step, 180) };
        case 'tilt-up':
          return { ...prev, tilt: Math.min(prev.tilt + step, 90) };
        case 'tilt-down':
          return { ...prev, tilt: Math.max(prev.tilt - step, -30) };
        case 'zoom-in':
          return { ...prev, zoom: Math.min(prev.zoom * 1.5, 10) };
        case 'zoom-out':
          return { ...prev, zoom: Math.max(prev.zoom / 1.5, 1) };
        default:
          return prev;
      }
    });
  };

  const toggleRecording = (cameraId: string) => {
    setIsRecording(prev => ({
      ...prev,
      [cameraId]: !prev[cameraId],
    }));
  };

  const onlineCameras = cameras.filter(c => c.status === 'online');
  const aiCameras = onlineCameras.filter(c => c.hasAI);

  return (
    <div className="space-y-6">
      {/* Control Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-600 rounded-lg">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">CCTV Surveillance Network</h2>
              <p className="text-sm text-slate-300">AI-Powered Facial Recognition & Target Tracking</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-400">Network Status</div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm font-bold text-green-400">LIVE</span>
              </div>
            </div>
            <div className="h-12 w-px bg-slate-600"></div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Active Cameras</div>
              <div className="text-2xl font-bold">{onlineCameras.length}/{cameras.length}</div>
            </div>
            <div className="h-12 w-px bg-slate-600"></div>
            <div className="text-right">
              <div className="text-xs text-slate-400">AI Cameras</div>
              <div className="text-2xl font-bold text-blue-400">{aiCameras.length}</div>
            </div>
          </div>
        </div>

        {/* Target Tracking Panel */}
        {targetPerson && (
          <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                  <User className="w-8 h-8 text-slate-400" />
                </div>
                <div>
                  <div className="text-xs text-blue-300 mb-1">TARGET</div>
                  <div className="text-lg font-bold">{targetPerson.name}</div>
                  <div className="text-sm text-slate-300">ID: {targetPerson.nationalId}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {activeTracking ? (
                  <>
                    <div className="text-right">
                      <div className="text-xs text-green-300">Active Tracking</div>
                      <div className="text-sm font-mono">
                        {aiCameras.length} cameras monitoring
                      </div>
                      {activeTracking.lastSeen && (
                        <div className="text-xs text-green-400 mt-1">
                          Last seen: {formatDistanceToNow(activeTracking.lastSeen.timestamp, { addSuffix: true })}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={stopTracking}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-colors flex items-center gap-2"
                    >
                      <Square className="w-5 h-5" />
                      Stop Tracking
                    </button>
                  </>
                ) : (
                  <button
                    onClick={startTracking}
                    disabled={isScanning}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isScanning ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Initializing...
                      </>
                    ) : (
                      <>
                        <Scan className="w-5 h-5" />
                        Start AI Tracking
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Mode Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Grid View
          </button>
          <button
            onClick={() => setViewMode('single')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'single'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Single Camera
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'map'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Map View
          </button>
        </div>
        {detections.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-100 border border-red-300 rounded-lg">
            <Bell className="w-5 h-5 text-red-600 animate-pulse" />
            <span className="text-sm font-bold text-red-800">
              {detections.length} Detection{detections.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Camera Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-4 gap-4">
          {cameras.slice(0, 8).map((camera) => (
            <div
              key={camera.id}
              className={`bg-slate-900 rounded-lg overflow-hidden cursor-pointer transition-all ${
                selectedCamera?.id === camera.id ? 'ring-4 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedCamera(camera)}
            >
              {/* Video Feed Placeholder */}
              <div className="aspect-video bg-slate-800 relative flex items-center justify-center">
                {camera.status === 'online' ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900"></div>
                    <Camera className="w-12 h-12 text-slate-600 relative z-10" />
                    {isRecording[camera.id] && (
                      <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-red-600 rounded">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-white">REC</span>
                      </div>
                    )}
                    {camera.hasAI && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-blue-600 rounded text-xs font-bold text-white">
                        AI
                      </div>
                    )}
                    {activeTracking && camera.hasAI && (
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-green-500/20 border border-green-500 rounded p-1 text-center">
                          <Crosshair className="w-4 h-4 text-green-400 mx-auto animate-pulse" />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center">
                    <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-xs text-yellow-500 uppercase font-bold">
                      {camera.status}
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Info */}
              <div className="p-3 bg-slate-800 text-white">
                <div className="font-bold text-sm mb-1 truncate">{camera.name}</div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {camera.location.split(',')[0]}
                  </span>
                  <span className={`px-2 py-0.5 rounded ${
                    camera.status === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {camera.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className="px-2 py-0.5 bg-slate-700 rounded">{camera.resolution}</span>
                  <span className="px-2 py-0.5 bg-slate-700 rounded">{camera.fps}fps</span>
                  {camera.hasPTZ && (
                    <span className="px-2 py-0.5 bg-blue-600 rounded font-bold">PTZ</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Single Camera View */}
      {viewMode === 'single' && selectedCamera && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="bg-slate-900 rounded-xl overflow-hidden">
              <div className="aspect-video bg-slate-800 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900"></div>
                <Camera className="w-24 h-24 text-slate-600 relative z-10" />
                {isRecording[selectedCamera.id] && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-red-600 rounded-lg">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold text-white">RECORDING</span>
                  </div>
                )}
                {selectedCamera.hasAI && (
                  <div className="absolute top-4 right-4 px-3 py-2 bg-blue-600 rounded-lg text-sm font-bold text-white">
                    AI ENABLED
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur rounded-lg p-3 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold">{selectedCamera.name}</div>
                      <div className="text-xs text-slate-300">{selectedCamera.location}</div>
                    </div>
                    <div className="text-right text-xs">
                      <div className="text-slate-300">Resolution</div>
                      <div className="font-bold">{selectedCamera.resolution} @ {selectedCamera.fps}fps</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Camera Controls */}
              <div className="p-6 bg-slate-800 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">Camera Controls</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleRecording(selectedCamera.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isRecording[selectedCamera.id]
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                    >
                      {isRecording[selectedCamera.id] ? (
                        <><Square className="w-4 h-4 inline mr-2" />Stop Recording</>
                      ) : (
                        <><Video className="w-4 h-4 inline mr-2" />Start Recording</>
                      )}
                    </button>
                  </div>
                </div>

                {selectedCamera.hasPTZ ? (
                  <div className="grid grid-cols-2 gap-4">
                    {/* PTZ Controls */}
                    <div>
                      <div className="text-sm font-medium mb-2">Pan & Tilt</div>
                      <div className="bg-slate-900 rounded-lg p-4">
                        <div className="grid grid-cols-3 gap-2">
                          <div></div>
                          <button
                            onClick={() => handlePTZ('tilt-up')}
                            className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                          >
                            <ChevronUp className="w-5 h-5 mx-auto" />
                          </button>
                          <div></div>
                          <button
                            onClick={() => handlePTZ('pan-left')}
                            className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                          >
                            <ChevronLeft className="w-5 h-5 mx-auto" />
                          </button>
                          <button className="p-3 bg-slate-700 rounded-lg">
                            <RotateCw className="w-5 h-5 mx-auto text-slate-500" />
                          </button>
                          <button
                            onClick={() => handlePTZ('pan-right')}
                            className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                          >
                            <ChevronRight className="w-5 h-5 mx-auto" />
                          </button>
                          <div></div>
                          <button
                            onClick={() => handlePTZ('tilt-down')}
                            className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                          >
                            <ChevronDown className="w-5 h-5 mx-auto" />
                          </button>
                          <div></div>
                        </div>
                        <div className="mt-3 text-xs text-center text-slate-400">
                          Pan: {ptzPosition.pan}° | Tilt: {ptzPosition.tilt}°
                        </div>
                      </div>
                    </div>

                    {/* Zoom Controls */}
                    <div>
                      <div className="text-sm font-medium mb-2">Zoom</div>
                      <div className="bg-slate-900 rounded-lg p-4">
                        <div className="space-y-2">
                          <button
                            onClick={() => handlePTZ('zoom-in')}
                            className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <ZoomIn className="w-5 h-5" />
                            Zoom In
                          </button>
                          <button
                            onClick={() => handlePTZ('zoom-out')}
                            className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <ZoomOut className="w-5 h-5" />
                            Zoom Out
                          </button>
                        </div>
                        <div className="mt-3 text-xs text-center text-slate-400">
                          Zoom: {ptzPosition.zoom.toFixed(1)}x
                        </div>
                        <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${((ptzPosition.zoom - 1) / 9) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900 rounded-lg p-6 text-center">
                    <Target className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                    <div className="text-sm text-slate-400">
                      PTZ controls not available for this camera
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Detection History */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-slate-900">Detection History</h3>
            </div>
            <div className="divide-y divide-slate-200 max-h-[600px] overflow-y-auto">
              {detections.length > 0 ? (
                detections.map((detection) => (
                  <div key={detection.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Eye className="w-6 h-6 text-slate-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-900 mb-1">{detection.personName}</div>
                        <div className="text-xs text-slate-600 mb-2">
                          {detection.cameraName}
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-500">
                            {formatDistanceToNow(detection.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                            <div
                              className="bg-green-500 h-1.5 rounded-full"
                              style={{ width: `${detection.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-green-600">
                            {Math.round(detection.confidence)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <div className="text-sm text-slate-500">No detections yet</div>
                  <div className="text-xs text-slate-400 mt-1">
                    Start AI tracking to detect targets
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <div className="text-lg font-bold text-slate-700">Camera Location Map</div>
              <div className="text-sm text-slate-500 mt-2">
                Interactive map showing all {cameras.length} camera locations
              </div>
              <div className="text-xs text-slate-400 mt-4">
                Integration with mapping service (Google Maps / Mapbox) required
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
