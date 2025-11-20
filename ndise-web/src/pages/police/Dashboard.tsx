import { useState, useEffect } from 'react';
import {
  Shield, Users, AlertTriangle, Search, Network,
  TrendingUp, FileText, Activity, Brain, Eye, X
} from 'lucide-react';
import { StatCard } from '../../components/ui';
import { mapRelationships, analyzePatterns } from '../../lib/aiService';
import { getAllAgencies } from '../../lib/agencyIntegration';
import NetworkGraph from '../../components/NetworkGraph';
import { investigationNetwork } from '../../utils/networkData';

interface ActiveCase {
  id: string;
  caseNumber: string;
  suspect: string;
  type: string;
  status: 'investigating' | 'closed' | 'warrant';
  priority: 'low' | 'medium' | 'high' | 'critical';
  lastUpdate: string;
  aiInsights: number;
}

export default function PoliceDashboard() {
  const [activeCases, setActiveCases] = useState<ActiveCase[]>([]);
  const [aiPatterns, setAiPatterns] = useState<any[]>([]);
  const [agencyData, setAgencyData] = useState<any[]>([]);
  const [showNetworkGraph, setShowNetworkGraph] = useState(false);

  useEffect(() => {
    // Load AI patterns
    setAiPatterns(analyzePatterns('day').filter(p => 
      p.title.includes('fraud') || p.title.includes('criminal')
    ).slice(0, 2));

    // Load agency data
    setAgencyData(getAllAgencies().filter(a => 
      ['lips', 'immigration', 'nir'].includes(a.agencyId)
    ));

    // Mock active cases
    setActiveCases([
      {
        id: '1',
        caseNumber: 'CASE-2025-11-234',
        suspect: 'Michael Korto Smith',
        type: 'Fraud Investigation',
        status: 'investigating',
        priority: 'high',
        lastUpdate: '2 hours ago',
        aiInsights: 8
      },
      {
        id: '2',
        caseNumber: 'CASE-2025-11-189',
        suspect: 'John Doe',
        type: 'Armed Robbery',
        status: 'warrant',
        priority: 'critical',
        lastUpdate: '4 hours ago',
        aiInsights: 12
      },
      {
        id: '3',
        caseNumber: 'CASE-2025-10-456',
        suspect: 'Sarah Johnson',
        type: 'Identity Theft',
        status: 'investigating',
        priority: 'medium',
        lastUpdate: '1 day ago',
        aiInsights: 5
      }
    ]);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'investigating':
        return <Eye className="w-4 h-4" />;
      case 'warrant':
        return <AlertTriangle className="w-4 h-4" />;
      case 'closed':
        return <FileText className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Police Dashboard</h1>
        <p className="text-slate-600 mt-1">Law enforcement operations with AI intelligence</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Cases"
          value="47"
          subtitle="Under investigation"
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Wanted Persons"
          value="23"
          subtitle="Active warrants"
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Today's Searches"
          value="156"
          subtitle="Database queries"
          icon={Search}
          color="green"
        />
        <StatCard
          title="AI Leads Generated"
          value="12"
          subtitle="Past 7 days"
          icon={Brain}
          color="purple"
        />
      </div>

      {/* AI Criminal Pattern Alerts */}
      {aiPatterns.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-purple-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-red-900">🤖 AI Criminal Pattern Detected</h3>
              <p className="text-sm text-red-800 mt-1">
                {aiPatterns[0].title} - {aiPatterns[0].confidence}% confidence
              </p>
              <p className="text-xs text-red-700 mt-1">
                {aiPatterns[0].description}
              </p>
              <div className="flex gap-2 mt-3">
                <button className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                  Open Investigation
                </button>
                <button className="text-xs bg-white text-red-600 border border-red-300 px-3 py-1 rounded hover:bg-red-50">
                  View Network Graph
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Active Cases (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Cases */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-slate-900">Active Investigations</h2>
                </div>
                <span className="text-sm text-slate-600">{activeCases.length} cases</span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                {activeCases.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-900">{caseItem.caseNumber}</h4>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(caseItem.priority)}`}>
                            {caseItem.priority.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm text-slate-600 space-y-1">
                          <div className="flex items-center gap-4">
                            <span>👤 Suspect: <strong>{caseItem.suspect}</strong></span>
                          </div>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1">
                              {getStatusIcon(caseItem.status)}
                              {caseItem.type}
                            </span>
                            <span>🕐 {caseItem.lastUpdate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3 p-3 bg-blue-50 rounded">
                      <Brain className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-blue-900">
                        <strong>{caseItem.aiInsights} AI insights</strong> available for this case
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 text-xs bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">
                        View Case Details
                      </button>
                      <button
                        onClick={() => setShowNetworkGraph(true)}
                        className="flex-1 text-xs bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 flex items-center justify-center gap-1"
                      >
                        <Network className="w-3 h-3" />
                        Network Analysis
                      </button>
                      <button className="flex-1 text-xs bg-slate-100 text-slate-700 px-3 py-2 rounded hover:bg-slate-200">
                        Update Status
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All Cases →
              </button>
            </div>
          </div>

          {/* AI Network Analysis Preview */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-700 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Network className="w-6 h-6" />
              <h2 className="text-xl font-bold">AI Network Analysis</h2>
            </div>
            
            <p className="text-sm text-blue-100 mb-4">
              Click "Network Analysis" on any case to visualize:
            </p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-semibold mb-1">🕸️ Relationships</div>
                <div className="text-xs text-blue-100">Family, business, contacts</div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-semibold mb-1">🎯 Key Players</div>
                <div className="text-xs text-blue-100">Influencers, associates</div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-semibold mb-1">🔗 Connections</div>
                <div className="text-xs text-blue-100">Phone, travel, financial</div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-semibold mb-1">⚠️ Risk Scores</div>
                <div className="text-xs text-blue-100">AI-calculated threats</div>
              </div>
            </div>
            
            <button
              onClick={() => setShowNetworkGraph(true)}
              className="w-full mt-4 bg-white text-purple-600 font-semibold py-2 rounded hover:bg-blue-50 transition-colors"
            >
              Try Demo Network Analysis
            </button>
          </div>
        </div>
        
        {/* Right Column - Tools & Integration (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Agency Data Access */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-slate-600" />
                <h3 className="text-lg font-bold text-slate-900">Agency Integration</h3>
              </div>
              <p className="text-xs text-slate-600 mt-1">Real-time access</p>
            </div>
            
            <div className="p-6 space-y-3">
              {agencyData.map((agency) => (
                <div key={agency.agencyId} className="border border-slate-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        agency.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span className="font-medium text-sm text-slate-900">
                        {agency.agencyName.split('(')[0].trim()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-slate-600">
                    <div className="flex justify-between mb-1">
                      <span>Response Time</span>
                      <span className="font-semibold">{agency.avgResponseTime}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Queries Today</span>
                      <span className="font-semibold">156</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Search */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Quick Search</h3>
            </div>
            
            <div className="p-6">
              <input
                type="text"
                placeholder="Name, National ID, Passport..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium text-sm">
                Search Database
              </button>
              
              <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
                <button className="w-full text-left text-sm text-slate-600 hover:text-blue-600 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Advanced Search
                </button>
                <button className="w-full text-left text-sm text-slate-600 hover:text-blue-600 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Wanted Persons
                </button>
                <button className="w-full text-left text-sm text-slate-600 hover:text-blue-600 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Case Management
                </button>
              </div>
            </div>
          </div>

          {/* Investigation Tools */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">AI Tools</h3>
            </div>
            
            <div className="p-6 space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
                <Network className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-medium text-purple-900 text-sm">Network Mapper</div>
                  <div className="text-xs text-purple-700">Visualize connections</div>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
                <Brain className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-blue-900 text-sm">AI Pattern Finder</div>
                  <div className="text-xs text-blue-700">Detect criminal patterns</div>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-green-900 text-sm">Timeline Generator</div>
                  <div className="text-xs text-green-700">Activity history</div>
                </div>
              </button>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-4">This Week</h3>
            
            <div className="space-y-3">
              <div>
                <div className="text-slate-300 text-xs mb-1">Cases Opened</div>
                <div className="text-2xl font-bold text-blue-400">8</div>
              </div>
              
              <div>
                <div className="text-slate-300 text-xs mb-1">Cases Closed</div>
                <div className="text-2xl font-bold text-green-400">12</div>
              </div>
              
              <div>
                <div className="text-slate-300 text-xs mb-1">AI Leads Generated</div>
                <div className="text-2xl font-bold text-purple-400">12</div>
                <div className="text-xs text-purple-300">94% accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Network Graph Modal */}
      {showNetworkGraph && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Network Analysis</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Interactive relationship mapping for Case #CASE-2025-11-234
                </p>
              </div>
              <button
                onClick={() => setShowNetworkGraph(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
              <NetworkGraph
                data={investigationNetwork}
                centralNodeId="central-1"
                height={600}
                onNodeClick={(node) => {
                  console.log('Node clicked:', node);
                }}
              />
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-blue-900 mb-1">AI Insights</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Marcus Gaye has 10 direct connections with 3 high-risk individuals</li>
                      <li>• Strong business ties to Emmanuel Dahn (Lagos) - 23 transactions in 6 months</li>
                      <li>• Global Trade Ltd shows suspicious activity patterns</li>
                      <li>• Frequent international travel coincides with financial transactions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowNetworkGraph(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Generate Full Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
