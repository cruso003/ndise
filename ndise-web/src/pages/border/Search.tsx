import { useState } from 'react';
import {
  Search, User, Shield, AlertTriangle, CheckCircle, XCircle, Clock,
  FileText, MapPin, Calendar, Phone, Mail, Fingerprint, Camera, Globe,
  TrendingUp, History, Eye, Download, Flag, Award, Ban
} from 'lucide-react';

interface SearchResult {
  id: string;
  name: string;
  nationality: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  passportNumber?: string;
  nationalID?: string;
  email?: string;
  phone?: string;
  address?: string;
  photo?: string;
  biometric: {
    fingerprint: boolean;
    facialRecognition: boolean;
    lastVerified?: string;
  };
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'clear' | 'flagged' | 'watchlist' | 'blacklisted';
  travelHistory: {
    id: string;
    date: string;
    location: string;
    type: 'entry' | 'exit';
    checkpoint: string;
  }[];
  visaStatus?: {
    type: string;
    status: string;
    expiryDate?: string;
  };
  alerts: {
    id: string;
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    date: string;
  }[];
  notes?: string;
}

export default function BorderSearch() {
  const [searchType, setSearchType] = useState<'passport' | 'national_id' | 'name' | 'biometric'>('passport');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Advanced search filters
  const [filters, setFilters] = useState({
    nationality: '',
    minAge: '',
    maxAge: '',
    riskLevel: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: ''
  });

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    // Simulate search delay
    setTimeout(() => {
      // Generate sample results based on search
      const sampleResults: SearchResult[] = [
        {
          id: 'LBR-2024-18492',
          name: 'Ahmed Hassan Ibrahim',
          nationality: 'Syrian',
          dateOfBirth: '1985-03-15',
          gender: 'male',
          passportNumber: 'SYR-4523891',
          nationalID: 'SYR-NAT-8492341',
          email: 'ahmed.hassan@email.com',
          phone: '+963-11-234-5678',
          address: 'Damascus, Syria',
          biometric: {
            fingerprint: true,
            facialRecognition: true,
            lastVerified: '2024-11-18'
          },
          riskScore: 87,
          riskLevel: 'critical',
          status: 'watchlist',
          travelHistory: [
            { id: '1', date: '2024-11-18', location: 'Ganta Border Post', type: 'entry', checkpoint: 'Vehicle Inspection' },
            { id: '2', date: '2024-09-12', location: 'Bo Waterside Border', type: 'exit', checkpoint: 'Main Gate' },
            { id: '3', date: '2024-08-05', location: 'Roberts Intl Airport', type: 'entry', checkpoint: 'Terminal 1' }
          ],
          visaStatus: {
            type: 'Business',
            status: 'Active',
            expiryDate: '2025-02-15'
          },
          alerts: [
            { id: 'A1', type: 'Security', message: 'Suspected involvement in smuggling network', severity: 'critical', date: '2024-11-18' },
            { id: 'A2', type: 'Intelligence', message: 'Multiple border crossings in short period', severity: 'high', date: '2024-11-10' }
          ],
          notes: 'Exercise extreme caution. Detain on sight and notify NSA immediately.'
        },
        {
          id: 'LBR-2023-09234',
          name: 'Sarah Williams',
          nationality: 'Nigerian',
          dateOfBirth: '1992-07-22',
          gender: 'female',
          passportNumber: 'NIG-9876543',
          nationalID: 'NIG-NAT-4567890',
          email: 'sarah.w@email.com',
          phone: '+234-1-234-5678',
          address: 'Lagos, Nigeria',
          biometric: {
            fingerprint: true,
            facialRecognition: true,
            lastVerified: '2024-11-19'
          },
          riskScore: 65,
          riskLevel: 'high',
          status: 'flagged',
          travelHistory: [
            { id: '1', date: '2024-11-19', location: 'Roberts Intl Airport', type: 'entry', checkpoint: 'Customs & Immigration' },
            { id: '2', date: '2024-10-28', location: 'Roberts Intl Airport', type: 'exit', checkpoint: 'Departure Gate' },
            { id: '3', date: '2024-09-15', location: 'Roberts Intl Airport', type: 'entry', checkpoint: 'Terminal 1' }
          ],
          visaStatus: {
            type: 'Tourist',
            status: 'Active',
            expiryDate: '2024-12-19'
          },
          alerts: [
            { id: 'A1', type: 'Fraud', message: 'Document fraud - forged passport detected', severity: 'high', date: '2024-11-19' }
          ],
          notes: 'Subject attempts name variations. Verify fingerprints carefully.'
        },
        {
          id: 'LBR-2024-45673',
          name: 'Emmanuel Togba',
          nationality: 'Liberian',
          dateOfBirth: '1990-02-28',
          gender: 'male',
          passportNumber: 'LBR-1234567',
          nationalID: 'LBR-NAT-9012345',
          email: 'e.togba@email.lr',
          phone: '+231-77-123-4567',
          address: 'Paynesville, Monrovia',
          biometric: {
            fingerprint: true,
            facialRecognition: true,
            lastVerified: '2024-11-15'
          },
          riskScore: 25,
          riskLevel: 'low',
          status: 'clear',
          travelHistory: [
            { id: '1', date: '2024-11-15', location: 'Bo Waterside Border', type: 'entry', checkpoint: 'Main Crossing' },
            { id: '2', date: '2024-10-20', location: 'Bo Waterside Border', type: 'exit', checkpoint: 'Main Crossing' },
            { id: '3', date: '2024-09-08', location: 'Roberts Intl Airport', type: 'entry', checkpoint: 'Terminal 1' }
          ],
          alerts: [],
          notes: 'Regular traveler. No issues detected.'
        }
      ];

      setSearchResults(sampleResults);
      setIsSearching(false);
    }, 1000);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-600 text-white';
      case 'medium': return 'bg-yellow-600 text-white';
      case 'low': return 'bg-green-600 text-white';
      default: return 'bg-slate-600 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clear': return 'bg-green-100 text-green-800 border-green-300';
      case 'flagged': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'watchlist': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'blacklisted': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'clear': return <CheckCircle className="w-4 h-4" />;
      case 'flagged': return <Flag className="w-4 h-4" />;
      case 'watchlist': return <Eye className="w-4 h-4" />;
      case 'blacklisted': return <Ban className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Search className="w-8 h-8 text-blue-600" />
            Search & Verify
          </h1>
          <p className="text-slate-600 mt-1">Lookup travelers and verify identity</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
            <Download className="w-4 h-4" />
            Export Results
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Camera className="w-4 h-4" />
            Biometric Scan
          </button>
        </div>
      </div>

      {/* Search Interface */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="space-y-4">
          {/* Search Type Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
            <button
              onClick={() => setSearchType('passport')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                searchType === 'passport'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Passport
            </button>
            <button
              onClick={() => setSearchType('national_id')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                searchType === 'national_id'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Award className="w-4 h-4 inline mr-2" />
              National ID
            </button>
            <button
              onClick={() => setSearchType('name')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                searchType === 'name'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Name
            </button>
            <button
              onClick={() => setSearchType('biometric')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                searchType === 'biometric'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Fingerprint className="w-4 h-4 inline mr-2" />
              Biometric
            </button>
          </div>

          {/* Search Input */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder={
                  searchType === 'passport' ? 'Enter passport number...' :
                  searchType === 'national_id' ? 'Enter national ID...' :
                  searchType === 'name' ? 'Enter full name...' :
                  'Scan fingerprint or face...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5 animate-spin" />
                  Searching...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search
                </span>
              )}
            </button>
          </div>

          {/* Advanced Filters (collapsible) */}
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Advanced Filters
            </summary>
            <div className="mt-4 grid grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nationality</label>
                <select
                  value={filters.nationality}
                  onChange={(e) => setFilters({ ...filters, nationality: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="">All</option>
                  <option value="liberian">Liberian</option>
                  <option value="nigerian">Nigerian</option>
                  <option value="syrian">Syrian</option>
                  <option value="american">American</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Risk Level</label>
                <select
                  value={filters.riskLevel}
                  onChange={(e) => setFilters({ ...filters, riskLevel: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="all">All Levels</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="clear">Clear</option>
                  <option value="flagged">Flagged</option>
                  <option value="watchlist">Watchlist</option>
                  <option value="blacklisted">Blacklisted</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date Range</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </details>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Search Results ({searchResults.length})</h2>
          </div>

          <div className="divide-y divide-slate-200">
            {searchResults.map((person) => (
              <div
                key={person.id}
                className="p-6 hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedPerson(person);
                  setShowDetailModal(true);
                }}
              >
                <div className="flex items-start gap-6">
                  {/* Photo */}
                  <div className="w-24 h-24 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-12 h-12 text-slate-600" />
                  </div>

                  {/* Main Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{person.name}</h3>
                        <p className="text-sm text-slate-600 mt-1">{person.id}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Globe className="w-4 h-4" />
                            {person.nationality}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            DOB: {person.dateOfBirth}
                          </span>
                          {person.passportNumber && (
                            <span className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {person.passportNumber}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${getRiskColor(person.riskLevel)}`}>
                          {person.riskLevel} RISK ({person.riskScore}%)
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(person.status)}`}>
                          {getStatusIcon(person.status)}
                          {person.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Biometric Status */}
                    <div className="flex items-center gap-4 mb-3">
                      {person.biometric.fingerprint && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-medium">
                          <Fingerprint className="w-3 h-3" />
                          Fingerprint Verified
                        </span>
                      )}
                      {person.biometric.facialRecognition && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-medium">
                          <Camera className="w-3 h-3" />
                          Face Verified
                        </span>
                      )}
                      {person.biometric.lastVerified && (
                        <span className="text-xs text-slate-500">
                          Last verified: {person.biometric.lastVerified}
                        </span>
                      )}
                    </div>

                    {/* Alerts */}
                    {person.alerts.length > 0 && (
                      <div className="space-y-2">
                        {person.alerts.map((alert) => (
                          <div
                            key={alert.id}
                            className={`flex items-start gap-2 p-3 rounded-lg border ${
                              alert.severity === 'critical' ? 'bg-red-50 border-red-300' :
                              alert.severity === 'high' ? 'bg-orange-50 border-orange-300' :
                              'bg-yellow-50 border-yellow-300'
                            }`}
                          >
                            <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                              alert.severity === 'critical' ? 'text-red-600' :
                              alert.severity === 'high' ? 'text-orange-600' :
                              'text-yellow-600'
                            }`} />
                            <div className="flex-1">
                              <div className="font-semibold text-sm text-slate-900">{alert.type} Alert</div>
                              <div className="text-sm text-slate-700">{alert.message}</div>
                            </div>
                            <span className="text-xs text-slate-500">{alert.date}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPerson(person);
                          setShowDetailModal(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        View Full Profile
                      </button>
                      <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                        <History className="w-4 h-4 inline mr-1" />
                        Travel History
                      </button>
                      {person.status === 'watchlist' || person.status === 'flagged' ? (
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                          <Shield className="w-4 h-4 inline mr-1" />
                          Detain
                        </button>
                      ) : (
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                          <CheckCircle className="w-4 h-4 inline mr-1" />
                          Clear Entry
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {searchResults.length === 0 && searchQuery && !isSearching && (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Results Found</h3>
          <p className="text-slate-600">
            No records match your search criteria. Try a different search term or use advanced filters.
          </p>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedPerson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-slate-900">Identity Verification</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Person Header */}
              <div className={`border-2 rounded-lg p-4 ${getStatusColor(selectedPerson.status)}`}>
                <div className="flex items-start gap-4">
                  <div className="w-32 h-32 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-16 h-16 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{selectedPerson.name}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="font-semibold">ID:</span> {selectedPerson.id}</div>
                      <div><span className="font-semibold">Nationality:</span> {selectedPerson.nationality}</div>
                      <div><span className="font-semibold">DOB:</span> {selectedPerson.dateOfBirth}</div>
                      <div><span className="font-semibold">Gender:</span> {selectedPerson.gender}</div>
                      {selectedPerson.passportNumber && (
                        <div><span className="font-semibold">Passport:</span> {selectedPerson.passportNumber}</div>
                      )}
                      {selectedPerson.nationalID && (
                        <div><span className="font-semibold">National ID:</span> {selectedPerson.nationalID}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className={`px-4 py-2 rounded-lg text-sm font-bold uppercase text-center ${getRiskColor(selectedPerson.riskLevel)}`}>
                      {selectedPerson.riskLevel} RISK<br/>{selectedPerson.riskScore}%
                    </span>
                    <span className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${getStatusColor(selectedPerson.status)}`}>
                      {getStatusIcon(selectedPerson.status)}
                      {selectedPerson.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact & Biometric */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <h4 className="font-bold text-slate-900 mb-3">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    {selectedPerson.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-600" />
                        <span>{selectedPerson.email}</span>
                      </div>
                    )}
                    {selectedPerson.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-600" />
                        <span>{selectedPerson.phone}</span>
                      </div>
                    )}
                    {selectedPerson.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-600" />
                        <span>{selectedPerson.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-bold text-slate-900 mb-3">Biometric Verification</h4>
                  <div className="space-y-2">
                    <div className={`flex items-center justify-between ${selectedPerson.biometric.fingerprint ? 'text-green-700' : 'text-slate-400'}`}>
                      <span className="flex items-center gap-2 text-sm">
                        <Fingerprint className="w-4 h-4" />
                        Fingerprint
                      </span>
                      {selectedPerson.biometric.fingerprint ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </div>
                    <div className={`flex items-center justify-between ${selectedPerson.biometric.facialRecognition ? 'text-green-700' : 'text-slate-400'}`}>
                      <span className="flex items-center gap-2 text-sm">
                        <Camera className="w-4 h-4" />
                        Facial Recognition
                      </span>
                      {selectedPerson.biometric.facialRecognition ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </div>
                    {selectedPerson.biometric.lastVerified && (
                      <div className="text-xs text-slate-600 mt-2 pt-2 border-t border-green-300">
                        Last verified: {selectedPerson.biometric.lastVerified}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Visa Status */}
              {selectedPerson.visaStatus && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-bold text-slate-900 mb-3">Visa Status</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Type:</span> {selectedPerson.visaStatus.type}
                    </div>
                    <div>
                      <span className="font-semibold">Status:</span> {selectedPerson.visaStatus.status}
                    </div>
                    {selectedPerson.visaStatus.expiryDate && (
                      <div>
                        <span className="font-semibold">Expires:</span> {selectedPerson.visaStatus.expiryDate}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Travel History */}
              <div>
                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Travel History
                </h4>
                <div className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-100 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold">Date</th>
                        <th className="px-4 py-2 text-left font-semibold">Location</th>
                        <th className="px-4 py-2 text-left font-semibold">Type</th>
                        <th className="px-4 py-2 text-left font-semibold">Checkpoint</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {selectedPerson.travelHistory.map((travel) => (
                        <tr key={travel.id}>
                          <td className="px-4 py-2">{travel.date}</td>
                          <td className="px-4 py-2">{travel.location}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              travel.type === 'entry' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {travel.type.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-2">{travel.checkpoint}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Notes */}
              {selectedPerson.notes && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Security Notes
                  </h4>
                  <p className="text-red-800 text-sm">{selectedPerson.notes}</p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Print Report
              </button>
              {selectedPerson.status === 'watchlist' || selectedPerson.status === 'flagged' ? (
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Detain & Notify NSA
                </button>
              ) : (
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Approve Entry
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
