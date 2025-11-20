import { useState } from 'react';
import { Target, MapPin, Navigation, Radio, Search, AlertTriangle, User } from 'lucide-react';

interface Target {
  id: string;
  name: string;
  status: 'active' | 'dormant' | 'neutralized';
  lastSeen: string;
  location: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  coordinates: { lat: number; lng: number };
  trackingMethod: 'GPS' | 'Cellular' | 'Visual' | 'Financial';
}

export default function Tracking() {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  const targets: Target[] = [
    {
      id: 'TGT-882',
      name: 'Subject Alpha',
      status: 'active',
      lastSeen: '2 mins ago',
      location: 'Monrovia, Sinkor 12th St',
      riskLevel: 'critical',
      coordinates: { lat: 6.2907, lng: -10.7605 },
      trackingMethod: 'Cellular'
    },
    {
      id: 'TGT-104',
      name: 'Subject Bravo',
      status: 'active',
      lastSeen: '15 mins ago',
      location: 'Paynesville, Red Light',
      riskLevel: 'high',
      coordinates: { lat: 6.2800, lng: -10.7200 },
      trackingMethod: 'Visual'
    },
    {
      id: 'TGT-339',
      name: 'Subject Charlie',
      status: 'dormant',
      lastSeen: '3 days ago',
      location: 'Buchanan, Grand Bassa',
      riskLevel: 'medium',
      coordinates: { lat: 5.8800, lng: -10.0500 },
      trackingMethod: 'Financial'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Target Tracking</h1>
          <p className="text-slate-600 mt-1">Geospatial monitoring of high-value targets</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Target className="w-4 h-4" />
            Add New Target
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Target List */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search targets..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {targets.map((target) => (
              <div 
                key={target.id}
                onClick={() => setSelectedTarget(target.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  selectedTarget === target.id ? 'bg-blue-50 border-blue-500' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      target.riskLevel === 'critical' ? 'bg-red-100 text-red-600' :
                      target.riskLevel === 'high' ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{target.name}</div>
                      <div className="text-xs text-slate-500">{target.id}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    target.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {target.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                  <div className="flex items-center gap-1 text-slate-600">
                    <MapPin className="w-3 h-3" />
                    {target.location}
                  </div>
                  <div className="flex items-center gap-1 text-slate-600">
                    <Radio className="w-3 h-3" />
                    {target.trackingMethod}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map View (Placeholder for Demo) */}
        <div className="lg:col-span-2 bg-slate-100 rounded-lg border border-slate-200 relative overflow-hidden group">
          {/* Simulated Map Background */}
          <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-10.7605,6.2907,12,0/800x600?access_token=pk.eyJ1IjoiZGVtb191c2VyIiwiYSI6ImNrOHB4Z2Z4ZDAwMm0zZG14Z2Z4ZDAwMm0ifQ.xyz')] bg-cover bg-center opacity-50" />
          
          {/* Grid Overlay */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            opacity: 0.1
          }} />

          {/* Active Target Marker */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-ping absolute inset-0" />
              <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white relative z-10" />
              
              {/* Info Window */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-slate-900 text-white p-3 rounded-lg text-xs shadow-xl">
                <div className="font-bold mb-1">Subject Alpha</div>
                <div className="flex items-center gap-1 text-slate-300 mb-1">
                  <MapPin className="w-3 h-3" /> Sinkor, 12th St
                </div>
                <div className="flex items-center gap-1 text-green-400">
                  <Activity className="w-3 h-3" /> Moving (12 km/h)
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 border-4 border-transparent border-t-slate-900" />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <button className="bg-white p-2 rounded shadow hover:bg-slate-50"><Navigation className="w-5 h-5 text-slate-700" /></button>
            <button className="bg-white p-2 rounded shadow hover:bg-slate-50"><Target className="w-5 h-5 text-slate-700" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
