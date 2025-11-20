import { useState } from 'react';
import { Clock, AlertTriangle, Search, Filter, User, MapPin, Phone, Globe } from 'lucide-react';

interface OverstayCase {
  id: string;
  foreignId: string;
  fullName: string;
  nationality: string;
  passportNumber: string;
  visaType: string;
  entryDate: string;
  expiryDate: string;
  daysOverstayed: number;
  lastKnownLocation: string;
  phoneNumber: string;
  riskScore: number;
  status: 'active' | 'contacted' | 'departed' | 'detained';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export default function Overstay() {
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const overstays: OverstayCase[] = [
    {
      id: '1',
      foreignId: 'FID-2024-NGR-123',
      fullName: 'Ahmed Ibrahim Hassan',
      nationality: 'Nigerian',
      passportNumber: 'A12345678',
      visaType: 'Tourist (90 days)',
      entryDate: '2024-06-15',
      expiryDate: '2024-09-13',
      daysOverstayed: 68,
      lastKnownLocation: 'Monrovia - Sinkor',
      phoneNumber: '+231770123456',
      riskScore: 78,
      status: 'active',
      priority: 'high'
    },
    {
      id: '2',
      foreignId: 'FID-2024-SLE-456',
      fullName: 'Ibrahim Sesay',
      nationality: 'Sierra Leonean',
      passportNumber: 'SL987654',
      visaType: 'ECOWAS (90 days)',
      entryDate: '2024-08-01',
      expiryDate: '2024-10-30',
      daysOverstayed: 21,
      lastKnownLocation: 'Paynesville',
      phoneNumber: '+231886234567',
      riskScore: 45,
      status: 'contacted',
      priority: 'medium'
    },
    {
      id: '3',
      foreignId: 'FID-2023-SDN-789',
      fullName: 'Ahmed Hassan',
      nationality: 'Sudanese',
      passportNumber: 'SD456789',
      visaType: 'Business (60 days)',
      entryDate: '2023-12-01',
      expiryDate: '2024-01-30',
      daysOverstayed: 295,
      lastKnownLocation: 'Roberts Airport (last seen)',
      phoneNumber: 'Unknown',
      riskScore: 92,
      status: 'active',
      priority: 'critical'
    },
    {
      id: '4',
      foreignId: 'FID-2024-GHA-321',
      fullName: 'Kwame Mensah',
      nationality: 'Ghanaian',
      passportNumber: 'GH123456',
      visaType: 'ECOWAS (90 days)',
      entryDate: '2024-09-20',
      expiryDate: '2024-12-19',
      daysOverstayed: -29,
      lastKnownLocation: 'Monrovia Central',
      phoneNumber: '+231770987654',
      riskScore: 15,
      status: 'active',
      priority: 'low'
    },
    {
      id: '5',
      foreignId: 'FID-2024-MLI-654',
      fullName: 'Fatima Traore',
      nationality: 'Malian',
      passportNumber: 'ML789012',
      visaType: 'Tourist (60 days)',
      entryDate: '2024-10-10',
      expiryDate: '2024-12-09',
      daysOverstayed: 11,
      lastKnownLocation: 'Monrovia - Duport Road',
      phoneNumber: '+231886543210',
      riskScore: 38,
      status: 'contacted',
      priority: 'medium'
    }
  ];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'departed':
        return 'bg-green-100 text-green-800';
      case 'detained':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const filteredOverstays = overstays
    .filter(item => selectedPriority === 'all' || item.priority === selectedPriority)
    .filter(item =>
      item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.passportNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.foreignId.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const stats = {
    total: overstays.length,
    critical: overstays.filter(o => o.priority === 'critical').length,
    high: overstays.filter(o => o.priority === 'high').length,
    avgDays: Math.round(overstays.reduce((sum, o) => sum + (o.daysOverstayed > 0 ? o.daysOverstayed: 0), 0) / overstays.filter(o => o.daysOverstayed > 0).length),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Overstay Tracking</h1>
        <p className="text-slate-600 mt-1">Monitor visa expiry and overstay cases</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Total Overstays</div>
              <div className="text-3xl font-bold text-red-600">{stats.total}</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Critical Cases</div>
              <div className="text-3xl font-bold text-red-600">{stats.critical}</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">High Priority</div>
              <div className="text-3xl font-bold text-orange-600">{stats.high}</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Avg Days Over</div>
              <div className="text-3xl font-bold text-slate-900">{stats.avgDays}</div>
            </div>
            <Clock className="w-8 h-8 text-slate-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedPriority('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedPriority === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedPriority('critical')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedPriority === 'critical'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Critical
            </button>
            <button
              onClick={() => setSelectedPriority('high')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedPriority === 'high'
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              High
            </button>
            <button
              onClick={() => setSelectedPriority('medium')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedPriority === 'medium'
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
                placeholder="Search..."
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

      {/* Overstay List */}
      <div className="space-y-3">
        {filteredOverstays.map((overstay) => (
          <div
            key={overstay.id}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-slate-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{overstay.fullName}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(overstay.priority)}`}>
                      {overstay.priority.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(overstay.status)}`}>
                      {overstay.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <div className="flex items-center gap-1 text-slate-500">
                        <Globe className="w-3 h-3" />
                        <span>Nationality:</span>
                      </div>
                      <div className="font-medium text-slate-900">{overstay.nationality}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Passport:</span>
                      <div className="font-medium text-slate-900">{overstay.passportNumber}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Visa Type:</span>
                      <div className="font-medium text-slate-900">{overstay.visaType}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Foreign ID:</span>
                      <div className="font-medium text-slate-900">{overstay.foreignId}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Entry Date:</span>
                      <div className="font-medium text-slate-900">{overstay.entryDate}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Expiry Date:</span>
                      <div className="font-medium text-red-600">{overstay.expiryDate}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3 h-3" />
                        <span>Last Location:</span>
                      </div>
                      <div className="font-medium text-slate-900">{overstay.lastKnownLocation}</div>
                    </div>
                  </div>

                  {overstay.phoneNumber !== 'Unknown' && (
                    <div className="mt-2 text-sm">
                      <div className="flex items-center gap-1 text-slate-500">
                        <Phone className="w-3 h-3" />
                        <span>Phone:</span>
                      </div>
                      <div className="font-medium text-slate-900">{overstay.phoneNumber}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="ml-4">
                <div className={`px-4 py-3 rounded-lg text-center min-w-[120px] ${getRiskColor(overstay.riskScore)}`}>
                  <div className="text-xs font-semibold mb-1">🤖 AI Risk</div>
                  <div className="text-2xl font-bold">{overstay.riskScore}</div>
                </div>
                <div className="mt-3 text-center">
                  <div className="text-xs text-slate-500">Days Overstayed</div>
                  <div className={`text-3xl font-bold ${overstay.daysOverstayed > 60 ? 'text-red-600' : overstay.daysOverstayed > 30 ? 'text-orange-600' : 'text-yellow-600'}`}>
                    {overstay.daysOverstayed > 0 ? overstay.daysOverstayed : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Critical Alert */}
            {overstay.priority === 'critical' && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                  <div className="flex-1 text-sm text-red-900">
                    <strong>CRITICAL:</strong> Overstayed {overstay.daysOverstayed} days. High risk score ({overstay.riskScore}/100). Immediate action required.
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
                View Full Profile
              </button>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium">
                Track Location
              </button>
              <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 font-medium">
                Contact
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium">
                Issue Alert
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
