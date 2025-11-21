import { useEffect, useState } from 'react';
import { Shield, Users, Globe, TrendingUp, Activity, Brain } from 'lucide-react';
import { StatCard } from '../../components/ui';
import { stats } from '../../data/stats';
import AgencyHealthGrid from '../../components/integration/AgencyHealthGrid';
import DataSyncChart from '../../components/integration/DataSyncChart';
import AIInsightCard from '../../components/ai/AIInsightCard';
import { analyzePatterns, detectAnomalies } from '../../lib/aiService';
import { getAgencyHealthSummary } from '../../lib/agencyIntegration';

export default function Dashboard() {
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [agencyHealth, setAgencyHealth] = useState<any>(null);

  useEffect(() => {
    // Load AI insights
    const patterns = analyzePatterns('day');
    const anomalies = detectAnomalies();
    setAiInsights([...patterns, ...anomalies].sort((a, b) => b.confidence - a.confidence));
    
    // Load agency health
    setAgencyHealth(getAgencyHealthSummary());
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Executive Dashboard</h1>
        <p className="text-slate-600 mt-1">Strategic oversight and system intelligence</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Enrollments"
          value={stats.totalEnrollments.toLocaleString()}
          trend={{ value: '12.5%', direction: 'up' }}
          icon={Users}
          variant="info"
        />
        <StatCard
          title="Active Foreigners"
          value={stats.activeForeigners.toLocaleString()}
          trend={{ value: '8.3%', direction: 'up' }}
          icon={Globe}
          variant="success"
        />
        <StatCard
          title="Overstays Detected"
          value={stats.overstays}
          trend={{ value: '5.2%', direction: 'down', label: 'decrease' }}
          icon={Shield}
          variant="error"
        />
        <StatCard
          title="System Health"
          value={`${agencyHealth?.healthScore || 0}%`}
          subtitle={`${agencyHealth?.online || 0}/${agencyHealth?.total || 0} agencies online`}
          icon={Activity}
          variant="default"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - AI Insights (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Insights */}
          <AIInsightCard insights={aiInsights} maxDisplay={3} />
          
          {/* Data Sync Chart */}
          <DataSyncChart />
          
          {/* System Performance Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-slate-600" />
              <h2 className="text-lg font-bold text-slate-900">System Performance</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {agencyHealth?.avgUptime || 0}%
                </div>
                <div className="text-sm text-blue-700">Avg Uptime</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {agencyHealth?.avgResponseTime || 0}ms
                </div>
                <div className="text-sm text-green-700">Avg Response</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {aiInsights.filter(i => i.confidence > 90).length}
                </div>
                <div className="text-sm text-purple-700">High-Confidence AI Alerts</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Agency Health (1/3 width) */}
        <div className="lg:col-span-1">
          <AgencyHealthGrid />
        </div>
      </div>

      {/* Strategic Indicators */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-6 h-6" />
          <h2 className="text-xl font-bold">Strategic Intelligence Summary</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-slate-300 text-sm mb-1">Enrollment Progress</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{((stats.totalEnrollments / 4500000) * 100).toFixed(1)}%</span>
              <span className="text-slate-400 text-sm">of 4.5M target</span>
            </div>
            <div className="mt-2 bg-slate-700 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-500 h-full rounded-full"
                style={{ width: `${(stats.totalEnrollments / 4500000) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="text-slate-300 text-sm mb-1">Security Alerts (24h)</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{aiInsights.filter(i => i.severity === 'critical' || i.severity === 'high').length}</span>
              <span className="text-slate-400 text-sm">requiring action</span>
            </div>
            <div className="mt-2 text-xs text-slate-400">
              {aiInsights.filter(i => i.severity === 'critical').length} critical, {aiInsights.filter(i => i.severity === 'high').length} high priority
            </div>
          </div>
          
          <div>
            <div className="text-slate-300 text-sm mb-1">Data Quality Score</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">94.2%</span>
              <span className="text-green-400 text-sm">↑ 2.1%</span>
            </div>
            <div className="mt-2 text-xs text-slate-400">
              Across all integrated agencies
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
            <div className="font-semibold text-blue-900">View Analytics</div>
            <div className="text-xs text-blue-700 mt-1">Detailed reports</div>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
            <div className="font-semibold text-purple-900">NSA Operations</div>
            <div className="text-xs text-purple-700 mt-1">Security intelligence</div>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
            <div className="font-semibold text-green-900">System Alerts</div>
            <div className="text-xs text-green-700 mt-1">View all alerts</div>
          </button>
          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition-colors">
            <div className="font-semibold text-orange-900">Agency Reports</div>
            <div className="text-xs text-orange-700 mt-1">Integration metrics</div>
          </button>
        </div>
      </div>
    </div>
  );
}
