import { useState } from 'react';
import {
  Plane, Ship, Users, AlertTriangle, CheckCircle, Clock,
  Search, Filter, MapPin, Fingerprint, Shield, Eye, XCircle,
  TrendingUp, Activity, Play, Pause
} from 'lucide-react';
import { useRealTimeSimulation, useConnectionStatus } from '../../hooks/useRealTimeSimulation';
import LiveIndicator from '../../components/LiveIndicator';

interface BiometricVerification {
  fingerprintMatch: number; // 0-100
  faceMatch: number; // 0-100
  status: 'verified' | 'failed' | 'pending';
}

interface RiskAssessment {
  overall: number; // 0-100
  criminal: number;
  visaCompliance: number;
  financial: number;
  travelHistory: number;
  watchList: boolean;
  breakdown: {
    factor: string;
    score: number;
    status: 'pass' | 'warning' | 'fail';
  }[];
}

interface BorderCrossing {
  id: string;
  timestamp: string;
  checkpoint: string;
  type: 'entry' | 'exit';
  person: {
    name: string;
    nationality: string;
    passportNumber?: string;
    nationalID?: string;
    dateOfBirth: string;
    photo?: string;
  };
  biometric: BiometricVerification;
  riskAssessment: RiskAssessment;
  status: 'approved' | 'flagged' | 'detained' | 'reviewing';
  processingTime: number; // seconds
  officer: string;
  aiRecommendation: string;
}

// Mock data generators
const liberianNames = [
  'Josephine Saah', 'Emmanuel Togba', 'Mary Johnson', 'David Kpan',
  'Grace Mensah', 'Ibrahim Kamara', 'Sarah Williams', 'Thomas Koffa',
  'Elizabeth Kollie', 'John Kwame', 'Rebecca Nyenabo', 'Michael Korto',
  'Patience Gborplay', 'Francis Sando', 'Benita Cooper', 'James Dolo'
];

const nationalities = [
  'Liberian', 'Nigerian', 'Ghanaian', 'Sierra Leonean', 'Ivorian',
  'Guinean', 'American', 'British', 'French', 'Chinese'
];

const checkpoints = [
  'Roberts International Airport',
  'Bo Waterside Border (Grand Cape Mount)',
  'Ganta Border Post (Nimba)',
  'Freeport of Monrovia'
];

const officers = [
  'Officer John Mensah',
  'Officer Sarah Kpan',
  'Officer David Williams',
  'Officer Grace Togba'
];

function generateCrossing(id: number): BorderCrossing {
  const name = liberianNames[Math.floor(Math.random() * liberianNames.length)];
  const nationality = nationalities[Math.floor(Math.random() * nationalities.length)];
  const checkpoint = checkpoints[Math.floor(Math.random() * checkpoints.length)];
  const type = Math.random() > 0.5 ? 'entry' : 'exit';

  // Deterministic risk scoring based on factors
  const hasCriminalRecord = Math.random() < 0.15;
  const hasVisaIssues = Math.random() < 0.2;
  const hasFinancialFlags = Math.random() < 0.1;
  const hasTravelAnomalies = Math.random() < 0.25;
  const onWatchList = Math.random() < 0.05;

  const criminalScore = hasCriminalRecord ? Math.floor(Math.random() * 30) + 20 : Math.floor(Math.random() * 15);
  const visaScore = hasVisaIssues ? Math.floor(Math.random() * 25) + 15 : Math.floor(Math.random() * 10);
  const financialScore = hasFinancialFlags ? Math.floor(Math.random() * 20) + 10 : Math.floor(Math.random() * 8);
  const travelScore = hasTravelAnomalies ? Math.floor(Math.random() * 15) + 10 : Math.floor(Math.random() * 5);

  const overallRisk = Math.min(
    criminalScore + visaScore + financialScore + travelScore + (onWatchList ? 30 : 0),
    100
  );

  const breakdown = [
    {
      factor: 'Criminal Record Check',
      score: criminalScore,
      status: (criminalScore > 20 ? 'fail' : criminalScore > 10 ? 'warning' : 'pass') as 'pass' | 'warning' | 'fail'
    },
    {
      factor: 'Visa Compliance',
      score: visaScore,
      status: (visaScore > 20 ? 'fail' : visaScore > 10 ? 'warning' : 'pass') as 'pass' | 'warning' | 'fail'
    },
    {
      factor: 'Financial Indicators',
      score: financialScore,
      status: (financialScore > 15 ? 'fail' : financialScore > 8 ? 'warning' : 'pass') as 'pass' | 'warning' | 'fail'
    },
    {
      factor: 'Travel History',
      score: travelScore,
      status: (travelScore > 12 ? 'fail' : travelScore > 6 ? 'warning' : 'pass') as 'pass' | 'warning' | 'fail'
    }
  ];

  if (onWatchList) {
    breakdown.push({
      factor: 'Watch List Match',
      score: 100,
      status: 'fail'
    });
  }

  // Biometric scores
  const fingerprintMatch = Math.floor(Math.random() * 15) + 85; // 85-100
  const faceMatch = Math.floor(Math.random() * 20) + 80; // 80-100
  const biometricStatus = fingerprintMatch > 90 && faceMatch > 85 ? 'verified' :
                          fingerprintMatch < 88 || faceMatch < 83 ? 'failed' : 'pending';

  // Status determination
  let status: 'approved' | 'flagged' | 'detained' | 'reviewing';
  if (onWatchList || overallRisk > 80) {
    status = 'detained';
  } else if (overallRisk > 60 || biometricStatus === 'failed') {
    status = 'flagged';
  } else if (overallRisk > 40 || biometricStatus === 'pending') {
    status = 'reviewing';
  } else {
    status = 'approved';
  }

  // AI Recommendation
  let aiRecommendation = '';
  if (status === 'detained') {
    aiRecommendation = onWatchList
      ? 'IMMEDIATE DETENTION: Subject matches active watchlist. Contact NSA.'
      : 'HIGH RISK: Multiple security concerns detected. Secondary screening required.';
  } else if (status === 'flagged') {
    aiRecommendation = 'CAUTION: Potential security concerns. Recommend manual verification.';
  } else if (status === 'reviewing') {
    aiRecommendation = 'REVIEW: Minor irregularities detected. Standard verification process.';
  } else {
    aiRecommendation = 'CLEARED: All security checks passed. Approve for entry/exit.';
  }

  const now = new Date();
  const timestamp = new Date(now.getTime() - Math.random() * 300000).toISOString(); // Last 5 minutes

  return {
    id: `BC-${String(id).padStart(6, '0')}`,
    timestamp,
    checkpoint,
    type,
    person: {
      name,
      nationality,
      passportNumber: nationality !== 'Liberian' ? `${nationality.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 9000000) + 1000000}` : undefined,
      nationalID: nationality === 'Liberian' ? `${Math.floor(Math.random() * 90000000000000) + 10000000000000}` : undefined,
      dateOfBirth: `${1950 + Math.floor(Math.random() * 50)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
    },
    biometric: {
      fingerprintMatch,
      faceMatch,
      status: biometricStatus
    },
    riskAssessment: {
      overall: overallRisk,
      criminal: criminalScore,
      visaCompliance: visaScore,
      financial: financialScore,
      travelHistory: travelScore,
      watchList: onWatchList,
      breakdown
    },
    status,
    processingTime: Math.floor(Math.random() * 180) + 30, // 30-210 seconds
    officer: officers[Math.floor(Math.random() * officers.length)],
    aiRecommendation
  };
}

export default function LiveCrossings() {
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'approved' | 'flagged' | 'detained' | 'reviewing'>('all');
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<'all' | string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrossing, setSelectedCrossing] = useState<BorderCrossing | null>(null);

  // Track crossing ID counter
  const [crossingCounter, setCrossingCounter] = useState(1);

  // Real-time simulation hook
  const {
    items: crossings,
    isActive: isLive,
    lastUpdate,
    totalGenerated,
    controls: liveControls,
  } = useRealTimeSimulation<BorderCrossing>(
    () => {
      const crossing = generateCrossing(crossingCounter);
      setCrossingCounter(prev => prev + 1);
      return crossing;
    },
    {
      interval: 8000, // New crossing every 8 seconds
      maxItems: 50,
      autoStart: true,
    }
  );

  // Connection status simulation
  const { isOnline, uptimePercentage } = useConnectionStatus();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'reviewing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'flagged':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'detained':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return 'text-red-600 bg-red-50';
    if (risk >= 60) return 'text-orange-600 bg-orange-50';
    if (risk >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'reviewing':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'flagged':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'detained':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredCrossings = crossings
    .filter(c => selectedStatus === 'all' || c.status === selectedStatus)
    .filter(c => selectedCheckpoint === 'all' || c.checkpoint === selectedCheckpoint)
    .filter(c =>
      c.person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.person.passportNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.person.nationalID?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const stats = {
    total: crossings.length,
    approved: crossings.filter(c => c.status === 'approved').length,
    reviewing: crossings.filter(c => c.status === 'reviewing').length,
    flagged: crossings.filter(c => c.status === 'flagged').length,
    detained: crossings.filter(c => c.status === 'detained').length,
    avgProcessingTime: Math.round(crossings.reduce((sum, c) => sum + c.processingTime, 0) / crossings.length),
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Live Border Crossings</h1>
          <p className="text-slate-600 mt-1">Real-time entry/exit processing with AI risk assessment</p>
        </div>
        <div className="flex items-center gap-3">
          <LiveIndicator
            isLive={isLive}
            lastUpdate={lastUpdate}
            isOnline={isOnline}
            showTimestamp={true}
            showConnection={true}
          />
          <button
            onClick={liveControls.toggle}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            {isLive ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Resume
              </>
            )}
          </button>
        </div>
      </div>

      {/* Real-Time Stats Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Activity className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm font-bold text-blue-900">System Performance</div>
              <div className="text-xs text-blue-700">
                {totalGenerated} crossings processed • System uptime: {uptimePercentage.toFixed(2)}%
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-blue-700">
            <Clock className="w-4 h-4" />
            <span>Next update in ~{isLive ? '8' : '0'}s</span>
          </div>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-600">Total Today</div>
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            </div>
            <Users className="w-8 h-8 text-slate-600 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-600">Approved</div>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-600">Reviewing</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.reviewing}</div>
            </div>
            <Clock className="w-8 h-8 text-yellow-600 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-600">Flagged</div>
              <div className="text-2xl font-bold text-orange-600">{stats.flagged}</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-600">Detained</div>
              <div className="text-2xl font-bold text-red-600">{stats.detained}</div>
            </div>
            <XCircle className="w-8 h-8 text-red-600 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-600">Avg Time</div>
              <div className="text-2xl font-bold text-blue-600">{stats.avgProcessingTime}s</div>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, passport, ID, or crossing number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedStatus('approved')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                selectedStatus === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setSelectedStatus('flagged')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                selectedStatus === 'flagged'
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Flagged
            </button>
            <button
              onClick={() => setSelectedStatus('detained')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                selectedStatus === 'detained'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Detained
            </button>
          </div>

          {/* Checkpoint Filter */}
          <select
            value={selectedCheckpoint}
            onChange={(e) => setSelectedCheckpoint(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Checkpoints</option>
            {checkpoints.map(cp => (
              <option key={cp} value={cp}>{cp}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Crossings List */}
      <div className="space-y-3">
        {filteredCrossings.map((crossing) => (
          <div
            key={crossing.id}
            onClick={() => setSelectedCrossing(crossing)}
            className="bg-white rounded-lg shadow-sm border-2 border-slate-200 p-5 hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                {/* Person Icon/Photo */}
                <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-8 h-8 text-slate-600" />
                </div>

                {/* Person Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{crossing.person.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(crossing.status)}`}>
                      {crossing.status.toUpperCase()}
                    </span>
                    {crossing.riskAssessment.watchList && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white animate-pulse">
                        ⚠️ WATCHLIST
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-slate-500">Crossing ID:</span>
                      <div className="font-medium text-slate-900">{crossing.id}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Nationality:</span>
                      <div className="font-medium text-slate-900">{crossing.person.nationality}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">{crossing.person.passportNumber ? 'Passport' : 'National ID'}:</span>
                      <div className="font-medium text-slate-900 font-mono text-xs">
                        {crossing.person.passportNumber || crossing.person.nationalID}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Time:</span>
                      <div className="font-medium text-slate-900">{formatTime(crossing.timestamp)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Score */}
              <div className={`px-5 py-4 rounded-lg text-center min-w-[120px] ml-4 ${getRiskColor(crossing.riskAssessment.overall)}`}>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-semibold">Risk Score</span>
                </div>
                <div className="text-3xl font-bold">{crossing.riskAssessment.overall}</div>
                <div className="text-xs mt-1">
                  {crossing.riskAssessment.overall >= 80 ? 'CRITICAL' :
                   crossing.riskAssessment.overall >= 60 ? 'HIGH' :
                   crossing.riskAssessment.overall >= 40 ? 'MEDIUM' : 'LOW'}
                </div>
              </div>
            </div>

            {/* Checkpoint & Type */}
            <div className="flex items-center gap-4 mb-3 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span className="text-slate-700">{crossing.checkpoint}</span>
              </div>
              <div className="flex items-center gap-2">
                {crossing.type === 'entry' ? (
                  <>
                    <Plane className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700 font-medium">ENTRY</span>
                  </>
                ) : (
                  <>
                    <Ship className="w-4 h-4 text-purple-600" />
                    <span className="text-purple-700 font-medium">EXIT</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Fingerprint className={`w-4 h-4 ${
                  crossing.biometric.status === 'verified' ? 'text-green-600' :
                  crossing.biometric.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                }`} />
                <span className={`font-medium ${
                  crossing.biometric.status === 'verified' ? 'text-green-700' :
                  crossing.biometric.status === 'failed' ? 'text-red-700' : 'text-yellow-700'
                }`}>
                  Biometric: {crossing.biometric.status.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-slate-500">Officer:</span>
                <span className="font-medium text-slate-900">{crossing.officer}</span>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className={`p-3 rounded-lg ${
              crossing.status === 'detained' ? 'bg-red-50 border border-red-200' :
              crossing.status === 'flagged' ? 'bg-orange-50 border border-orange-200' :
              crossing.status === 'reviewing' ? 'bg-yellow-50 border border-yellow-200' :
              'bg-green-50 border border-green-200'
            }`}>
              <div className="flex items-start gap-2">
                {getStatusIcon(crossing.status)}
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-700 mb-1">🤖 AI Recommendation:</div>
                  <div className={`text-sm font-medium ${
                    crossing.status === 'detained' ? 'text-red-900' :
                    crossing.status === 'flagged' ? 'text-orange-900' :
                    crossing.status === 'reviewing' ? 'text-yellow-900' :
                    'text-green-900'
                  }`}>
                    {crossing.aiRecommendation}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCrossing(crossing);
                  }}
                  className="text-xs bg-white hover:bg-slate-50 border border-slate-300 px-3 py-1 rounded flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedCrossing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedCrossing(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedCrossing.person.name}</h2>
                  <p className="text-blue-100">Crossing ID: {selectedCrossing.id}</p>
                </div>
                <button
                  onClick={() => setSelectedCrossing(null)}
                  className="text-white hover:bg-white/20 rounded-lg p-2"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Biometric Verification */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Biometric Verification</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-xs text-slate-600 mb-1">Fingerprint Match</div>
                    <div className={`text-2xl font-bold ${selectedCrossing.biometric.fingerprintMatch > 90 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {selectedCrossing.biometric.fingerprintMatch}%
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-xs text-slate-600 mb-1">Face Match</div>
                    <div className={`text-2xl font-bold ${selectedCrossing.biometric.faceMatch > 85 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {selectedCrossing.biometric.faceMatch}%
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-xs text-slate-600 mb-1">Status</div>
                    <div className={`text-lg font-bold ${
                      selectedCrossing.biometric.status === 'verified' ? 'text-green-600' :
                      selectedCrossing.biometric.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {selectedCrossing.biometric.status.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Assessment Breakdown */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Risk Assessment Breakdown</h3>
                <div className="space-y-3">
                  {selectedCrossing.riskAssessment.breakdown.map((factor, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-3 h-3 rounded-full ${
                          factor.status === 'pass' ? 'bg-green-500' :
                          factor.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <span className="text-sm font-medium text-slate-900">{factor.factor}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-48 bg-slate-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              factor.status === 'pass' ? 'bg-green-500' :
                              factor.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${factor.score}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-slate-900 w-12 text-right">{factor.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Approve Crossing
                </button>
                <button className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-medium flex items-center justify-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Detain for Questioning
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredCrossings.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          <Filter className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No Crossings Found</h3>
          <p className="text-slate-600">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
}
