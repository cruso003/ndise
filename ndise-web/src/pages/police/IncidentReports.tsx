import { useState } from 'react';
import { Plus, MapPin, Clock, AlertTriangle } from 'lucide-react';

interface Incident {
  id: string;
  type: string;
  location: string;
  time: string;
  status: 'new' | 'in_progress' | 'resolved';
  priority: 'critical' | 'high' | 'medium' | 'low';
  reportedBy: string;
  description: string;
}

export default function IncidentReports() {
  const [incidents] = useState<Incident[]>([
    {
      id: 'INC-2024-5501',
      type: 'Public Disturbance',
      location: 'Monrovia, Broad Street',
      time: '10:30 AM',
      status: 'new',
      priority: 'medium',
      reportedBy: 'Civilian Call',
      description: 'Large crowd gathering, blocking traffic.'
    },
    {
      id: 'INC-2024-5492',
      type: 'Vehicle Collision',
      location: 'Paynesville, ELWA Junction',
      time: '09:15 AM',
      status: 'in_progress',
      priority: 'high',
      reportedBy: 'Officer Patrol',
      description: 'Two vehicle collision, minor injuries reported.'
    },
    {
      id: 'INC-2024-5480',
      type: 'Theft',
      location: 'Sinkor, 3rd Street',
      time: '08:45 AM',
      status: 'resolved',
      priority: 'low',
      reportedBy: 'Business Owner',
      description: 'Shoplifting incident, suspect apprehended.'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Incident Reports</h1>
          <p className="text-slate-600 mt-1">Log and track daily police incidents</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Log New Incident
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident Feed */}
        <div className="lg:col-span-2 space-y-4">
          {incidents.map((incident) => (
            <div key={incident.id} className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    incident.priority === 'critical' ? 'bg-red-100 text-red-600' :
                    incident.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{incident.type}</div>
                    <div className="text-xs text-slate-500">{incident.id} • {incident.reportedBy}</div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  incident.status === 'new' ? 'bg-blue-100 text-blue-800' :
                  incident.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {incident.status.toUpperCase().replace('_', ' ')}
                </span>
              </div>
              
              <p className="text-slate-700 text-sm mb-3 pl-12">
                {incident.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-500 pl-12">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {incident.location}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {incident.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map Placeholder */}
        <div className="bg-slate-100 rounded-lg border border-slate-200 h-[400px] flex items-center justify-center text-slate-400 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-10.7605,6.2907,12,0/400x400?access_token=pk.eyJ1IjoiZGVtb191c2VyIiwiYSI6ImNrOHB4Z2Z4ZDAwMm0zZG14Z2Z4ZDAwMm0ifQ.xyz')] bg-cover bg-center opacity-50" />
          <span className="relative z-10 font-medium bg-white/80 px-3 py-1 rounded backdrop-blur-sm">
            Live Incident Map
          </span>
        </div>
      </div>
    </div>
  );
}
