import { AlertTriangle, Info } from 'lucide-react';

export default function Alerts() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">System Alerts</h1>
        <p className="text-slate-600 mt-1">Critical notifications and system warnings</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200 font-bold text-slate-900">
          Active Alerts
        </div>
        <div className="divide-y divide-slate-200">
          <div className="p-6 flex items-start gap-4 bg-red-50">
            <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
            <div>
              <div className="font-bold text-red-900">Critical Security Anomaly</div>
              <div className="text-red-800 mt-1">Multiple unauthorized access attempts detected from IP range 192.168.x.x</div>
              <div className="text-xs text-red-700 mt-2">2 minutes ago • Severity: Critical</div>
            </div>
          </div>
          <div className="p-6 flex items-start gap-4">
            <Info className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <div className="font-bold text-slate-900">System Maintenance Scheduled</div>
              <div className="text-slate-600 mt-1">Routine database maintenance scheduled for Sunday at 02:00 AM.</div>
              <div className="text-xs text-slate-500 mt-2">2 hours ago • Severity: Info</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
