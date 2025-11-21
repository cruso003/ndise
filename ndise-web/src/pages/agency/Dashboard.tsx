import { useState } from 'react';
import { Key, Activity, TrendingUp, Users, CheckCircle, AlertTriangle, Shield, Clock, Bell, Search } from 'lucide-react';
import { StatCard } from '../../components/ui';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AgencyDashboard() {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('today');

  // Partner-specific stats (simulated - in production, would come from API)
  const getPartnerStats = () => {
    const baseStats = {
      today: { requests: 1247, successful: 1198, failed: 49, avgResponse: 145, watchlistHits: 3, fraudAlerts: 2 },
      week: { requests: 8934, successful: 8712, failed: 222, avgResponse: 152, watchlistHits: 12, fraudAlerts: 8 },
      month: { requests: 35678, successful: 34890, failed: 788, avgResponse: 148, watchlistHits: 45, fraudAlerts: 23 }
    };

    // Adjust stats based on organization type
    if (user?.organizationType === 'telecom') {
      return {
        today: { requests: 2145, successful: 2089, failed: 56, avgResponse: 138, watchlistHits: 5, fraudAlerts: 4 },
        week: { requests: 15234, successful: 14912, failed: 322, avgResponse: 142, watchlistHits: 18, fraudAlerts: 12 },
        month: { requests: 62345, successful: 61234, failed: 1111, avgResponse: 140, watchlistHits: 67, fraudAlerts: 34 }
      };
    } else if (user?.organizationType === 'insurance') {
      return {
        today: { requests: 456, successful: 445, failed: 11, avgResponse: 152, watchlistHits: 1, fraudAlerts: 1 },
        week: { requests: 3234, successful: 3156, failed: 78, avgResponse: 155, watchlistHits: 4, fraudAlerts: 3 },
        month: { requests: 13567, successful: 13245, failed: 322, avgResponse: 153, watchlistHits: 15, fraudAlerts: 8 }
      };
    }

    return baseStats; // Banks use base stats
  };

  const stats = getPartnerStats();
  const currentStats = stats[timeframe];
  const successRate = ((currentStats.successful / currentStats.requests) * 100).toFixed(1);

  // Get organization display name
  const organizationName = user?.organization || 'Partner Organization';
  const departmentName = user?.department || 'Department';

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Agency Services Dashboard</h1>
            <p className="text-slate-600 mt-1">Identity verification for {organizationName} - {departmentName}</p>
          </div>
          <Link
            to="/agency/verification"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            Quick Verification
          </Link>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setTimeframe('today')}
          className={`px-4 py-2 rounded-lg font-medium ${timeframe === 'today' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
        >
          Today
        </button>
        <button
          onClick={() => setTimeframe('week')}
          className={`px-4 py-2 rounded-lg font-medium ${timeframe === 'week' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
        >
          This Week
        </button>
        <button
          onClick={() => setTimeframe('month')}
          className={`px-4 py-2 rounded-lg font-medium ${timeframe === 'month' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
        >
          This Month
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="API Requests"
          value={currentStats.requests.toLocaleString()}
          subtitle="Total verifications"
          icon={Activity}
          color="blue"
        />
        <StatCard
          title="Success Rate"
          value={`${successRate}%`}
          subtitle={`${currentStats.successful.toLocaleString()} successful`}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Avg Response Time"
          value={`${currentStats.avgResponse}ms`}
          subtitle="API latency"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Security & Fraud Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-red-600">{currentStats.watchlistHits}</div>
              <div className="text-sm text-slate-500 mt-1">Watchlist Hits</div>
            </div>
          </div>
          <p className="text-xs text-slate-600">Individuals flagged during verification</p>
          <Link to="/agency/alerts" className="text-xs text-red-600 font-medium hover:underline mt-2 inline-block">
            View all alerts →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-orange-600">{currentStats.fraudAlerts}</div>
              <div className="text-sm text-slate-500 mt-1">Fraud Alerts</div>
            </div>
          </div>
          <p className="text-xs text-slate-600">Suspicious patterns detected</p>
          <Link to="/agency/alerts" className="text-xs text-orange-600 font-medium hover:underline mt-2 inline-block">
            View fraud alerts →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{currentStats.requests}</div>
              <div className="text-sm text-slate-500 mt-1">Total Today</div>
            </div>
          </div>
          <p className="text-xs text-slate-600">Verification requests processed</p>
          <Link to="/agency/history" className="text-xs text-blue-600 font-medium hover:underline mt-2 inline-block">
            View history →
          </Link>
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Active API Keys</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium">Production Key</div>
                <div className="text-sm text-slate-600">pk_live_xxxxxxxxxxxx</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-slate-500">Usage:</span>
                <span className="font-semibold ml-1">{currentStats.requests.toLocaleString()}</span>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/agency/verification"
            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
          >
            <Search className="w-8 h-8 text-blue-600 mb-2" />
            <div className="font-medium text-slate-900">Quick Verification</div>
            <div className="text-xs text-slate-600 mt-1">Verify National ID instantly</div>
          </Link>
          <Link
            to="/agency/batch"
            className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors border border-purple-100"
          >
            <Users className="w-8 h-8 text-purple-600 mb-2" />
            <div className="font-medium text-slate-900">Batch Processing</div>
            <div className="text-xs text-slate-600 mt-1">Upload CSV for bulk verification</div>
          </Link>
          <Link
            to="/agency/history"
            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-100"
          >
            <Clock className="w-8 h-8 text-green-600 mb-2" />
            <div className="font-medium text-slate-900">Verification History</div>
            <div className="text-xs text-slate-600 mt-1">View audit trail</div>
          </Link>
          <Link
            to="/agency/alerts"
            className="p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-100"
          >
            <Bell className="w-8 h-8 text-red-600 mb-2" />
            <div className="font-medium text-slate-900">Alerts & Notifications</div>
            <div className="text-xs text-slate-600 mt-1">Fraud & watchlist alerts</div>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-4">Integration Health</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-3xl font-bold">{successRate}%</div>
            <div className="text-sm opacity-90">Success Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{currentStats.avgResponse}ms</div>
            <div className="text-sm opacity-90">Avg Response</div>
          </div>
          <div>
            <div className="text-3xl font-bold">99.8%</div>
            <div className="text-sm opacity-90">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
}
