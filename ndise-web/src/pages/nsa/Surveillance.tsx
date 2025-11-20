import { useState } from 'react';
import { Camera, AlertTriangle, MapPin, Activity, Maximize2, Play, Pause, Film } from 'lucide-react';

interface CameraFeed {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'warning';
  type: 'Traffic' | 'Border' | 'City' | 'Airport';
  alerts: number;
  thumbnail: string;
}

export default function Surveillance() {
  const [selectedFeed, setSelectedFeed] = useState<CameraFeed | null>(null);
  const [isLive, setIsLive] = useState(true);

  const feeds: CameraFeed[] = [
    {
      id: 'CAM-001',
      name: 'RIA Terminal Main',
      location: 'Roberts Intl Airport',
      status: 'online',
      type: 'Airport',
      alerts: 0,
      thumbnail: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&q=80&w=400&h=225'
    },
    {
      id: 'CAM-002',
      name: 'Bo Waterside Crossing',
      location: 'Grand Cape Mount',
      status: 'online',
      type: 'Border',
      alerts: 2,
      thumbnail: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=400&h=225'
    },
    {
      id: 'CAM-003',
      name: 'Red Light Junction',
      location: 'Paynesville',
      status: 'warning',
      type: 'City',
      alerts: 5,
      thumbnail: 'https://images.unsplash.com/photo-1445964047600-cdbdb873673d?auto=format&fit=crop&q=80&w=400&h=225'
    },
    {
      id: 'CAM-004',
      name: 'Freeport Entrance',
      location: 'Bushrod Island',
      status: 'online',
      type: 'Border',
      alerts: 0,
      thumbnail: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=400&h=225'
    },
    {
      id: 'CAM-005',
      name: 'Broad Street Center',
      location: 'Monrovia',
      status: 'online',
      type: 'City',
      alerts: 1,
      thumbnail: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=400&h=225'
    },
    {
      id: 'CAM-006',
      name: 'Ganta Border Post',
      location: 'Nimba County',
      status: 'offline',
      type: 'Border',
      alerts: 0,
      thumbnail: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=400&h=225'
    }
  ];

  const activeAlerts = feeds.reduce((acc, feed) => acc + feed.alerts, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Surveillance Grid</h1>
          <p className="text-slate-600 mt-1">Real-time CCTV monitoring and AI threat detection</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg flex items-center gap-2 font-medium animate-pulse">
            <AlertTriangle className="w-5 h-5" />
            {activeAlerts} Active Threats Detected
          </div>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Activity className="w-4 h-4" />
            System Status: Optimal
          </button>
        </div>
      </div>

      {/* Main View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Feed */}
        <div className="lg:col-span-2 bg-black rounded-xl overflow-hidden shadow-lg relative aspect-video group">
          <img 
            src={selectedFeed?.thumbnail || feeds[0].thumbnail} 
            alt="Main Feed" 
            className="w-full h-full object-cover opacity-90"
          />
          
          {/* Overlay UI */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">LIVE</span>
            <span className="bg-black/50 text-white text-xs font-medium px-2 py-1 rounded backdrop-blur-sm">
              {selectedFeed?.name || feeds[0].name}
            </span>
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="bg-black/50 text-white text-xs font-medium px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {selectedFeed?.location || feeds[0].location}
            </span>
          </div>

          {/* AI Detection Box Overlay (Simulated) */}
          <div className="absolute top-1/4 left-1/4 w-32 h-48 border-2 border-green-500 rounded opacity-70">
            <div className="absolute -top-6 left-0 bg-green-500 text-white text-[10px] px-1 rounded">
              Person: 98%
            </div>
          </div>
          
          <div className="absolute bottom-1/3 right-1/3 w-48 h-32 border-2 border-red-500 rounded opacity-70">
             <div className="absolute -top-6 left-0 bg-red-500 text-white text-[10px] px-1 rounded">
              Vehicle: Stolen (92%)
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsLive(!isLive)}>
                  {isLive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                <div className="text-sm font-mono">00:14:23:09</div>
              </div>
              <div className="flex items-center gap-4">
                <button><Film className="w-5 h-5" /></button>
                <button><Maximize2 className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Feed List */}
        <div className="space-y-4 h-[600px] overflow-y-auto pr-2">
          {feeds.map((feed) => (
            <div 
              key={feed.id}
              onClick={() => setSelectedFeed(feed)}
              className={`bg-white rounded-lg p-3 border-2 cursor-pointer transition-all hover:shadow-md ${
                selectedFeed?.id === feed.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'
              }`}
            >
              <div className="relative aspect-video rounded-md overflow-hidden mb-3">
                <img src={feed.thumbnail} alt={feed.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    feed.status === 'online' ? 'bg-green-500 text-white' :
                    feed.status === 'warning' ? 'bg-yellow-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {feed.status.toUpperCase()}
                  </span>
                </div>
                {feed.alerts > 0 && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 animate-pulse">
                    <AlertTriangle className="w-3 h-3" />
                    {feed.alerts}
                  </div>
                )}
              </div>
              
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{feed.name}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {feed.location}
                  </div>
                </div>
                <div className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  {feed.type}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
