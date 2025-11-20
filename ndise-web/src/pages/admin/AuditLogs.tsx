import { Shield, Search, Filter, Download, AlertTriangle } from 'lucide-react';

export default function AdminAuditLogs() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">System Audit Logs</h1>
        <p className="text-slate-600 mt-1">Complete immutable record of all system activities</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by user, IP, or action..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Timestamp</th>
              <th className="px-6 py-4 font-semibold text-slate-700">User / IP</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Action</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Details</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm text-slate-600">2024-11-20 14:30:{10 + i}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-900">sys.admin</div>
                  <div className="text-xs text-slate-500">10.0.0.5</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">SYSTEM_CONFIG_UPDATE</td>
                <td className="px-6 py-4 text-sm text-slate-600">Updated password policy settings</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    INFO
                  </span>
                </td>
              </tr>
            ))}
             <tr className="hover:bg-slate-50 bg-red-50/50">
                <td className="px-6 py-4 text-sm text-slate-600">2024-11-20 14:28:12</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-900">unknown</div>
                  <div className="text-xs text-slate-500">192.168.1.105</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">LOGIN_FAILED</td>
                <td className="px-6 py-4 text-sm text-slate-600">Invalid credentials (3 attempts)</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 flex gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    WARNING
                  </span>
                </td>
              </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
