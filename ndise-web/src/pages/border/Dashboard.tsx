import { useState, useEffect } from 'react';
import { 
  Plane, Users, AlertTriangle, Globe, TrendingUp, 
  Clock, Shield, Activity, Search, CheckCircle, XCircle
} from 'lucide-react';
import { StatCard } from '../../components/ui';
import { getBorderCheckpoints } from '../../lib/geospatial';
import { analyzePatterns } from '../../lib/aiService';
import { getAllAgencies } from '../../lib/agencyIntegration';

interface RecentCrossing {
  id: string;
  name: string;
  nationality: string;
  passportNumber: string;
  type: 'entry' | 'exit';
  checkpoint: string;
  time: string;
  riskScore: number;
  status: 'approved' | 'flagged' | 'detained';
}

export default function BorderDashboard() {
  const [checkpoints, setCheckpoints] = useState<any[]>([]);
  const [recentCrossings, setRecentCrossings] = useState<RecentCrossing[]>([]);
  const [aiAlerts, setAiAlerts] = useState<any[]>([]);
  const [agencyHealth, setAgencyHealth] = useState<any[]>([]);

  useEffect(() => {
    // Load data
    setCheckpoints(getBorderCheckpoints());
    setAiAlerts(analyzePatterns('day'));
    setAgencyHealth(getAllAgencies().filter(a => 
      ['immigration', 'police', 'nir'].includes(a.agencyId)
    ));
    
    // Mock recent crossings
    setRecentCrossings([
      {
        id: '1',
        name: 'Adeola Okoye',
        nationality: 'Nigerian',
        passportNumber: 'A12345678',
        type: 'entry',
        checkpoint: 'Roberts International Airport',
        time: '2 minutes ago',
        riskScore: 24,
        status: 'approved'
      },
      {
        id: '2',
        name: 'Ahmed Hassan',
        nationality: 'Sudanese',
        passportNumber: 'SD987654',
        type: 'entry',
        checkpoint: 'Roberts International Airport',
        time: '5 minutes ago',
        riskScore: 82,
        status: 'detained'
      },
      {
        id: '3',
        name: 'Chen Wei',
        nationality: 'Chinese',
        passportNumber: 'CH456789',
        type: 'exit',
        checkpoint: 'Roberts International Airport',
        time: '8 minutes ago',
        riskScore: 15,
        status: 'approved'
      },
      {
        id: '4',
        name: 'Marie Dupont',
        nationality: 'French',
        passportNumber: 'FR789012',
        type: 'entry',
        checkpoint: 'Roberts International Airport',
        time: '12 minutes ago',
        riskScore: 18,
        status: 'approved'
      },
      {
        id: '5',
        name: 'Ibrahim Sesay',
        nationality: 'Sierra Leonean',
        passportNumber: 'SL345678',
        type: 'entry',
        checkpoint: 'Bo Waterside',
        time: '15 minutes ago',
        riskScore: 45,
        status: 'flagged'
      }
    ]);
  }, []);

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 70) return 'HIGH RISK';
    if (score >= 40) return 'MEDIUM';
    return 'LOW RISK';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'flagged':
        return 'bg-yellow-100 text-yellow-800';
      case 'detained':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate stats
  const totalCrossingsToday = checkpoints.reduce((sum, cp) => sum + cp.crossingsToday, 0);
  const totalAlertsToday = checkpoints.reduce((sum, cp) => sum + cp.alertsToday, 0);
  const approvedCount = recentCrossings.filter(c => c.status === 'approved').length;
  const detainedCount = recentCrossings.filter(c => c.status === 'detained').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Border Control Dashboard</h1>
        <p className="text-slate-600 mt-1">Real-time border monitoring with AI intelligence</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Crossings Today"
          value={totalCrossingsToday.toString()}
          subtitle={`${checkpoints.filter(cp => cp.status === 'operational').length} checkpoints active`}
          icon={Plane}
          variant="info"
        />
        <StatCard
          title="Active Foreigners"
          value="45,234"
          subtitle="Currently in Liberia"
          icon={Users}
          variant="success"
        />
        <StatCard
          title="Security Alerts"
          value={totalAlertsToday.toString()}
          subtitle="Last 24 hours"
          icon={AlertTriangle}
          variant="error"
        />
        <StatCard
          title="Overstays"
          value="87"
          subtitle="Visa expired"
          icon={Clock}
          variant="warning"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Live Crossings (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Border Intelligence */}
          {aiAlerts.length > 0 && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-bold text-red-900">🤖 AI Intelligence Alert</h3>
                  <p className="text-sm text-red-800 mt-1">
                    {aiAlerts[0].title} - {aiAlerts[0].confidence}% confidence
                  </p>
                  <p className="text-xs text-red-700 mt-2">
                    {aiAlerts[0].description}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                      View Details
                    </button>
                    <button className="text-xs bg-white text-red-600 border border-red-300 px-3 py-1 rounded hover:bg-red-50">
                      Coordinate with NSA
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Border Crossings */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-slate-900">Live Border Crossings</h2>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-600">Real-time</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                {recentCrossings.map((crossing) => (
                  <div
                    key={crossing.id}
                    className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-900">{crossing.name}</h4>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(crossing.status)}`}>
                            {crossing.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm text-slate-600 space-y-1">
                          <div className="flex items-center gap-4">
                            <span>🌍 {crossing.nationality}</span>
                            <span>📖 {crossing.passportNumber}</span>
                            <span className="flex items-center gap-1">
                              {crossing.type === 'entry' ? '→' : '←'} {crossing.type.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-xs">
                            📍 {crossing.checkpoint} • 🕐 {crossing.time}
                          </div>
                        </div>
                      </div>
                      
                      <div className={`px-3 py-2 rounded-lg text-center min-w-[100px] ${getRiskColor(crossing.riskScore)}`}>
                        <div className="text-xs font-semibold mb-1">🤖 AI Risk</div>
                        <div className="text-2xl font-bold">{crossing.riskScore}</div>
                        <div className="text-xs font-medium">{getRiskLabel(crossing.riskScore)}</div>
                      </div>
                    </div>
                    
                    {crossing.status === 'detained' && (
                      <div className="mt-3 bg-red-50 border border-red-200 rounded p-3">
                        <div className="text-xs font-semibold text-red-900 mb-1">🚨 Security Alert</div>
                        <div className="text-xs text-red-800">
                          Matches wanted person database. NSA and Police notified.
                        </div>
                      </div>
                    )}
                    
                    {crossing.status === 'flagged' && (
                      <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded p-3">
                        <div className="text-xs font-semibold text-yellow-900 mb-1">⚠️ Review Required</div>
                        <div className="text-xs text-yellow-800">
                          Previous overstay detected. Enhanced screening recommended.
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-3 flex gap-2">
                      <button className="flex-1 text-xs bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">
                        View Full Profile
                      </button>
                      <button className="flex-1 text-xs bg-slate-100 text-slate-700 px-3 py-2 rounded hover:bg-slate-200">
                        Verify Documents
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All Crossings Today →
              </button>
            </div>
          </div>

          {/* Border Checkpoints Status */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-slate-600" />
                <h2 className="text-lg font-bold text-slate-900">Checkpoint Status</h2>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {checkpoints.map((checkpoint) => (
                  <div
                    key={checkpoint.id}
                    className="border border-slate-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-900">{checkpoint.name}</h4>
                        <div className="text-xs text-slate-500 mt-1">
                          {checkpoint.type === 'airport' && '✈️ Airport'}
                          {checkpoint.type === 'seaport' && '⚓ Seaport'}
                          {checkpoint.type === 'land' && '🚗 Land Border'}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-semibold ${
                        checkpoint.status === 'operational' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {checkpoint.status.toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                      <div>
                        <div className="text-slate-500 text-xs">Crossings Today</div>
                        <div className="font-bold text-blue-600">{checkpoint.crossingsToday}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs">Alerts Today</div>
                        <div className={`font-bold ${checkpoint.alertsToday > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {checkpoint.alertsToday}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Agency Integration (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Agency Data Verification */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-slate-600" />
                <h3 className="text-lg font-bold text-slate-900">Agency Verification</h3>
              </div>
              <p className="text-xs text-slate-600 mt-1">Real-time API status</p>
            </div>
            
            <div className="p-6 space-y-3">
              {agencyHealth.map((agency) => (
                <div key={agency.agencyId} className="border border-slate-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        agency.status === 'online' ? 'bg-green-500' :
                        agency.status === 'degraded' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}></div>
                      <span className="font-medium text-sm text-slate-900">
                        {agency.agencyName.split('(')[0].trim()}
                      </span>
                    </div>
                    {agency.status === 'online' && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {agency.status === 'offline' && <XCircle className="w-4 h-4 text-red-500" />}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-slate-500">Response Time</div>
                      <div className={`font-semibold ${
                        agency.avgResponseTime < 200 ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {agency.avgResponseTime}ms
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">Success Rate</div>
                      <div className="font-semibold text-slate-900">{agency.successRate}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
            </div>
            
            <div className="p-6 space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
                <Search className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-blue-900 text-sm">Search Traveler</div>
                  <div className="text-xs text-blue-700">By passport or name</div>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
                <AlertTriangle className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-medium text-purple-900 text-sm">Watchlist</div>
                  <div className="text-xs text-purple-700">Manage alerts</div>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition-colors">
                <Clock className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="font-medium text-orange-900 text-sm">Overstay Tracking</div>
                  <div className="text-xs text-orange-700">87 active cases</div>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-green-900 text-sm">Reports</div>
                  <div className="text-xs text-green-700">Border statistics</div>
                </div>
              </button>
            </div>
          </div>

          {/* Processing Stats */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-4">Today's Summary</h3>
            
            <div className="space-y-3">
              <div>
                <div className="text-slate-300 text-xs mb-1">Approved</div>
                <div className="text-2xl font-bold text-green-400">{approvedCount * 35}</div>
              </div>
              
              <div>
                <div className="text-slate-300 text-xs mb-1">Under Review</div>
                <div className="text-2xl font-bold text-yellow-400">12</div>
              </div>
              
              <div>
                <div className="text-slate-300 text-xs mb-1">Detained</div>
                <div className="text-2xl font-bold text-red-400">{detainedCount}</div>
              </div>
              
              <div className="pt-3 border-t border-slate-700">
                <div className="text-slate-300 text-xs mb-1">Average Processing Time</div>
                <div className="text-xl font-bold">45 seconds</div>
                <div className="text-xs text-green-400">↓ 12% faster with AI</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
