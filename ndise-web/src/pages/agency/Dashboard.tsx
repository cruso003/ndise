import { useState } from 'react';
import { Key, Activity, TrendingUp, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import {  StatCard } from '../../components/ui';

export default function AgencyDashboard() {
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('today');

  const stats = {
    today: { requests: 1247, successful: 1198, failed: 49, avgResponse: 145 },
    week: { requests: 8934, successful: 8712, failed: 222, avgResponse: 152 },
    month: { requests: 35678, successful: 34890, failed: 788, avgResponse: 148 }
  };

  const currentStats = stats[timeframe];
  const successRate = ((currentStats.successful / currentStats.requests) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">API Dashboard</h1>
        <p className="text-slate-600 mt-1">Monitor your API usage and performance</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          title="Failed Requests"
          value={currentStats.failed.toString()}
          subtitle="Need attention"
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Avg Response Time"
          value={`${currentStats.avgResponse}ms`}
          subtitle="API latency"
          icon={TrendingUp}
          color="purple"
        />
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
