import { useState, useEffect } from 'react';
import { 
  Shield, AlertTriangle, Activity, Map, Network, 
  TrendingUp, Search, Brain, Clock
} from 'lucide-react';
import {
  analyzePatterns,
  detectAnomalies
} from '../../lib/aiService';
import type {
  PatternDetection,
  AnomalyAlert
} from '../../lib/aiService';
import {
  getAllAgencies,
  getAgencyHealthSummary,
  getRecentIntegrationEvents
} from '../../lib/agencyIntegration';
import type {
  IntegrationEvent
} from '../../lib/agencyIntegration';

export default function OperationsCenter() {
  const [patterns, setPatterns] = useState<PatternDetection[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyAlert[]>([]);
  const [agencyHealth, setAgencyHealth] = useState<any>(null);
  const [recentEvents, setRecentEvents] = useState<IntegrationEvent[]>([]);
  const [selectedView, setSelectedView] = useState<'threats' | 'patterns' | 'map' | 'timeline'>('threats');

  useEffect(() => {
    // Load all intelligence data
    setPatterns(analyzePatterns('day'));
    setAnomalies(detectAnomalies());
    setAgencyHealth(getAgencyHealthSummary());
    setRecentEvents(getRecentIntegrationEvents(20));
  }, []);

  const criticalAlerts = [...patterns.filter(p => p.severity === 'critical'), ...anomalies.filter(a => a.severity === 'critical')];
  const highAlerts = [...patterns.filter(p => p.severity === 'high'), ...anomalies.filter(a => a.severity === 'high')];
  const mediumAlerts = [...patterns.filter(p => p.severity === 'medium'), ...anomalies.filter(a => a.severity === 'medium')];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 to-blue-900 text-white px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">NSA Operations Center</h1>
              <p className="text-sm text-red-100">National Security Agency - Intelligence Hub</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-red-200">System Status</div>
              <div className="font-semibold">
                {agencyHealth && (
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    {agencyHealth.healthScore}% Operational
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-red-200">Active Analyst</div>
              <div className="font-semibold">Agent Smith</div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Summary Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-slate-900">
              CRITICAL ({criticalAlerts.length})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm font-semibold text-slate-700">
              HIGH ({highAlerts.length})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-slate-600">
              MEDIUM ({mediumAlerts.length})
            </span>
          </div>
          <div className="ml-auto text-sm text-slate-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-12 gap-6">
          
          {/* Left Column - Live Threats */}
          <div className="col-span-8 space-y-6">
            
            {/* Live Threat Monitor */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200">
              <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-red-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h2 className="text-lg font-bold text-slate-900">Live Threat Monitor</h2>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        selectedView === 'threats' 
                          ? 'bg-red-600 text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                      onClick={() => setSelectedView('threats')}
                    >
                      Active Threats
                    </button>
                    <button
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        selectedView === 'patterns' 
                          ? 'bg-red-600 text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                      onClick={() => setSelectedView('patterns')}
                    >
                      AI Patterns
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {selectedView === 'threats' && (
                  <>
                    {/* Critical Threats */}
                    {criticalAlerts.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                          <h3 className="font-bold text-red-900">CRITICAL ALERTS ({criticalAlerts.length})</h3>
                        </div>
                        {criticalAlerts.map((alert, idx) => (
                          <div key={idx} className="bg-red-50 border-l-4 border-red-600 rounded-r-lg p-4 mb-3">
                            {'anomalyType' in alert ? (
                              // Anomaly Alert
                              <div>
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className="font-semibold text-red-900">{alert.personName}</h4>
                                    <p className="text-sm text-red-700">{alert.description}</p>
                                  </div>
                                  <div className="flex items-center gap-2 bg-red-100 px-3 py-1 rounded-full">
                                    <Brain className="w-4 h-4 text-red-700" />
                                    <span className="text-sm font-semibold text-red-900">{alert.confidence}% AI Confidence</span>
                                  </div>
                                </div>
                                <div className="text-sm text-red-800 mt-2 space-y-1">
                                  {alert.findings.map((finding, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                      <span className="text-red-600">•</span>
                                      <span>{finding}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-3 flex gap-2">
                                  <button className="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700">
                                    Execute AI Recommendation
                                  </button>
                                  <button className="bg-white border border-red-300 text-red-700 px-4 py-2 rounded text-sm font-medium hover:bg-red-50">
                                    Investigate
                                  </button>
                                </div>
                              </div>
                            ) : (
                              // Pattern Detection
                              <div>
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className="font-semibold text-red-900">{alert.title}</h4>
                                    <p className="text-sm text-red-700">{alert.description}</p>
                                  </div>
                                  <div className="flex items-center gap-2 bg-red-100 px-3 py-1 rounded-full">
                                    <Brain className="w-4 h-4 text-red-700" />
                                    <span className="text-sm font-semibold text-red-900">{alert.confidence}% Confidence</span>
                                  </div>
                                </div>
                                <div className="text-xs text-red-600 mb-2">
                                  📍 {alert.location} • {alert.affectedPersons} persons affected
                                </div>
                                <div className="mt-3 bg-white rounded p-3 border border-red-200">
                                  <div className="text-sm font-semibold text-red-900 mb-1">🤖 AI Recommendation:</div>
                                  <div className="text-sm text-red-800">{alert.aiRecommendation}</div>
                                </div>
                                <div className="mt-3 flex gap-2">
                                  <button className="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700">
                                    Dispatch Team
                                  </button>
                                  <button className="bg-white border border-red-300 text-red-700 px-4 py-2 rounded text-sm font-medium hover:bg-red-50">
                                    View Network Graph
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* High Priority Threats */}
                    {highAlerts.length > 0 && (
                      <div className="mt-6">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <h3 className="font-bold text-orange-900">HIGH PRIORITY ({highAlerts.length})</h3>
                        </div>
                        {highAlerts.slice(0, 2).map((alert, idx) => (
                          <div key={idx} className="bg-orange-50 border-l-4 border-orange-500 rounded-r-lg p-4 mb-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-orange-900">
                                  {'title' in alert ? alert.title : alert.description}
                                </h4>
                                <p className="text-sm text-orange-700 mt-1">
                                  {'title' in alert ? alert.description : `Person: ${alert.personName}`}
                                </p>
                              </div>
                              <button className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700">
                                Review
                              </button>
                            </div>
                          </div>
                        ))}
                        {highAlerts.length > 2 && (
                          <button className="text-sm text-orange-600 hover:text-orange-700 font-medium mt-2">
                            View all {highAlerts.length} high priority alerts →
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}

                {selectedView === 'patterns' && (
                  <div className="space-y-4">
                    {patterns.map((pattern, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Brain className="w-5 h-5 text-blue-600" />
                              <h4 className="font-bold text-slate-900">{pattern.title}</h4>
                            </div>
                            <p className="text-sm text-slate-700">{pattern.description}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            pattern.severity === 'critical' ? 'bg-red-100 text-red-800' :
                            pattern.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {pattern.confidence}% AI
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-slate-500">Location:</span>
                            <span className="ml-2 font-medium text-slate-900">{pattern.location || 'Multiple'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Affected:</span>
                            <span className="ml-2 font-medium text-slate-900">{pattern.affectedPersons} persons</span>
                          </div>
                        </div>

                        <div className="bg-blue-50 rounded p-3 mb-3">
                          <div className="text-xs font-semibold text-blue-900 mb-1">🤖 AI Recommendation:</div>
                          <div className="text-sm text-blue-800">{pattern.aiRecommendation}</div>
                        </div>

                        <div className="flex gap-2">
                          <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700">
                            Investigate Pattern
                          </button>
                          <button className="px-3 py-2 border border-slate-300 rounded text-sm text-slate-700 hover:bg-slate-50">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Intelligence Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200">
              <div className="px-6 py-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-600" />
                  <h2 className="text-lg font-bold text-slate-900">Intelligence Timeline</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {recentEvents.slice(0, 10).map((event, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm">
                      <div className="text-xs text-slate-500 w-16 flex-shrink-0">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </div>
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        event.severity === 'error' ? 'bg-red-500' :
                        event.severity === 'warning' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}></div>
                     <div className="flex-1">
                        <span className="font-medium text-slate-900">{event.agencyName}</span>
                        <span className="text-slate-600">
                          {event.eventType === 'sync' && ` synced ${event.recordsProcessed} records`}
                          {event.eventType === 'error' && ' - Connection error'}
                          {event.eventType === 'alert' && ' - Alert triggered'}
                          {event.eventType === 'api_call' && ' - API request'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - AI Insights & Agency Health */}
          <div className="col-span-4 space-y-6">
            
            {/* AI Insight Card */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-6 h-6" />
                <h3 className="text-lg font-bold">AI Intelligence Summary</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-blue-100 mb-1">Active Patterns Detected</div>
                  <div className="text-3xl font-bold">{patterns.length}</div>
                </div>
                <div>
                  <div className="text-sm text-blue-100 mb-1">Anomalies Flagged</div>
                  <div className="text-3xl font-bold">{anomalies.length}</div>
                </div>
                <div>
                  <div className="text-sm text-blue-100 mb-1">High-Confidence Alerts</div>
                  <div className="text-3xl font-bold">
                    {[...patterns, ...anomalies].filter(x => x.confidence > 90).length}
                  </div>
                </div>
                <div className="pt-3 border-t border-blue-400">
                  <div className="text-xs text-blue-100">AI models running 24/7</div>
                  <div className="text-sm font-semibold mt-1">Real-time threat monitoring active</div>
                </div>
              </div>
            </div>

            {/* Agency Health Status */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200">
              <div className="px-6 py-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-slate-600" />
                  <h3 className="text-lg font-bold text-slate-900">Agency Health</h3>
                </div>
              </div>
              <div className="p-6">
                {agencyHealth && (
                  <>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{agencyHealth.online}</div>
                        <div className="text-xs text-slate-600">Online</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">{agencyHealth.degraded}</div>
                        <div className="text-xs text-slate-600">Degraded</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{agencyHealth.offline}</div>
                        <div className="text-xs text-slate-600">Offline</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {getAllAgencies().slice(0, 6).map((agency, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              agency.status === 'online' ? 'bg-green-500' :
                              agency.status === 'degraded' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}></div>
                            <span className="text-slate-900 font-medium">{agency.agencyName.split('(')[0].trim()}</span>
                          </div>
                          <span className="text-xs text-slate-500">{agency.uptime}%</span>
                        </div>
                      ))}
                    </div>

                    <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View All Agencies →
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200">
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-left transition-colors">
                  <Map className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-slate-900">Geospatial Map</div>
                    <div className="text-xs text-slate-600">View threat locations</div>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-left transition-colors">
                  <Network className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium text-slate-900">Network Analysis</div>
                    <div className="text-xs text-slate-600">Relationship mapping</div>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-left transition-colors">
                  <Search className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium text-slate-900">AI Assistant</div>
                    <div className="text-xs text-slate-600">Natural language query</div>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-left transition-colors">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <div>
                    <div className="font-medium text-slate-900">Predictive Analytics</div>
                    <div className="text-xs text-slate-600">Forecast threats</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
