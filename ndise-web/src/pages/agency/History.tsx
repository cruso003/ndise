import { useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertTriangle, Download, Search } from 'lucide-react';

export default function History() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failed' | 'high-risk'>('all');
  // const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  // Sample verification history
  const verificationHistory = [
    {
      id: 'VER-2024-88395',
      timestamp: '2024-11-21T14:23:45Z',
      nationalId: '1988121298765432',
      fullName: 'Grace Nyemah',
      status: 'success',
      riskLevel: 'medium',
      alerts: 2,
      verifiedBy: 'Janet Williams',
      department: 'KYC Department',
    },
    {
      id: 'VER-2024-88394',
      timestamp: '2024-11-21T14:18:12Z',
      nationalId: '1992030398765432',
      fullName: 'Marcus Gaye',
      status: 'success',
      riskLevel: 'high',
      alerts: 2,
      verifiedBy: 'Janet Williams',
      department: 'KYC Department',
    },
    {
      id: 'VER-2024-88393',
      timestamp: '2024-11-21T13:45:22Z',
      nationalId: '1985050567891234',
      fullName: 'Sarah Blessing Kollie',
      status: 'success',
      riskLevel: 'low',
      alerts: 0,
      verifiedBy: 'Janet Williams',
      department: 'KYC Department',
    },
    {
      id: 'VER-2024-88392',
      timestamp: '2024-11-21T12:34:18Z',
      nationalId: '1990010112345678',
      fullName: 'John Kwame Doe',
      status: 'success',
      riskLevel: 'low',
      alerts: 0,
      verifiedBy: 'Janet Williams',
      department: 'KYC Department',
    },
    {
      id: 'VER-2024-88391',
      timestamp: '2024-11-21T11:23:56Z',
      nationalId: '1987030334567890',
      fullName: null,
      status: 'failed',
      riskLevel: null,
      alerts: 0,
      verifiedBy: 'Michael Brown',
      department: 'Customer Service',
    },
    {
      id: 'VER-2024-88390',
      timestamp: '2024-11-21T10:15:33Z',
      nationalId: '1995060645678901',
      fullName: 'Thomas Zubah',
      status: 'success',
      riskLevel: 'low',
      alerts: 0,
      verifiedBy: 'Michael Brown',
      department: 'Customer Service',
    },
    {
      id: 'VER-2024-88389',
      timestamp: '2024-11-21T09:42:11Z',
      nationalId: '1990070756789012',
      fullName: 'Rebecca Wleh',
      status: 'success',
      riskLevel: 'medium',
      alerts: 1,
      verifiedBy: 'Janet Williams',
      department: 'KYC Department',
    },
    {
      id: 'VER-2024-88388',
      timestamp: '2024-11-21T08:33:27Z',
      nationalId: '1983010867890123',
      fullName: 'Joseph Boakai',
      status: 'success',
      riskLevel: 'low',
      alerts: 0,
      verifiedBy: 'Michael Brown',
      department: 'Customer Service',
    },
  ];

  const filteredHistory = verificationHistory.filter((record) => {
    const matchesSearch =
      searchTerm === '' ||
      record.nationalId.includes(searchTerm) ||
      record.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'success' && record.status === 'success') ||
      (filterStatus === 'failed' && record.status === 'failed') ||
      (filterStatus === 'high-risk' && record.riskLevel === 'high');

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: verificationHistory.length,
    success: verificationHistory.filter((r) => r.status === 'success').length,
    failed: verificationHistory.filter((r) => r.status === 'failed').length,
    highRisk: verificationHistory.filter((r) => r.riskLevel === 'high').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Verification History</h1>
        <p className="text-slate-600 mt-1">Audit trail of all identity verifications performed</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="text-slate-500 text-sm font-medium mb-1">Total Verifications</div>
          <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
          <div className="text-xs text-slate-400 mt-1">Today</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="text-slate-500 text-sm font-medium mb-1">Successful</div>
          <div className="text-3xl font-bold text-green-600">{stats.success}</div>
          <div className="text-xs text-green-600 mt-1">
            {((stats.success / stats.total) * 100).toFixed(1)}% success rate
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="text-slate-500 text-sm font-medium mb-1">Failed</div>
          <div className="text-3xl font-bold text-red-600">{stats.failed}</div>
          <div className="text-xs text-red-600 mt-1">
            {((stats.failed / stats.total) * 100).toFixed(1)}% failure rate
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="text-slate-500 text-sm font-medium mb-1">High Risk</div>
          <div className="text-3xl font-bold text-orange-600">{stats.highRisk}</div>
          <div className="text-xs text-orange-600 mt-1">Flagged individuals</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by National ID, Name, or Verification ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium text-sm ${
                filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('success')}
              className={`px-4 py-2 rounded-lg font-medium text-sm ${
                filterStatus === 'success' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Success
            </button>
            <button
              onClick={() => setFilterStatus('failed')}
              className={`px-4 py-2 rounded-lg font-medium text-sm ${
                filterStatus === 'failed' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Failed
            </button>
            <button
              onClick={() => setFilterStatus('high-risk')}
              className={`px-4 py-2 rounded-lg font-medium text-sm ${
                filterStatus === 'high-risk' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              High Risk
            </button>
          </div>

          {/* Export */}
          <button className="px-4 py-2 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Verification ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  National ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Verified By
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredHistory.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {new Date(record.timestamp).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-600">
                    {record.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-900">
                    {record.nationalId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                    {record.fullName || <span className="text-slate-400 italic">Not Found</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.status === 'success' ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded flex items-center gap-1 w-fit">
                        <CheckCircle className="w-3 h-3" />
                        Success
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded flex items-center gap-1 w-fit">
                        <XCircle className="w-3 h-3" />
                        Failed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.riskLevel === 'high' && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded flex items-center gap-1 w-fit">
                        <AlertTriangle className="w-3 h-3" />
                        HIGH RISK
                      </span>
                    )}
                    {record.riskLevel === 'medium' && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded flex items-center gap-1 w-fit">
                        <AlertTriangle className="w-3 h-3" />
                        MEDIUM
                      </span>
                    )}
                    {record.riskLevel === 'low' && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded flex items-center gap-1 w-fit">
                        <CheckCircle className="w-3 h-3" />
                        LOW
                      </span>
                    )}
                    {!record.riskLevel && <span className="text-slate-400 text-xs">-</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    <div>
                      <div className="font-medium text-slate-900">{record.verifiedBy}</div>
                      <div className="text-xs text-slate-500">{record.department}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No verification records found</p>
            <p className="text-slate-400 text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
