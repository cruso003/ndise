import { useState } from 'react';
import { AlertTriangle, Search, Filter, User, MapPin, Calendar, Shield } from 'lucide-react';

interface WantedPerson {
  id: string;
  nationalId: string;
  fullName: string;
  alias: string[];
  dateOfBirth: string;
  lastKnownLocation: string;
  crime: string;
  caseNumber: string;
  warrantDate: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'detained' | 'sighted';
  photoUrl?: string;
  reward?: string;
}

export default function WantedPersons() {
  const [selectedRisk, setSelectedRisk] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const wantedPersons: WantedPerson[] = [
    {
      id: '1',
      nationalId: '1988031512345670',
      fullName: 'Ahmed Hassan',
      alias: ['Abu Hassan', 'Ahmed Ibrahim'],
      dateOfBirth: '1988-03-15',
      lastKnownLocation: 'Monrovia City Center',
      crime: 'Armed Robbery, Assault',
      caseNumber: 'CASE-2024-11-189',
      warrantDate: '2024-11-15',
      riskLevel: 'critical',
      status: 'sighted',
      reward: '$5,000 USD'
    },
    {
      id: '2',
      nationalId: '1985050112345671',
      fullName: 'Michael Korto Smith',
      alias: ['Mike Smith', 'MK Smith'],
      dateOfBirth: '1985-05-01',
      lastKnownLocation: 'Paynesville',
      crime: 'Fraud, Embezzlement',
      caseNumber: 'CASE-2025-11-234',
      warrantDate: '2024-11-10',
      riskLevel: 'high',
      status: 'active',
      reward: '$2,000 USD'
    },
    {
      id: '3',
      nationalId: '1992081212345672',
      fullName: 'Sarah Johnson Williams',
      alias: ['Sarah J.', 'Sally Williams'],
      dateOfBirth: '1992-08-12',
      lastKnownLocation: 'Unknown',
      crime: 'Identity Theft, Document Forgery',
      caseNumber: 'CASE-2024-10-456',
      warrantDate: '2024-10-20',
      riskLevel: 'high',
      status: 'active',
      reward: '$1,500 USD'
    },
    {
      id: '4',
      nationalId: '1978122012345673',
      fullName: 'Ibrahim Kamara',
      alias: ['IK'],
      dateOfBirth: '1978-12-20',
      lastKnownLocation: 'Sinkor Area',
      crime: 'Drug Trafficking',
      caseNumber: 'CASE-2024-09-789',
      warrantDate: '2024-09-05',
      riskLevel: 'critical',
      status: 'active',
      reward: '$10,000 USD'
    },
    {
      id: '5',
      nationalId: '1995040712345674',
      fullName: 'Emmanuel Togba',
      alias: [],
      dateOfBirth: '1995-04-07',
      lastKnownLocation: 'Red Light Market',
      crime: 'Theft, Breaking and Entering',
      caseNumber: 'CASE-2024-11-567',
      warrantDate: '2024-11-18',
      riskLevel: 'medium',
      status: 'active',
      reward: '$500 USD'
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-800';
      case 'sighted':
        return 'bg-yellow-100 text-yellow-800';
      case 'detained':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPersons = wantedPersons
    .filter(person => selectedRisk === 'all' || person.riskLevel === selectedRisk)
    .filter(person =>
      person.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.nationalId.includes(searchQuery) ||
      person.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.alias.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const stats = {
    total: wantedPersons.length,
    critical: wantedPersons.filter(p => p.riskLevel === 'critical').length,
    high: wantedPersons.filter(p => p.riskLevel === 'high').length,
    sighted: wantedPersons.filter(p => p.status === 'sighted').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Wanted Persons Registry</h1>
        <p className="text-slate-600 mt-1">Active warrants and most wanted list</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Total Wanted</div>
              <div className="text-3xl font-bold text-red-600">{stats.total}</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Critical Risk</div>
              <div className="text-3xl font-bold text-red-600">{stats.critical}</div>
            </div>
            <Shield className="w-8 h-8 text-red-600 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">High Risk</div>
              <div className="text-3xl font-bold text-orange-600">{stats.high}</div>
            </div>
            <Shield className="w-8 h-8 text-orange-600 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Recent Sightings</div>
              <div className="text-3xl font-bold text-yellow-600">{stats.sighted}</div>
            </div>
            <MapPin className="w-8 h-8 text-yellow-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg p-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 flex-shrink-0" />
          <div>
            <div className="font-bold mb-1">🚨 Active Alert System</div>
            <div className="text-sm opacity-90">
              All border checkpoints, police stations, and enrollment centers are automatically notified when wanted persons are detected.
              AI facial recognition and fingerprint matching run on all identity verifications.
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedRisk('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedRisk === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedRisk('critical')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedRisk === 'critical'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Critical
            </button>
            <button
              onClick={() => setSelectedRisk('high')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedRisk === 'high'
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              High
            </button>
            <button
              onClick={() => setSelectedRisk('medium')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedRisk === 'medium'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Medium
            </button>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, ID, case#..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Wanted Persons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPersons.map((person) => (
          <div
            key={person.id}
            className="bg-white rounded-lg shadow-sm border-2 border-slate-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex gap-4 mb-4">
              <div className="w-24 h-24 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                {person.photoUrl ? (
                  <img src={person.photoUrl} alt={person.fullName} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <User className="w-12 h-12 text-slate-400" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{person.fullName}</h3>
                    {person.alias.length > 0 && (
                      <div className="text-sm text-slate-600">
                        aka: {person.alias.join(', ')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getRiskColor(person.riskLevel)}`}>
                    {person.riskLevel.toUpperCase()} RISK
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(person.status)}`}>
                    {person.status.toUpperCase()}
                  </span>
                </div>

                {person.reward && (
                  <div className="bg-green-50 border border-green-200 rounded px-2 py-1 text-xs font-semibold text-green-800 inline-block">
                    💰 Reward: {person.reward}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500">National ID:</span>
                  <div className="font-medium text-slate-900">{person.nationalId}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>DOB:</span>
                  </div>
                  <div className="font-medium text-slate-900">{person.dateOfBirth}</div>
                </div>
              </div>

              <div>
                <span className="text-slate-500">Crime:</span>
                <div className="font-medium text-red-600">{person.crime}</div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-slate-500">
                  <MapPin className="w-3 h-3" />
                  <span>Last Known Location:</span>
                </div>
                <div className="font-medium text-slate-900">{person.lastKnownLocation}</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500">Case Number:</span>
                  <div className="font-medium text-slate-900">{person.caseNumber}</div>
                </div>
                <div>
                  <span className="text-slate-500">Warrant Date:</span>
                  <div className="font-medium text-slate-900">{person.warrantDate}</div>
                </div>
              </div>
            </div>

            {person.status === 'sighted' && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div className="flex-1 text-sm text-yellow-900">
                    <strong>RECENT SIGHTING:</strong> Reported at {person.lastKnownLocation}. Exercise caution.
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm">
                View Full Profile
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium text-sm">
                Report Sighting
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
