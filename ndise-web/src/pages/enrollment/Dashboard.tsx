import { useState, useEffect } from 'react';
import { Users, TrendingUp, Clock, CheckCircle, AlertTriangle, Database, Brain, Activity } from 'lucide-react';
import { StatCard, Card, CardHeader, CardTitle, CardContent } from '../../components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getAllAgencies, getDataSyncStats } from '../../lib/agencyIntegration';
import { detectAnomalies } from '../../lib/aiService';

export default function EnrollmentDashboard() {
  const [agencyData, setAgencyData] = useState<any[]>([]);
  const [syncStats, setSyncStats] = useState<any>(null);
  const [aiInsights, setAiInsights] = useState<any[]>([]);

  useEffect(() => {
    // Load agency integration data
    const agencies = getAllAgencies();
    setAgencyData(agencies.filter(a => 
      ['nir', 'nec', 'tax', 'immigration'].includes(a.agencyId)
    ));
    setSyncStats(getDataSyncStats());
    setAiInsights(detectAnomalies().filter(a => a.anomalyType === 'identity_theft').slice(0, 2));
  }, []);

  // Mock data
  const stats = {
    todayEnrollments: 247,
    pendingApprovals: 18,
    avgProcessingTime: '12 min',
    completionRate: '94.2%',
  };

  const weeklyData = [
    { day: 'Mon', enrollments: 234 },
    { day: 'Tue', enrollments: 267 },
    { day: 'Wed', enrollments: 198 },
    { day: 'Thu', enrollments: 289 },
    { day: 'Fri', enrollments: 247 },
    { day: 'Sat', enrollments: 156 },
    { day: 'Sun', enrollments: 89 },
  ];

  const statusData = [
    { name: 'Completed', value: 1234, color: '#10b981' },
    { name: 'Pending', value: 18, color: '#f59e0b' },
    { name: 'Rejected', value: 45, color: '#ef4444' },
  ];

  // Data quality metrics
  const dataQualityMetrics = [
    { field: 'Personal Info', completeness: 98, accuracy: 96 },
    { field: 'Biometrics', completeness: 95, accuracy: 99 },
    { field: 'Documents', completeness: 92, accuracy: 94 },
    { field: 'Address', completeness: 88, accuracy: 87 },
    { field: 'Contact', completeness: 91, accuracy: 93 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Enrollment Dashboard</h1>
        <p className="text-slate-600 mt-1">Registration activities with AI quality monitoring</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Enrollments"
          value={stats.todayEnrollments.toString()}
          subtitle="New registrations"
          icon={Users}
          variant="info"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals.toString()}
          subtitle="Awaiting review"
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Avg Processing Time"
          value={stats.avgProcessingTime}
          subtitle="Per enrollment"
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          title="Completion Rate"
          value={stats.completionRate}
          subtitle="Quality score"
          icon={CheckCircle}
          variant="default"
        />
      </div>

      {/* AI Quality Alerts */}
      {aiInsights.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-orange-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-orange-900">🤖 AI Quality Alert</h3>
              <p className="text-sm text-orange-800 mt-1">
                {aiInsights[0].description} - {aiInsights[0].confidence}% confidence
              </p>
              <div className="flex gap-2 mt-3">
                <button className="text-xs bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700">
                  Review Case
                </button>
                <button className="text-xs bg-white text-orange-600 border border-orange-300 px-3 py-1 rounded hover:bg-orange-50">
                  View AI Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Charts (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Weekly Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Enrollment Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#64748b" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="enrollments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Data Quality Metrics */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-slate-600" />
                <h2 className="text-lg font-bold text-slate-900">Data Quality Metrics</h2>
              </div>
              <p className="text-xs text-slate-600 mt-1">AI-powered data validation</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {dataQualityMetrics.map((metric, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-900">{metric.field}</span>
                      <div className="flex gap-4 text-xs">
                        <span className="text-slate-600">
                          Completeness: <span className="font-semibold text-blue-600">{metric.completeness}%</span>
                        </span>
                        <span className="text-slate-600">
                          Accuracy: <span className="font-semibold text-green-600">{metric.accuracy}%</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-blue-500 h-full rounded-full"
                          style={{ width: `${metric.completeness}%` }}
                        ></div>
                      </div>
                      <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-green-500 h-full rounded-full"
                          style={{ width: `${metric.accuracy}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-900">🤖 AI Overall Assessment</span>
                </div>
                <p className="text-xs text-blue-800">
                  Data quality is <strong>Excellent (94.2%)</strong>. Address data shows room for improvement. 
                  AI recommends enhanced validation for location fields.
                </p>
              </div>
            </div>
          </div>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Enrollment Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent! * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {statusData.map((item, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-2xl font-bold" style={{ color: item.color }}>
                      {item.value}
                    </div>
                    <div className="text-xs text-slate-600">{item.name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Agency Data Sources (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Agency Data Sources */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-slate-600" />
                <h3 className="text-lg font-bold text-slate-900">Agency Data Sources</h3>
              </div>
              <p className="text-xs text-slate-600 mt-1">Integration status</p>
            </div>
            
            <div className="p-6 space-y-3">
              {agencyData.map((agency) => (
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
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Records Today</span>
                      <span className="font-semibold text-slate-900">
                        {syncStats?.byAgency.find((a: any) => a.agencyName.includes(agency.agencyName.split('(')[0]))?.recordsToday || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Last Sync</span>
                      <span className="font-semibold text-slate-900">2 min ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Data Age</span>
                      <span className={`font-semibold ${
                        agency.status === 'online' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        Fresh
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium mt-2">
                View All Agencies →
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
            </div>
            
            <div className="p-6 space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-blue-900 text-sm">New Enrollment</div>
                  <div className="text-xs text-blue-700">Register citizen</div>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
                <AlertTriangle className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-medium text-purple-900 text-sm">Pending Queue</div>
                  <div className="text-xs text-purple-700">{stats.pendingApprovals} waiting</div>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
                <Database className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-green-900 text-sm">Search Citizens</div>
                  <div className="text-xs text-green-700">Find records</div>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition-colors">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="font-medium text-orange-900 text-sm">Reports</div>
                  <div className="text-xs text-orange-700">View analytics</div>
                </div>
              </button>
            </div>
          </div>

          {/* Today's Summary */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-4">Today's Performance</h3>
            
            <div className="space-y-3">
              <div>
                <div className="text-slate-300 text-xs mb-1">Enrollments</div>
                <div className="text-2xl font-bold text-blue-400">{stats.todayEnrollments}</div>
                <div className="text-xs text-green-400">↑ 12% vs yesterday</div>
              </div>
              
              <div>
                <div className="text-slate-300 text-xs mb-1">AI Duplicates Prevented</div>
                <div className="text-2xl font-bold text-purple-400">7</div>
                <div className="text-xs text-slate-400">98.5% accuracy</div>
              </div>
              
              <div>
                <div className="text-slate-300 text-xs mb-1">Processing Speed</div>
                <div className="text-2xl font-bold text-green-400">{stats.avgProcessingTime}</div>
                <div className="text-xs text-green-400">↓ 15% faster</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
