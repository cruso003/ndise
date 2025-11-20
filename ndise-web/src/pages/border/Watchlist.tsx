import { useState, useEffect } from 'react';
import {
  Shield, AlertTriangle, Search, Filter, Plus, Edit2, Trash2, Eye,
  Clock, MapPin, FileText, CheckCircle, XCircle, User, Calendar,
  TrendingUp, Activity, Target, Bell, Download, Upload
} from 'lucide-react';

interface WatchlistEntry {
  id: string;
  personId: string;
  name: string;
  nationality: string;
  dateOfBirth: string;
  photo?: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'inactive' | 'expired';
  reason: string;
  category: 'security_threat' | 'criminal' | 'fraud' | 'immigration_violation' | 'customs_violation' | 'other';
  addedBy: string;
  addedDate: string;
  expiryDate?: string;
  lastSeen?: {
    location: string;
    timestamp: string;
    checkpoint: string;
  };
  alerts: number;
  notes: string;
  associatedCases?: string[];
}

export default function WatchlistManagement() {
  const [entries, setEntries] = useState<WatchlistEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('active');
  const [selectedEntry, setSelectedEntry] = useState<WatchlistEntry | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Generate sample watchlist data
  useEffect(() => {
    const sampleEntries: WatchlistEntry[] = [
      {
        id: 'WL-001',
        personId: 'LBR-2024-18492',
        name: 'Ahmed Hassan Ibrahim',
        nationality: 'Syrian',
        dateOfBirth: '1985-03-15',
        riskLevel: 'critical',
        status: 'active',
        reason: 'Suspected involvement in cross-border smuggling network. Multiple intelligence reports indicate coordination with organized crime groups.',
        category: 'security_threat',
        addedBy: 'NSA Intelligence Division',
        addedDate: '2024-01-15',
        expiryDate: '2025-01-15',
        lastSeen: {
          location: 'Ganta Border Post',
          timestamp: '2024-11-18 14:32:00',
          checkpoint: 'Vehicle Inspection'
        },
        alerts: 12,
        notes: 'Exercise extreme caution. Subject has known associates in multiple countries. Detain on sight and notify NSA immediately.',
        associatedCases: ['CASE-2024-0421', 'CASE-2024-0398']
      },
      {
        id: 'WL-002',
        personId: 'LBR-2023-09234',
        name: 'Sarah Williams',
        nationality: 'Nigerian',
        dateOfBirth: '1992-07-22',
        riskLevel: 'high',
        status: 'active',
        reason: 'Document fraud - multiple forged passports seized. Known to operate identity theft ring.',
        category: 'fraud',
        addedBy: 'Border Control - RIA',
        addedDate: '2024-02-10',
        lastSeen: {
          location: 'Roberts International Airport',
          timestamp: '2024-11-19 08:15:00',
          checkpoint: 'Customs & Immigration'
        },
        alerts: 8,
        notes: 'Subject attempts frequent name variations. Check fingerprint match carefully.',
        associatedCases: ['CASE-2024-0512']
      },
      {
        id: 'WL-003',
        personId: 'LBR-2024-23451',
        name: 'Joseph Kamara',
        nationality: 'Liberian',
        dateOfBirth: '1978-11-03',
        riskLevel: 'high',
        status: 'active',
        reason: 'Outstanding arrest warrant for aggravated assault and armed robbery.',
        category: 'criminal',
        addedBy: 'Liberia National Police',
        addedDate: '2024-03-05',
        expiryDate: '2025-03-05',
        lastSeen: {
          location: 'Bo Waterside Border',
          timestamp: '2024-11-10 16:45:00',
          checkpoint: 'Main Crossing'
        },
        alerts: 5,
        notes: 'May be armed. Coordinate with LNP before approach.',
        associatedCases: ['CASE-2024-0289', 'CASE-2024-0301']
      },
      {
        id: 'WL-004',
        personId: 'LBR-2024-15678',
        name: 'Chen Wei',
        nationality: 'Chinese',
        dateOfBirth: '1988-05-12',
        riskLevel: 'medium',
        status: 'active',
        reason: 'Visa overstay (6 months). Employment without proper authorization.',
        category: 'immigration_violation',
        addedBy: 'Immigration Services',
        addedDate: '2024-04-20',
        expiryDate: '2024-12-31',
        alerts: 2,
        notes: 'Subject has cooperated in past. Consider administrative deportation.',
        associatedCases: ['CASE-2024-0678']
      },
      {
        id: 'WL-005',
        personId: 'LBR-2023-28901',
        name: 'Marie Koné',
        nationality: 'Ivorian',
        dateOfBirth: '1995-09-18',
        riskLevel: 'medium',
        status: 'active',
        reason: 'Customs violation - attempted smuggling of contraband goods valued at $45,000.',
        category: 'customs_violation',
        addedBy: 'Customs Authority',
        addedDate: '2024-05-11',
        alerts: 3,
        notes: 'Subject paid fine and served 30 days. Monitor for repeat offenses.',
        associatedCases: ['CASE-2024-0423']
      },
      {
        id: 'WL-006',
        personId: 'LBR-2024-34521',
        name: 'Emmanuel Togba',
        nationality: 'Liberian',
        dateOfBirth: '1990-02-28',
        riskLevel: 'low',
        status: 'active',
        reason: 'Person of interest - family member of known criminal. No direct involvement confirmed.',
        category: 'other',
        addedBy: 'Intelligence Division',
        addedDate: '2024-06-15',
        expiryDate: '2024-12-15',
        alerts: 1,
        notes: 'Monitoring only. No detainment unless new evidence emerges.',
        associatedCases: []
      },
      {
        id: 'WL-007',
        personId: 'LBR-2023-12456',
        name: 'David Johnson',
        nationality: 'American',
        dateOfBirth: '1982-12-05',
        riskLevel: 'critical',
        status: 'inactive',
        reason: 'RESOLVED: Suspected terrorist financing. Case closed after thorough investigation found insufficient evidence.',
        category: 'security_threat',
        addedBy: 'NSA Intelligence Division',
        addedDate: '2023-08-20',
        expiryDate: '2024-08-20',
        alerts: 0,
        notes: 'Watchlist entry deactivated. Subject cleared of all suspicion.',
        associatedCases: ['CASE-2023-0891']
      },
      {
        id: 'WL-008',
        personId: 'LBR-2024-09871',
        name: 'Fatima Sesay',
        nationality: 'Sierra Leonean',
        dateOfBirth: '1987-04-14',
        riskLevel: 'high',
        status: 'active',
        reason: 'Human trafficking suspect. Multiple testimonies place subject as coordinator.',
        category: 'criminal',
        addedBy: 'Anti-Trafficking Unit',
        addedDate: '2024-07-03',
        lastSeen: {
          location: 'Harper Border Checkpoint',
          timestamp: '2024-11-15 11:20:00',
          checkpoint: 'Pedestrian Entry'
        },
        alerts: 9,
        notes: 'High priority case. Detain immediately and notify Anti-Trafficking Unit.',
        associatedCases: ['CASE-2024-0734', 'CASE-2024-0756', 'CASE-2024-0789']
      }
    ];

    setEntries(sampleEntries);
  }, []);

  // Filter entries
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.personId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.nationality.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = selectedRisk === 'all' || entry.riskLevel === selectedRisk;
    const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || entry.status === selectedStatus;

    return matchesSearch && matchesRisk && matchesCategory && matchesStatus;
  });

  const stats = {
    total: entries.length,
    active: entries.filter(e => e.status === 'active').length,
    critical: entries.filter(e => e.riskLevel === 'critical' && e.status === 'active').length,
    high: entries.filter(e => e.riskLevel === 'high' && e.status === 'active').length,
    recentAlerts: entries.reduce((sum, e) => sum + (e.lastSeen && new Date(e.lastSeen.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) ? 1 : 0), 0),
    expiringSoon: entries.filter(e => e.expiryDate && new Date(e.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && e.status === 'active').length
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-600 text-white';
      case 'medium': return 'bg-yellow-600 text-white';
      case 'low': return 'bg-blue-600 text-white';
      default: return 'bg-slate-600 text-white';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'security_threat': return 'Security Threat';
      case 'criminal': return 'Criminal';
      case 'fraud': return 'Fraud';
      case 'immigration_violation': return 'Immigration';
      case 'customs_violation': return 'Customs';
      case 'other': return 'Other';
      default: return category;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Shield className="w-8 h-8 text-red-600" />
            Watchlist Management
          </h1>
          <p className="text-slate-600 mt-1">Monitor and manage security watchlist entries</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add to Watchlist
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-6 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Total Entries</div>
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            </div>
            <Target className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Active</div>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Critical Risk</div>
              <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">High Risk</div>
              <div className="text-2xl font-bold text-orange-600">{stats.high}</div>
            </div>
            <Shield className="w-8 h-8 text-orange-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Recent Alerts (7d)</div>
              <div className="text-2xl font-bold text-purple-600">{stats.recentAlerts}</div>
            </div>
            <Bell className="w-8 h-8 text-purple-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Expiring Soon</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.expiringSoon}</div>
            </div>
            <Clock className="w-8 h-8 text-yellow-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, ID, or nationality..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
          </select>

          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="all">All Risk Levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="all">All Categories</option>
            <option value="security_threat">Security Threat</option>
            <option value="criminal">Criminal</option>
            <option value="fraud">Fraud</option>
            <option value="immigration_violation">Immigration</option>
            <option value="customs_violation">Customs</option>
            <option value="other">Other</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
            <Filter className="w-4 h-4" />
            Advanced Filters
          </button>
        </div>
      </div>

      {/* Watchlist Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Person</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Risk Level</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Alerts</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Last Seen</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Added Date</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{entry.name}</div>
                        <div className="text-sm text-slate-500">{entry.personId}</div>
                        <div className="text-xs text-slate-400">{entry.nationality} • DOB: {entry.dateOfBirth}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${getRiskBadgeColor(entry.riskLevel)}`}>
                      {entry.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{getCategoryLabel(entry.category)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      entry.status === 'active' ? 'bg-green-100 text-green-800' :
                      entry.status === 'inactive' ? 'bg-slate-100 text-slate-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {entry.alerts > 0 ? (
                        <>
                          <Bell className="w-4 h-4 text-red-600" />
                          <span className="font-semibold text-red-600">{entry.alerts}</span>
                        </>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {entry.lastSeen ? (
                      <div className="text-sm">
                        <div className="font-medium text-slate-900">{entry.lastSeen.location}</div>
                        <div className="text-xs text-slate-500">{new Date(entry.lastSeen.timestamp).toLocaleString()}</div>
                      </div>
                    ) : (
                      <span className="text-slate-400">No sightings</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700">{new Date(entry.addedDate).toLocaleDateString()}</div>
                    {entry.expiryDate && (
                      <div className="text-xs text-slate-500">Expires: {new Date(entry.expiryDate).toLocaleDateString()}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedEntry(entry);
                          setShowDetailModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Remove">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredEntries.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No watchlist entries found matching your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Watchlist Entry Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Person Info */}
              <div className={`border-2 rounded-lg p-4 ${getRiskColor(selectedEntry.riskLevel)}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{selectedEntry.name}</h3>
                      <p className="text-sm text-slate-600 mt-1">{selectedEntry.personId}</p>
                      <p className="text-sm text-slate-600">{selectedEntry.nationality} • Born {selectedEntry.dateOfBirth}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-lg text-sm font-bold uppercase ${getRiskBadgeColor(selectedEntry.riskLevel)}`}>
                    {selectedEntry.riskLevel} RISK
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-600">Category</label>
                  <p className="text-slate-900 mt-1">{getCategoryLabel(selectedEntry.category)}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600">Status</label>
                  <p className="text-slate-900 mt-1 capitalize">{selectedEntry.status}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600">Added By</label>
                  <p className="text-slate-900 mt-1">{selectedEntry.addedBy}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600">Added Date</label>
                  <p className="text-slate-900 mt-1">{new Date(selectedEntry.addedDate).toLocaleDateString()}</p>
                </div>
                {selectedEntry.expiryDate && (
                  <div>
                    <label className="text-sm font-semibold text-slate-600">Expiry Date</label>
                    <p className="text-slate-900 mt-1">{new Date(selectedEntry.expiryDate).toLocaleDateString()}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-slate-600">Total Alerts</label>
                  <p className="text-slate-900 mt-1 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-red-600" />
                    {selectedEntry.alerts}
                  </p>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="text-sm font-semibold text-slate-600">Reason for Watchlisting</label>
                <p className="text-slate-900 mt-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  {selectedEntry.reason}
                </p>
              </div>

              {/* Last Seen */}
              {selectedEntry.lastSeen && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-yellow-700" />
                    <h4 className="font-bold text-yellow-900">Last Sighting</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-yellow-800"><strong>Location:</strong> {selectedEntry.lastSeen.location}</p>
                    <p className="text-yellow-800"><strong>Checkpoint:</strong> {selectedEntry.lastSeen.checkpoint}</p>
                    <p className="text-yellow-800"><strong>Timestamp:</strong> {new Date(selectedEntry.lastSeen.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="text-sm font-semibold text-slate-600">Operational Notes</label>
                <p className="text-slate-900 mt-2 bg-red-50 p-4 rounded-lg border border-red-200">
                  {selectedEntry.notes}
                </p>
              </div>

              {/* Associated Cases */}
              {selectedEntry.associatedCases && selectedEntry.associatedCases.length > 0 && (
                <div>
                  <label className="text-sm font-semibold text-slate-600">Associated Cases</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedEntry.associatedCases.map((caseId) => (
                      <span key={caseId} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                        {caseId}
                      </span>
                    ))}
                  </div>
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
                Edit Entry
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Remove from Watchlist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
