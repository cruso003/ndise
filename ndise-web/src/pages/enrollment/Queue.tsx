import { useState } from 'react';
import { 
  Clock, CheckCircle, XCircle, Eye, AlertTriangle, 
  Filter, Search, Brain, User
} from 'lucide-react';

interface QueueItem {
  id: string;
  nationalId: string;
  fullName: string;
  dateOfBirth: string;
  enrollmentDate: string;
  officer: string;
  status: 'pending' | 'reviewing' | 'flagged';
  aiScore: number;
  aiFlags: string[];
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

export default function Queue() {
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'reviewing' | 'flagged'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const queueItems: QueueItem[] = [
    {
      id: '1',
      nationalId: '1992051512345678',
      fullName: 'Mary Johnson Doe',
      dateOfBirth: '1992-05-15',
      enrollmentDate: '2 hours ago',
      officer: 'Thomas Kpan',
      status: 'pending',
      aiScore: 98,
      aiFlags: [],
      priority: 'normal'
    },
    {
      id: '2',
      nationalId: '1990010112345679',
      fullName: 'John Kwame Doe',
      dateOfBirth: '1990-01-01',
      enrollmentDate: '3 hours ago',
      officer: 'Sarah Williams',
      status: 'flagged',
      aiScore: 87,
      aiFlags: ['Potential duplicate detected', 'Name similarity to existing record'],
      priority: 'high'
    },
    {
      id: '3',
      nationalId: '1985030312345680',
      fullName: 'Grace Mensah Taylor',
      dateOfBirth: '1985-03-03',
      enrollmentDate: '5 hours ago',
      officer: 'Thomas Kpan',
      status: 'pending',
      aiScore: 95,
      aiFlags: [],
      priority: 'normal'
    },
    {
      id: '4',
      nationalId: '1998072212345681',
      fullName: 'Ibrahim Sesay',
      dateOfBirth: '1998-07-22',
      enrollmentDate: '1 day ago',
      officer: 'Sarah Williams',
      status: 'reviewing',
      aiScore: 72,
      aiFlags: ['Biometric quality below threshold'],
      priority: 'normal'
    },
    {
      id: '5',
      nationalId: '1975121512345682',
      fullName: 'Elizabeth Kollie Brown',
      dateOfBirth: '1975-12-15',
      enrollmentDate: '1 day ago',
      officer: 'Thomas Kpan',
      status: 'flagged',
      aiScore: 45,
      aiFlags: ['Document verification failed', 'Age mismatch detected'],
      priority: 'urgent'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'reviewing':
        return 'bg-yellow-100 text-yellow-800';
      case 'flagged':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-4 border-red-500';
      case 'high':
        return 'border-l-4 border-orange-500';
      case 'normal':
        return 'border-l-4 border-blue-500';
      case 'low':
        return 'border-l-4 border-gray-500';
      default:
        return '';
    }
  };

  const getAIScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const filteredQueue = queueItems
    .filter(item => selectedStatus === 'all' || item.status === selectedStatus)
    .filter(item => 
      item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nationalId.includes(searchQuery)
    );

  const stats = {
    pending: queueItems.filter(i => i.status === 'pending').length,
    reviewing: queueItems.filter(i => i.status === 'reviewing').length,
    flagged: queueItems.filter(i => i.status === 'flagged').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Enrollment Queue</h1>
        <p className="text-slate-600 mt-1">Review and approve pending enrollments with AI assistance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Pending Review</div>
              <div className="text-3xl font-bold text-blue-600">{stats.pending}</div>
            </div>
            <Clock className="w-8 h-8 text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">In Review</div>
              <div className="text-3xl font-bold text-yellow-600">{stats.reviewing}</div>
            </div>
            <Eye className="w-8 h-8 text-yellow-600 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">AI Flagged</div>
              <div className="text-3xl font-bold text-red-600">{stats.flagged}</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Avg AI Score</div>
              <div className="text-3xl font-bold text-green-600">
                {Math.round(queueItems.reduce((sum, i) => sum + i.aiScore, 0) / queueItems.length)}
              </div>
            </div>
            <Brain className="w-8 h-8 text-green-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All ({queueItems.length})
            </button>
            <button
              onClick={() => setSelectedStatus('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === 'pending'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setSelectedStatus('reviewing')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === 'reviewing'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Reviewing ({stats.reviewing})
            </button>
            <button
              onClick={() => setSelectedStatus('flagged')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === 'flagged'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Flagged ({stats.flagged})
            </button>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or ID..."
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

      {/* Queue List */}
      <div className="space-y-3">
        {filteredQueue.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow ${getPriorityColor(item.priority)}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-slate-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{item.fullName}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status.toUpperCase()}
                    </span>
                    {item.priority === 'urgent' && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                        URGENT
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">National ID:</span>
                      <div className="font-medium text-slate-900">{item.nationalId}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Date of Birth:</span>
                      <div className="font-medium text-slate-900">{item.dateOfBirth}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Enrolled:</span>
                      <div className="font-medium text-slate-900">{item.enrollmentDate}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Officer:</span>
                      <div className="font-medium text-slate-900">{item.officer}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`px-4 py-3 rounded-lg text-center min-w-[100px] ${getAIScoreColor(item.aiScore)}`}>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Brain className="w-4 h-4" />
                  <span className="text-xs font-semibold">AI Score</span>
                </div>
                <div className="text-2xl font-bold">{item.aiScore}</div>
                <div className="text-xs">/ 100</div>
              </div>
            </div>

            {/* AI Flags */}
            {item.aiFlags.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-red-900 text-sm mb-1">🤖 AI Flags:</div>
                    <ul className="text-sm text-red-800 space-y-1">
                      {item.aiFlags.map((flag, idx) => (
                        <li key={idx}>• {flag}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
                <Eye className="w-4 h-4" />
                Review Details
              </button>
              <button className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium">
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>
              <button className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 font-medium">
                <XCircle className="w-4 h-4" />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredQueue.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500 opacity-50" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Queue is Empty!</h3>
          <p className="text-slate-600">No pending enrollments matching your filters.</p>
        </div>
      )}
    </div>
  );
}
