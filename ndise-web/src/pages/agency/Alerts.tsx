import { useState } from 'react';
import { Bell, AlertTriangle, Shield, TrendingUp, CheckCircle, XCircle, Info } from 'lucide-react';

export default function Alerts() {
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'high' | 'medium' | 'info'>('all');

  // Sample alerts
  const alerts = [
    {
      id: 'ALT-2024-001',
      timestamp: '2024-11-21T14:30:00Z',
      type: 'watchlist',
      severity: 'critical',
      title: 'WATCHLIST: Person Added to National Wanted List',
      message: 'Marcus Gaye (ID: 1992030398765432) has been added to the national wanted list by Liberia National Police. Exercise extreme caution when processing this individual.',
      actionRequired: true,
      read: false,
    },
    {
      id: 'ALT-2024-002',
      timestamp: '2024-11-21T14:25:00Z',
      type: 'fraud',
      severity: 'high',
      title: 'FRAUD ALERT: Unusual Account Opening Pattern',
      message: 'National ID 1988121298765432 (Grace Nyemah) has been used to open 8 bank accounts in the past 3 months. This pattern is consistent with identity fraud or money laundering.',
      actionRequired: true,
      read: false,
    },
    {
      id: 'ALT-2024-003',
      timestamp: '2024-11-21T13:15:00Z',
      type: 'fraud',
      severity: 'medium',
      title: 'FRAUD ALERT: Multiple SIM Card Registrations',
      message: 'National ID 1988121298765432 has been used to register 5 SIM cards. Telecoms should verify the purpose before issuing additional cards.',
      actionRequired: false,
      read: true,
    },
    {
      id: 'ALT-2024-004',
      timestamp: '2024-11-21T12:00:00Z',
      type: 'system',
      severity: 'info',
      title: 'NDISE System Maintenance Scheduled',
      message: 'Scheduled maintenance window on 2024-11-22 from 02:00 AM to 04:00 AM GMT. API services will be unavailable during this period.',
      actionRequired: false,
      read: true,
    },
    {
      id: 'ALT-2024-005',
      timestamp: '2024-11-21T10:45:00Z',
      type: 'data',
      severity: 'medium',
      title: 'Data Quality Alert: Biometric Update Required',
      message: '127 citizen profiles have outdated biometric data (>5 years old). These profiles may require re-enrollment for accurate verification.',
      actionRequired: false,
      read: true,
    },
    {
      id: 'ALT-2024-006',
      timestamp: '2024-11-21T09:30:00Z',
      type: 'watchlist',
      severity: 'high',
      title: 'WATCHLIST: Border Detention Alert',
      message: 'Person detained at Roberts Airport by Border Control has been flagged in your verification system. ID: 1987050556789123',
      actionRequired: true,
      read: true,
    },
    {
      id: 'ALT-2024-007',
      timestamp: '2024-11-21T08:15:00Z',
      type: 'performance',
      severity: 'info',
      title: 'Performance Update: API Response Time Improved',
      message: 'Average API response time has improved to 145ms (down from 180ms). Your verification requests are now processing 20% faster.',
      actionRequired: false,
      read: true,
    },
  ];

  const filteredAlerts = alerts.filter((alert) => {
    if (filterSeverity === 'all') return true;
    return alert.severity === filterSeverity;
  });

  const stats = {
    total: alerts.length,
    unread: alerts.filter((a) => !a.read).length,
    critical: alerts.filter((a) => a.severity === 'critical').length,
    high: alerts.filter((a) => a.severity === 'high').length,
    actionRequired: alerts.filter((a) => a.actionRequired).length,
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'medium':
        return <Shield className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-bold rounded uppercase">Critical</span>;
      case 'high':
        return <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs font-bold rounded uppercase">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-bold rounded uppercase">Medium</span>;
      case 'info':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded uppercase">Info</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Alerts & Notifications</h1>
        <p className="text-slate-600 mt-1">System alerts, fraud warnings, and watchlist updates</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-5 h-5 text-slate-500" />
            <div className="text-slate-500 text-sm font-medium">Total Alerts</div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <div className="text-slate-500 text-sm font-medium">Unread</div>
          </div>
          <div className="text-3xl font-bold text-blue-600">{stats.unread}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <div className="text-slate-500 text-sm font-medium">Critical</div>
          </div>
          <div className="text-3xl font-bold text-red-600">{stats.critical}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <div className="text-slate-500 text-sm font-medium">High Priority</div>
          </div>
          <div className="text-3xl font-bold text-orange-600">{stats.high}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-purple-500" />
            <div className="text-slate-500 text-sm font-medium">Action Required</div>
          </div>
          <div className="text-3xl font-bold text-purple-600">{stats.actionRequired}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex items-center gap-2">
          <span className="text-slate-700 font-medium text-sm">Filter by Severity:</span>
          <button
            onClick={() => setFilterSeverity('all')}
            className={`px-4 py-1.5 rounded-lg font-medium text-sm ${
              filterSeverity === 'all' ? 'bg-slate-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterSeverity('critical')}
            className={`px-4 py-1.5 rounded-lg font-medium text-sm ${
              filterSeverity === 'critical' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Critical
          </button>
          <button
            onClick={() => setFilterSeverity('high')}
            className={`px-4 py-1.5 rounded-lg font-medium text-sm ${
              filterSeverity === 'high' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            High
          </button>
          <button
            onClick={() => setFilterSeverity('medium')}
            className={`px-4 py-1.5 rounded-lg font-medium text-sm ${
              filterSeverity === 'medium' ? 'bg-yellow-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => setFilterSeverity('info')}
            className={`px-4 py-1.5 rounded-lg font-medium text-sm ${
              filterSeverity === 'info' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Info
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-white rounded-lg shadow-sm border-l-4 overflow-hidden ${
              alert.severity === 'critical'
                ? 'border-red-600'
                : alert.severity === 'high'
                  ? 'border-orange-600'
                  : alert.severity === 'medium'
                    ? 'border-yellow-600'
                    : 'border-blue-600'
            } ${!alert.read ? 'ring-2 ring-blue-200' : ''}`}
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="mt-1">{getSeverityIcon(alert.severity)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900">{alert.title}</h3>
                        {!alert.read && (
                          <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded">NEW</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-mono">{alert.id}</span>
                        <span>•</span>
                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    {getSeverityBadge(alert.severity)}
                  </div>
                  <p className="text-slate-700 text-sm mb-3">{alert.message}</p>
                  <div className="flex items-center gap-4">
                    {alert.actionRequired && (
                      <button className="px-4 py-1.5 bg-blue-600 text-white rounded font-medium text-sm hover:bg-blue-700">
                        Take Action
                      </button>
                    )}
                    <button className="px-4 py-1.5 bg-slate-100 text-slate-700 rounded font-medium text-sm hover:bg-slate-200">
                      View Details
                    </button>
                    {!alert.read && (
                      <button className="px-4 py-1.5 text-slate-600 text-sm hover:text-slate-900 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No alerts found</p>
          <p className="text-slate-400 text-sm">Try adjusting your filter criteria</p>
        </div>
      )}
    </div>
  );
}
