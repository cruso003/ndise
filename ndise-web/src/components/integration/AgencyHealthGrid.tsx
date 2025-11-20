import { Activity } from 'lucide-react';
import { getAllAgencies } from '../../lib/agencyIntegration';
import type { AgencyMetrics } from '../../lib/agencyIntegration';

export default function AgencyHealthGrid() {
  const agencies = getAllAgencies();
  
  const getStatusColor = (status: AgencyMetrics['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getStatusText = (status: AgencyMetrics['status']) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'degraded':
        return 'Degraded';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Activity className="w5 h-5 text-slate-600" />
          <h2 className="text-lg font-bold text-slate-900">Agency Integration Health</h2>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">
              {agencies.filter(a => a.status === 'online').length}
            </div>
            <div className="text-sm text-green-700 font-medium">Online</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-600">
              {agencies.filter(a => a.status === 'degraded').length}
            </div>
            <div className="text-sm text-yellow-700 font-medium">Degraded</div>
          </div>
        </div>
        
        <div className="text-center p-4 bg-red-50 rounded-lg mb-6">
          <div className="text-3xl font-bold text-red-600">
            {agencies.filter(a => a.status === 'offline').length}
          </div>
          <div className="text-sm text-red-700 font-medium">Offline</div>
        </div>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {agencies.map((agency) => (
            <div
              key={agency.agencyId}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(agency.status)}`}></div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 text-sm truncate">
                    {agency.agencyName}
                  </div>
                  <div className="text-xs text-slate-500">
                    {agency.category}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-xs">
                <div className="text-right">
                  <div className="text-slate-500">Uptime</div>
                  <div className={`font-semibold ${
                    agency.uptime >= 99 ? 'text-green-600' :
                    agency.uptime >= 95 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {agency.uptime}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-slate-500">Response</div>
                  <div className={`font-semibold ${
                    agency.avgResponseTime < 200 ? 'text-green-600' :
                    agency.avgResponseTime < 500 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {agency.avgResponseTime}ms
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  agency.status === 'online' ? 'bg-green-100 text-green-800' :
                  agency.status === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {getStatusText(agency.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
          View Detailed Metrics →
        </button>
      </div>
    </div>
  );
}
