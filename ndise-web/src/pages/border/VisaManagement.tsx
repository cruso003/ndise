import { useState, useEffect } from 'react';
import {
  FileText, Search, Filter, Plus, CheckCircle, XCircle, Clock, AlertTriangle,
  Calendar, User, Download, Upload, Eye, Edit2, RefreshCw, Ban
} from 'lucide-react';

interface VisaApplication {
  id: string;
  applicantName: string;
  applicantId: string;
  nationality: string;
  dateOfBirth: string;
  passportNumber: string;
  visaType: 'tourist' | 'business' | 'student' | 'work' | 'diplomatic' | 'transit' | 'family';
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'expired' | 'revoked';
  applicationDate: string;
  reviewDate?: string;
  issueDate?: string;
  expiryDate?: string;
  duration: number; // days
  purpose: string;
  entryType: 'single' | 'multiple';
  reviewedBy?: string;
  rejectionReason?: string;
  notes?: string;
  supportingDocs: number;
  sponsor?: string;
  accommodation?: string;
  passportExpiry: string;
}

export default function VisaManagement() {
  const [applications, setApplications] = useState<VisaApplication[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('pending');
  const [selectedApplication, setSelectedApplication] = useState<VisaApplication | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'extend' | 'revoke' | null>(null);

  // Generate sample visa applications
  useEffect(() => {
    const sampleApplications: VisaApplication[] = [
      {
        id: 'VISA-2024-0891',
        applicantName: 'Jennifer Martinez',
        applicantId: 'LBR-2024-45671',
        nationality: 'American',
        dateOfBirth: '1988-06-15',
        passportNumber: 'US-4567891',
        visaType: 'business',
        status: 'pending',
        applicationDate: '2024-11-15',
        duration: 90,
        purpose: 'Attending mining industry conference and meeting with local partners. Exploring investment opportunities in renewable energy sector.',
        entryType: 'multiple',
        supportingDocs: 8,
        sponsor: 'Liberian Chamber of Commerce',
        accommodation: 'Mamba Point Hotel, Monrovia',
        passportExpiry: '2028-03-20'
      },
      {
        id: 'VISA-2024-0892',
        applicantName: 'Mohammed Al-Rashid',
        applicantId: 'LBR-2024-45672',
        nationality: 'Saudi Arabian',
        dateOfBirth: '1995-02-22',
        passportNumber: 'SA-8912345',
        visaType: 'student',
        status: 'under_review',
        applicationDate: '2024-11-10',
        duration: 1095, // 3 years
        purpose: 'Enrolled in Masters program in Public Health at University of Liberia. Program duration: 3 years.',
        entryType: 'multiple',
        supportingDocs: 12,
        sponsor: 'University of Liberia - Scholarship Program',
        accommodation: 'University Campus Housing',
        passportExpiry: '2029-01-15'
      },
      {
        id: 'VISA-2024-0893',
        applicantName: 'Chen Wei',
        applicantId: 'LBR-2024-45673',
        nationality: 'Chinese',
        dateOfBirth: '1990-09-30',
        passportNumber: 'CN-2345678',
        visaType: 'work',
        status: 'approved',
        applicationDate: '2024-10-20',
        reviewDate: '2024-10-25',
        issueDate: '2024-10-28',
        expiryDate: '2025-10-28',
        duration: 365,
        purpose: 'Software engineer position at TechCorp Liberia. Employment contract for 1 year with potential extension.',
        entryType: 'multiple',
        reviewedBy: 'Immigration Officer Sarah Johnson',
        supportingDocs: 10,
        sponsor: 'TechCorp Liberia Ltd.',
        accommodation: 'Company-provided housing in Sinkor',
        passportExpiry: '2027-05-10',
        notes: 'Employment verified. Work permit issued concurrently.'
      },
      {
        id: 'VISA-2024-0894',
        applicantName: 'Emma Thompson',
        applicantId: 'LBR-2024-45674',
        nationality: 'British',
        dateOfBirth: '1975-11-08',
        passportNumber: 'GB-9876543',
        visaType: 'diplomatic',
        status: 'approved',
        applicationDate: '2024-11-01',
        reviewDate: '2024-11-02',
        issueDate: '2024-11-03',
        expiryDate: '2027-11-03',
        duration: 1095, // 3 years
        purpose: 'British Embassy Cultural Attaché assignment. Diplomatic mission duration: 3 years.',
        entryType: 'multiple',
        reviewedBy: 'Ministry of Foreign Affairs',
        supportingDocs: 6,
        sponsor: 'UK Foreign Office',
        accommodation: 'Embassy residential compound',
        passportExpiry: '2026-08-20',
        notes: 'Diplomatic immunity granted. Fast-tracked approval.'
      },
      {
        id: 'VISA-2024-0895',
        applicantName: 'Jean-Pierre Dubois',
        applicantId: 'LBR-2024-45675',
        nationality: 'French',
        dateOfBirth: '1992-03-17',
        passportNumber: 'FR-5678901',
        visaType: 'tourist',
        status: 'rejected',
        applicationDate: '2024-11-12',
        reviewDate: '2024-11-14',
        duration: 30,
        purpose: 'Tourism and cultural exploration.',
        entryType: 'single',
        reviewedBy: 'Immigration Officer David Williams',
        supportingDocs: 3,
        accommodation: 'Not specified',
        passportExpiry: '2025-01-10',
        rejectionReason: 'Insufficient documentation provided. Passport expires within 6 months of intended stay. No proof of return ticket or sufficient funds. Please reapply with complete documentation.',
        notes: 'Applicant advised to reapply with required documents.'
      },
      {
        id: 'VISA-2024-0896',
        applicantName: 'Amara Kamara',
        applicantId: 'LBR-2024-45676',
        nationality: 'Sierra Leonean',
        dateOfBirth: '1985-07-25',
        passportNumber: 'SL-3456789',
        visaType: 'family',
        status: 'approved',
        applicationDate: '2024-10-15',
        reviewDate: '2024-10-20',
        issueDate: '2024-10-22',
        expiryDate: '2025-04-22',
        duration: 180,
        purpose: 'Visiting spouse (Liberian citizen) and children. Family reunion.',
        entryType: 'multiple',
        reviewedBy: 'Immigration Officer Mary Johnson',
        supportingDocs: 9,
        sponsor: 'Spouse: Emmanuel Kofi (Liberian Citizen)',
        accommodation: 'Family residence in Paynesville',
        passportExpiry: '2028-04-15',
        notes: 'Marriage certificate verified. Spouse is Liberian citizen.'
      },
      {
        id: 'VISA-2024-0897',
        applicantName: 'Ahmed Hassan',
        applicantId: 'LBR-2024-45677',
        nationality: 'Egyptian',
        dateOfBirth: '1998-12-10',
        passportNumber: 'EG-7891234',
        visaType: 'transit',
        status: 'approved',
        applicationDate: '2024-11-18',
        reviewDate: '2024-11-18',
        issueDate: '2024-11-19',
        expiryDate: '2024-11-26',
        duration: 7,
        purpose: 'Transit to Ghana via Roberts International Airport. Layover: 18 hours.',
        entryType: 'single',
        reviewedBy: 'Immigration Officer James Brown',
        supportingDocs: 4,
        accommodation: 'Airport transit hotel',
        passportExpiry: '2027-09-30',
        notes: 'Onward ticket to Ghana verified. Fast-track processing.'
      },
      {
        id: 'VISA-2024-0898',
        applicantName: 'Sophia Anderson',
        applicantId: 'LBR-2024-45678',
        nationality: 'Canadian',
        dateOfBirth: '1987-04-20',
        passportNumber: 'CA-1234567',
        visaType: 'work',
        status: 'expired',
        applicationDate: '2023-11-01',
        reviewDate: '2023-11-05',
        issueDate: '2023-11-10',
        expiryDate: '2024-11-10',
        duration: 365,
        purpose: 'NGO worker - health program coordinator.',
        entryType: 'multiple',
        reviewedBy: 'Immigration Officer Michael Davis',
        supportingDocs: 11,
        sponsor: 'Health for All NGO',
        accommodation: 'NGO staff housing',
        passportExpiry: '2026-12-15',
        notes: 'Visa expired. Applicant can renew if continuing employment.'
      },
      {
        id: 'VISA-2024-0899',
        applicantName: 'David Kim',
        applicantId: 'LBR-2024-45679',
        nationality: 'South Korean',
        dateOfBirth: '1983-08-14',
        passportNumber: 'KR-8901234',
        visaType: 'business',
        status: 'revoked',
        applicationDate: '2024-05-10',
        reviewDate: '2024-05-12',
        issueDate: '2024-05-15',
        expiryDate: '2024-11-15',
        duration: 180,
        purpose: 'Business consulting services.',
        entryType: 'multiple',
        reviewedBy: 'Immigration Officer Sarah Miller',
        supportingDocs: 7,
        sponsor: 'Korea Business Association',
        accommodation: 'Business hotel',
        passportExpiry: '2027-03-20',
        notes: 'Visa revoked due to visa terms violation. Overstayed permitted duration. Deportation order issued.'
      },
      {
        id: 'VISA-2024-0900',
        applicantName: 'Fatima Al-Mahmoud',
        applicantId: 'LBR-2024-45680',
        nationality: 'Lebanese',
        dateOfBirth: '1991-01-30',
        passportNumber: 'LB-4567890',
        visaType: 'business',
        status: 'pending',
        applicationDate: '2024-11-19',
        duration: 60,
        purpose: 'Negotiating trade agreements for import/export business. Meeting with Ministry of Commerce.',
        entryType: 'single',
        supportingDocs: 5,
        sponsor: 'Al-Mahmoud Trading Company',
        accommodation: 'Royal Grand Hotel',
        passportExpiry: '2028-06-10'
      }
    ];

    setApplications(sampleApplications);
  }, []);

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.passportNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.nationality.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || app.visaType === selectedType;
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    underReview: applications.filter(a => a.status === 'under_review').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    expiringSoon: applications.filter(a => a.expiryDate && new Date(a.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && a.status === 'approved').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'under_review': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'revoked': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'under_review': return <FileText className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'expired': return <Calendar className="w-4 h-4" />;
      case 'revoked': return <Ban className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getVisaTypeLabel = (type: string) => {
    switch (type) {
      case 'tourist': return 'Tourist';
      case 'business': return 'Business';
      case 'student': return 'Student';
      case 'work': return 'Work';
      case 'diplomatic': return 'Diplomatic';
      case 'transit': return 'Transit';
      case 'family': return 'Family';
      default: return type;
    }
  };

  const handleAction = (app: VisaApplication, type: 'approve' | 'reject' | 'extend' | 'revoke') => {
    setSelectedApplication(app);
    setActionType(type);
    setShowActionModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            Visa Management
          </h1>
          <p className="text-slate-600 mt-1">Issue, extend, and revoke visas</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
            <Upload className="w-4 h-4" />
            Bulk Import
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            New Application
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-6 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Total Applications</div>
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            </div>
            <FileText className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Pending</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </div>
            <Clock className="w-8 h-8 text-yellow-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Under Review</div>
              <div className="text-2xl font-bold text-blue-600">{stats.underReview}</div>
            </div>
            <FileText className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Approved</div>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Rejected</div>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            </div>
            <XCircle className="w-8 h-8 text-red-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Expiring Soon</div>
              <div className="text-2xl font-bold text-orange-600">{stats.expiringSoon}</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500 opacity-20" />
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
                placeholder="Search by name, ID, passport, or nationality..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
            <option value="revoked">Revoked</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Visa Types</option>
            <option value="tourist">Tourist</option>
            <option value="business">Business</option>
            <option value="student">Student</option>
            <option value="work">Work</option>
            <option value="diplomatic">Diplomatic</option>
            <option value="transit">Transit</option>
            <option value="family">Family</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
            <Filter className="w-4 h-4" />
            Advanced Filters
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Visa Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Application Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Expiry</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{app.applicantName}</div>
                        <div className="text-sm text-slate-500">{app.id}</div>
                        <div className="text-xs text-slate-400">{app.nationality} • {app.passportNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{getVisaTypeLabel(app.visaType)}</span>
                    <div className="text-xs text-slate-500">{app.entryType === 'single' ? 'Single Entry' : 'Multiple Entry'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)}
                      {app.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700">{new Date(app.applicationDate).toLocaleDateString()}</div>
                    {app.reviewDate && (
                      <div className="text-xs text-slate-500">Reviewed: {new Date(app.reviewDate).toLocaleDateString()}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700">{app.duration} days</div>
                    <div className="text-xs text-slate-500">{Math.floor(app.duration / 365) > 0 ? `${Math.floor(app.duration / 365)} year(s)` : `${Math.floor(app.duration / 30)} month(s)`}</div>
                  </td>
                  <td className="px-6 py-4">
                    {app.expiryDate ? (
                      <div className={`text-sm ${new Date(app.expiryDate) < new Date() ? 'text-red-600 font-semibold' : new Date(app.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'text-orange-600 font-semibold' : 'text-slate-700'}`}>
                        {new Date(app.expiryDate).toLocaleDateString()}
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedApplication(app);
                          setShowDetailModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {app.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAction(app, 'approve')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAction(app, 'reject')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {app.status === 'approved' && app.expiryDate && new Date(app.expiryDate) < new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) && (
                        <button
                          onClick={() => handleAction(app, 'extend')}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Extend Visa"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                      {app.status === 'approved' && (
                        <button
                          onClick={() => handleAction(app, 'revoke')}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Revoke"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No visa applications found matching your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Visa Application Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Application Header */}
              <div className={`border-2 rounded-lg p-4 ${getStatusColor(selectedApplication.status)}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{selectedApplication.applicantName}</h3>
                      <p className="text-sm text-slate-600 mt-1">{selectedApplication.id}</p>
                      <p className="text-sm text-slate-600">{selectedApplication.nationality} • Passport: {selectedApplication.passportNumber}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold uppercase ${getStatusColor(selectedApplication.status)}`}>
                    {getStatusIcon(selectedApplication.status)}
                    {selectedApplication.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Visa Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-600">Visa Type</label>
                  <p className="text-slate-900 mt-1">{getVisaTypeLabel(selectedApplication.visaType)}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600">Entry Type</label>
                  <p className="text-slate-900 mt-1">{selectedApplication.entryType === 'single' ? 'Single Entry' : 'Multiple Entry'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600">Application Date</label>
                  <p className="text-slate-900 mt-1">{new Date(selectedApplication.applicationDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600">Duration</label>
                  <p className="text-slate-900 mt-1">{selectedApplication.duration} days ({Math.floor(selectedApplication.duration / 30)} months)</p>
                </div>
                {selectedApplication.reviewDate && (
                  <>
                    <div>
                      <label className="text-sm font-semibold text-slate-600">Review Date</label>
                      <p className="text-slate-900 mt-1">{new Date(selectedApplication.reviewDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-600">Reviewed By</label>
                      <p className="text-slate-900 mt-1">{selectedApplication.reviewedBy || '—'}</p>
                    </div>
                  </>
                )}
                {selectedApplication.issueDate && (
                  <div>
                    <label className="text-sm font-semibold text-slate-600">Issue Date</label>
                    <p className="text-slate-900 mt-1">{new Date(selectedApplication.issueDate).toLocaleDateString()}</p>
                  </div>
                )}
                {selectedApplication.expiryDate && (
                  <div>
                    <label className="text-sm font-semibold text-slate-600">Expiry Date</label>
                    <p className={`mt-1 font-semibold ${new Date(selectedApplication.expiryDate) < new Date() ? 'text-red-600' : new Date(selectedApplication.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'text-orange-600' : 'text-slate-900'}`}>
                      {new Date(selectedApplication.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-slate-600">Date of Birth</label>
                  <p className="text-slate-900 mt-1">{new Date(selectedApplication.dateOfBirth).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600">Passport Expiry</label>
                  <p className="text-slate-900 mt-1">{new Date(selectedApplication.passportExpiry).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600">Supporting Documents</label>
                  <p className="text-slate-900 mt-1">{selectedApplication.supportingDocs} files</p>
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label className="text-sm font-semibold text-slate-600">Purpose of Visit</label>
                <p className="text-slate-900 mt-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  {selectedApplication.purpose}
                </p>
              </div>

              {/* Sponsor & Accommodation */}
              <div className="grid grid-cols-2 gap-4">
                {selectedApplication.sponsor && (
                  <div>
                    <label className="text-sm font-semibold text-slate-600">Sponsor</label>
                    <p className="text-slate-900 mt-1 bg-blue-50 p-3 rounded-lg border border-blue-200">
                      {selectedApplication.sponsor}
                    </p>
                  </div>
                )}
                {selectedApplication.accommodation && (
                  <div>
                    <label className="text-sm font-semibold text-slate-600">Accommodation</label>
                    <p className="text-slate-900 mt-1 bg-blue-50 p-3 rounded-lg border border-blue-200">
                      {selectedApplication.accommodation}
                    </p>
                  </div>
                )}
              </div>

              {/* Rejection Reason */}
              {selectedApplication.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <label className="text-sm font-semibold text-red-900 flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Rejection Reason
                  </label>
                  <p className="text-red-800 mt-2">{selectedApplication.rejectionReason}</p>
                </div>
              )}

              {/* Notes */}
              {selectedApplication.notes && (
                <div>
                  <label className="text-sm font-semibold text-slate-600">Notes</label>
                  <p className="text-slate-900 mt-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
                    {selectedApplication.notes}
                  </p>
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
              {selectedApplication.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleAction(selectedApplication, 'approve');
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve Visa
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleAction(selectedApplication, 'reject');
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject Application
                  </button>
                </>
              )}
              {selectedApplication.status === 'approved' && (
                <>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleAction(selectedApplication, 'extend');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Extend Visa
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleAction(selectedApplication, 'revoke');
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Revoke Visa
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Modal Placeholder */}
      {showActionModal && selectedApplication && actionType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {actionType === 'approve' && 'Approve Visa Application'}
              {actionType === 'reject' && 'Reject Visa Application'}
              {actionType === 'extend' && 'Extend Visa'}
              {actionType === 'revoke' && 'Revoke Visa'}
            </h3>
            <p className="text-slate-600 mb-4">
              Are you sure you want to {actionType} this visa for {selectedApplication.applicantName}?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowActionModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle action here
                  setShowActionModal(false);
                }}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                  actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                  actionType === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                  actionType === 'extend' ? 'bg-blue-600 hover:bg-blue-700' :
                  'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
