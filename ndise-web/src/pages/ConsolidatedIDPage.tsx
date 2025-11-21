import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User, Shield, AlertTriangle, MapPin, Phone, CreditCard, Camera,
  Fingerprint, Clock, TrendingUp, Flag, Bell, Lock, Unlock,
  Eye, FileText, Network, Play, Ban, CheckCircle, XCircle,
  Activity, Globe, Briefcase, Users, Search, Download, Share2
} from 'lucide-react';

interface ConsolidatedPerson {
  // Core Identity
  nationalId: string;
  name: string;
  photo?: string;
  dateOfBirth: string;
  nationality: string;
  gender: 'male' | 'female';

  // Contact
  address: string;
  phone?: string;
  email?: string;

  // Status
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'flagged' | 'watchlist' | 'detained' | 'deceased';

  // Flags & Alerts
  alerts: Array<{
    id: string;
    type: 'watchlist' | 'warrant' | 'overstay' | 'fraud' | 'surveillance';
    severity: 'critical' | 'high' | 'medium' | 'low';
    message: string;
    createdBy: string;
    createdAt: string;
  }>;

  // Border History
  borderCrossings: Array<{
    id: string;
    date: string;
    checkpoint: string;
    type: 'entry' | 'exit';
    destination?: string;
    approved: boolean;
  }>;

  // Police Records
  policeRecords: Array<{
    id: string;
    type: 'case' | 'warrant' | 'arrest' | 'investigation';
    status: string;
    description: string;
    date: string;
    officer: string;
  }>;

  // NSA Intelligence
  nsaIntelligence: Array<{
    id: string;
    type: 'surveillance' | 'intercept' | 'analysis' | 'threat';
    classification: 'top_secret' | 'secret' | 'confidential' | 'unclassified';
    summary: string;
    date: string;
  }>;

  // Financial Activity
  financialActivity: Array<{
    id: string;
    type: 'flagged_transaction' | 'unusual_pattern' | 'large_transfer';
    amount: number;
    currency: string;
    date: string;
    details: string;
  }>;

  // Communications
  communications: Array<{
    id: string;
    type: 'phone' | 'sim' | 'internet';
    number?: string;
    carrier?: string;
    status: 'active' | 'inactive' | 'monitored';
    lastActivity: string;
  }>;

  // Biometric Data
  biometrics: {
    fingerprints: { captured: boolean; quality: number; lastUpdated: string };
    facialRecognition: { captured: boolean; quality: number; lastUpdated: string };
    iris?: { captured: boolean; quality: number; lastUpdated: string };
  };

  // Network
  associates: Array<{
    id: string;
    name: string;
    nationalId: string;
    relationship: string;
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
  }>;
}

// Sample data
const samplePerson: ConsolidatedPerson = {
  nationalId: 'LBR-2024-8234',
  name: 'Marcus Gaye',
  photo: undefined,
  dateOfBirth: '1990-03-15',
  nationality: 'Liberian',
  gender: 'male',
  address: '45 Broad Street, Monrovia, Montserrado County',
  phone: '+231 777 123 456',
  email: 'marcus.gaye@email.com',
  riskLevel: 'critical',
  status: 'watchlist',
  alerts: [
    {
      id: 'ALT-001',
      type: 'watchlist',
      severity: 'critical',
      message: 'Subject of active fraud investigation - Global Trade Ltd',
      createdBy: 'Police Criminal Investigation',
      createdAt: '2024-01-10 09:30',
    },
    {
      id: 'ALT-002',
      type: 'surveillance',
      severity: 'high',
      message: 'Under NSA surveillance - unusual international activity',
      createdBy: 'NSA Operations',
      createdAt: '2024-01-12 14:00',
    },
  ],
  borderCrossings: [
    {
      id: 'BC-001',
      date: '2024-01-15 08:30',
      checkpoint: 'Roberts International Airport',
      type: 'entry',
      destination: 'Lagos, Nigeria',
      approved: true,
    },
    {
      id: 'BC-002',
      date: '2024-01-08 16:45',
      checkpoint: 'Roberts International Airport',
      type: 'exit',
      destination: 'Accra, Ghana',
      approved: true,
    },
    {
      id: 'BC-003',
      date: '2024-01-05 11:20',
      checkpoint: 'Roberts International Airport',
      type: 'entry',
      destination: 'Abidjan, Ivory Coast',
      approved: true,
    },
  ],
  policeRecords: [
    {
      id: 'CASE-2024-11-234',
      type: 'investigation',
      status: 'active',
      description: 'Fraud Investigation - Global Trade Ltd suspicious transactions',
      date: '2024-01-08',
      officer: 'Det. Sarah Johnson',
    },
    {
      id: 'CASE-2024-10-892',
      type: 'case',
      status: 'closed',
      description: 'Customs violation - Undeclared goods',
      date: '2023-12-15',
      officer: 'Officer David Mensah',
    },
  ],
  nsaIntelligence: [
    {
      id: 'NSA-2024-456',
      type: 'surveillance',
      classification: 'secret',
      summary: 'Subject under active surveillance - frequent contact with foreign entities',
      date: '2024-01-12',
    },
    {
      id: 'NSA-2024-389',
      type: 'analysis',
      classification: 'confidential',
      summary: 'Pattern analysis indicates potential financial crimes network',
      date: '2024-01-05',
    },
  ],
  financialActivity: [
    {
      id: 'FIN-001',
      type: 'large_transfer',
      amount: 125000,
      currency: 'USD',
      date: '2024-01-14',
      details: 'Wire transfer to offshore account - flagged for review',
    },
    {
      id: 'FIN-002',
      type: 'unusual_pattern',
      amount: 85000,
      currency: 'USD',
      date: '2024-01-10',
      details: 'Multiple cash deposits below reporting threshold',
    },
  ],
  communications: [
    {
      id: 'SIM-001',
      type: 'sim',
      number: '+231 777 123 456',
      carrier: 'Lonestar MTN',
      status: 'monitored',
      lastActivity: '2024-01-15 14:23',
    },
    {
      id: 'SIM-002',
      type: 'sim',
      number: '+231 886 789 012',
      carrier: 'Orange Liberia',
      status: 'active',
      lastActivity: '2024-01-14 09:15',
    },
  ],
  biometrics: {
    fingerprints: { captured: true, quality: 95, lastUpdated: '2024-01-01' },
    facialRecognition: { captured: true, quality: 92, lastUpdated: '2024-01-01' },
    iris: { captured: false, quality: 0, lastUpdated: '' },
  },
  associates: [
    {
      id: '1',
      name: 'Sarah Togba',
      nationalId: 'LBR-2024-8235',
      relationship: 'Business Partner',
      riskLevel: 'high',
    },
    {
      id: '2',
      name: 'Emmanuel Dahn',
      nationalId: 'LBR-2024-8238',
      relationship: 'Frequent Contact',
      riskLevel: 'high',
    },
    {
      id: '3',
      name: 'Victoria Doe',
      nationalId: 'LBR-2024-8237',
      relationship: 'Spouse',
      riskLevel: 'low',
    },
  ],
};

export default function ConsolidatedIDPage() {
  const { nationalId } = useParams();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [person] = useState<ConsolidatedPerson>(samplePerson);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'flagged':
        return 'bg-orange-100 text-orange-700';
      case 'watchlist':
        return 'bg-red-100 text-red-700';
      case 'detained':
        return 'bg-red-200 text-red-900';
      case 'deceased':
        return 'bg-slate-200 text-slate-900';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const handleAction = (action: string) => {
    // Navigate to appropriate page based on action
    const targetId = person.nationalId;
    const targetName = encodeURIComponent(person.name);

    switch (action) {
      case 'surveillance':
        // Go to CCTV surveillance with target context
        navigate(`/nsa/surveillance?targetId=${targetId}&targetName=${targetName}`);
        break;
      default:
        // All other actions go to AI Command Center
        navigate(`/nsa/ai-command?targetId=${targetId}&targetName=${targetName}`);
        break;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'border', label: 'Border History', icon: Globe },
    { id: 'police', label: 'Police Records', icon: Shield },
    { id: 'nsa', label: 'NSA Intelligence', icon: Eye },
    { id: 'financial', label: 'Financial', icon: CreditCard },
    { id: 'communications', label: 'Communications', icon: Phone },
    { id: 'biometric', label: 'Biometric', icon: Fingerprint },
    { id: 'network', label: 'Network', icon: Network },
    { id: 'timeline', label: 'Timeline', icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Consolidated National ID Profile</h1>
          <p className="text-slate-600 mt-1">Complete intelligence dossier - All agencies integrated</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            Export Dossier
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-start gap-6">
          {/* Photo */}
          <div className="w-32 h-32 bg-slate-200 rounded-lg flex items-center justify-center">
            {person.photo ? (
              <img src={person.photo} alt={person.name} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <User className="w-16 h-16 text-slate-400" />
            )}
          </div>

          {/* Core Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{person.name}</h2>
                <p className="text-lg text-slate-600 mt-1">National ID: {person.nationalId}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-full text-sm font-bold border ${getRiskColor(person.riskLevel)}`}>
                  {person.riskLevel.toUpperCase()} RISK
                </span>
                <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${getStatusColor(person.status)}`}>
                  {person.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-slate-600">Date of Birth</div>
                <div className="font-semibold text-slate-900">{person.dateOfBirth}</div>
              </div>
              <div>
                <div className="text-slate-600">Nationality</div>
                <div className="font-semibold text-slate-900">{person.nationality}</div>
              </div>
              <div>
                <div className="text-slate-600">Gender</div>
                <div className="font-semibold text-slate-900 capitalize">{person.gender}</div>
              </div>
              <div>
                <div className="text-slate-600">Active Alerts</div>
                <div className="font-semibold text-red-600">{person.alerts.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      {person.alerts.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-red-900 mb-2">🚨 ACTIVE ALERTS ({person.alerts.length})</h3>
              <div className="space-y-2">
                {person.alerts.map(alert => (
                  <div key={alert.id} className="bg-white border border-red-200 rounded p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${getRiskColor(alert.severity)}`}>
                            {alert.type.toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-500">{alert.createdAt}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-900">{alert.message}</p>
                        <p className="text-xs text-slate-600 mt-1">Created by: {alert.createdBy}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Panel */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg shadow-lg p-6 text-white">
        <h3 className="font-bold text-lg mb-4">⚡ Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => handleAction('surveillance')}
            className="flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-left"
          >
            <Camera className="w-5 h-5" />
            <div>
              <div className="font-semibold text-sm">Start Surveillance</div>
              <div className="text-xs text-slate-300">Monitor CCTV feeds</div>
            </div>
          </button>

          <button
            onClick={() => handleAction('watchlist')}
            className="flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-left"
          >
            <Eye className="w-5 h-5" />
            <div>
              <div className="font-semibold text-sm">Add to Watchlist</div>
              <div className="text-xs text-slate-300">Flag across system</div>
            </div>
          </button>

          <button
            onClick={() => handleAction('border_alert')}
            className="flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-left"
          >
            <Bell className="w-5 h-5" />
            <div>
              <div className="font-semibold text-sm">Border Alert</div>
              <div className="text-xs text-slate-300">Alert all checkpoints</div>
            </div>
          </button>

          <button
            onClick={() => handleAction('detention')}
            className="flex items-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-left"
          >
            <Ban className="w-5 h-5" />
            <div>
              <div className="font-semibold text-sm">Request Detention</div>
              <div className="text-xs text-red-200">Immediate action</div>
            </div>
          </button>

          <button
            onClick={() => handleAction('purchase_check')}
            className="flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-left"
          >
            <CreditCard className="w-5 h-5" />
            <div>
              <div className="font-semibold text-sm">Check Purchases</div>
              <div className="text-xs text-slate-300">Transaction history</div>
            </div>
          </button>

          <button
            onClick={() => handleAction('sim_monitor')}
            className="flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-left"
          >
            <Phone className="w-5 h-5" />
            <div>
              <div className="font-semibold text-sm">Monitor SIM</div>
              <div className="text-xs text-slate-300">Track communications</div>
            </div>
          </button>

          <button
            onClick={() => handleAction('nsa_report')}
            className="flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-left"
          >
            <Shield className="w-5 h-5" />
            <div>
              <div className="font-semibold text-sm">Escalate to NSA</div>
              <div className="text-xs text-slate-300">National security</div>
            </div>
          </button>

          <button
            onClick={() => handleAction('network_analysis')}
            className="flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-left"
          >
            <Network className="w-5 h-5" />
            <div>
              <div className="font-semibold text-sm">Network Analysis</div>
              <div className="text-xs text-slate-300">View connections</div>
            </div>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    selectedTab === tab.id
                      ? 'border-blue-600 text-blue-700 bg-blue-50'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Tab Content will be added here */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-900">Border Crossings</span>
                    <Globe className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-900">{person.borderCrossings.length}</div>
                  <div className="text-xs text-blue-700 mt-1">Last 6 months</div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-orange-900">Police Records</span>
                    <Shield className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-orange-900">{person.policeRecords.length}</div>
                  <div className="text-xs text-orange-700 mt-1">Active cases</div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-900">Known Associates</span>
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-900">{person.associates.length}</div>
                  <div className="text-xs text-purple-700 mt-1">Direct connections</div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-bold text-slate-900 mb-3">Recent Activity</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-600">2024-01-15 08:30</span>
                    <span className="text-slate-900">Border crossing at Roberts International Airport (Entry)</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-slate-600">2024-01-14</span>
                    <span className="text-slate-900">Flagged financial transaction - $125,000 wire transfer</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-slate-600">2024-01-12</span>
                    <span className="text-slate-900">Placed under NSA surveillance</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'border' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900">Border Crossing History</h4>
              {person.borderCrossings.map(crossing => (
                <div key={crossing.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          crossing.type === 'entry' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {crossing.type.toUpperCase()}
                        </span>
                        <span className="text-sm font-semibold text-slate-900">{crossing.checkpoint}</span>
                      </div>
                      <div className="text-sm text-slate-600">{crossing.date}</div>
                      {crossing.destination && (
                        <div className="text-xs text-slate-500 mt-1">Destination: {crossing.destination}</div>
                      )}
                    </div>
                    <div>
                      {crossing.approved ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add more tab content as needed */}
          {selectedTab === 'network' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900">Known Associates & Network</h4>
              {person.associates.map(associate => (
                <div key={associate.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">{associate.name}</div>
                      <div className="text-sm text-slate-600">ID: {associate.nationalId}</div>
                      <div className="text-xs text-slate-500 mt-1">{associate.relationship}</div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold border ${getRiskColor(associate.riskLevel)}`}>
                      {associate.riskLevel.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      {showActionModal && selectedAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-900">Confirm Action</h3>
            </div>
            <div className="p-6">
              <p className="text-slate-700 mb-4">
                You are about to execute: <strong className="capitalize">{selectedAction.replace(/_/g, ' ')}</strong>
              </p>
              <p className="text-sm text-slate-600">
                This action will be logged in the system audit trail and notify relevant personnel.
              </p>
            </div>
            <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowActionModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Here we'll integrate with the AI Command Center
                  console.log(`Executing action: ${selectedAction}`);
                  setShowActionModal(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Execute Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
