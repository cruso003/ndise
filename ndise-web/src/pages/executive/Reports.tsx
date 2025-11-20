import { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Clock,
  Filter,
  Plus,
  Eye,
  FileSpreadsheet,
  FileDown,
  CheckCircle,
  AlertCircle,
  Loader,
  Settings,
  TrendingUp,
  Shield,
  Users,
  Globe,
} from 'lucide-react';

interface Report {
  id: string;
  title: string;
  type: 'system_activity' | 'enrollment' | 'border_security' | 'security_alerts' | 'compliance' | 'audit' | 'custom';
  status: 'completed' | 'generating' | 'scheduled' | 'failed';
  generatedDate: string;
  period: string;
  format: 'PDF' | 'Excel' | 'CSV';
  size: string;
  description: string;
  schedule?: string;
}

export default function Reports() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Sample Reports
  const reports: Report[] = [
    {
      id: 'RPT-2024-001',
      title: 'Monthly System Activity Report',
      type: 'system_activity',
      status: 'completed',
      generatedDate: '2024-01-15 14:30',
      period: 'January 2024',
      format: 'PDF',
      size: '2.4 MB',
      description: 'Comprehensive system activity and usage statistics for January 2024',
    },
    {
      id: 'RPT-2024-002',
      title: 'Q4 2023 Enrollment Summary',
      type: 'enrollment',
      status: 'completed',
      generatedDate: '2024-01-10 09:15',
      period: 'Q4 2023',
      format: 'Excel',
      size: '5.8 MB',
      description: 'Detailed enrollment statistics and demographic breakdown for Q4 2023',
    },
    {
      id: 'RPT-2024-003',
      title: 'Border Security Weekly Briefing',
      type: 'border_security',
      status: 'completed',
      generatedDate: '2024-01-14 18:00',
      period: 'Week of Jan 8-14, 2024',
      format: 'PDF',
      size: '1.2 MB',
      description: 'Weekly border crossing statistics and security incidents',
      schedule: 'Weekly (Sundays at 18:00)',
    },
    {
      id: 'RPT-2024-004',
      title: 'Security Alerts & Incidents',
      type: 'security_alerts',
      status: 'completed',
      generatedDate: '2024-01-15 08:00',
      period: 'January 1-15, 2024',
      format: 'PDF',
      size: '892 KB',
      description: 'Security alerts, watchlist matches, and incident reports',
      schedule: 'Bi-weekly',
    },
    {
      id: 'RPT-2024-005',
      title: 'Annual Compliance Audit 2023',
      type: 'compliance',
      status: 'completed',
      generatedDate: '2024-01-05 16:45',
      period: 'FY 2023',
      format: 'PDF',
      size: '12.3 MB',
      description: 'Complete compliance audit including data protection, security standards, and operational procedures',
    },
    {
      id: 'RPT-2024-006',
      title: 'Monthly Data Quality Audit',
      type: 'audit',
      status: 'generating',
      generatedDate: '2024-01-15 15:20',
      period: 'January 2024',
      format: 'Excel',
      size: '-',
      description: 'Data integrity checks, duplicate records, and quality metrics',
    },
    {
      id: 'RPT-2024-007',
      title: 'Biometric Verification Analysis',
      type: 'custom',
      status: 'scheduled',
      generatedDate: '2024-01-16 06:00',
      period: 'January 2024',
      format: 'PDF',
      size: '-',
      description: 'Custom analysis of biometric verification success rates and failure reasons',
      schedule: 'Monthly (16th at 06:00)',
    },
    {
      id: 'RPT-2024-008',
      title: 'ID Card Production Report',
      type: 'custom',
      status: 'completed',
      generatedDate: '2024-01-12 11:30',
      period: 'January 1-12, 2024',
      format: 'CSV',
      size: '456 KB',
      description: 'ID card production statistics including pending, printed, and issued cards',
    },
    {
      id: 'RPT-2024-009',
      title: 'Database Backup Verification',
      type: 'audit',
      status: 'failed',
      generatedDate: '2024-01-15 02:00',
      period: 'January 15, 2024',
      format: 'PDF',
      size: '-',
      description: 'Automated backup verification report - generation failed due to network timeout',
    },
  ];

  const reportTypes = [
    { value: 'all', label: 'All Types', icon: FileText },
    { value: 'system_activity', label: 'System Activity', icon: TrendingUp },
    { value: 'enrollment', label: 'Enrollment', icon: Users },
    { value: 'border_security', label: 'Border Security', icon: Globe },
    { value: 'security_alerts', label: 'Security Alerts', icon: Shield },
    { value: 'compliance', label: 'Compliance', icon: CheckCircle },
    { value: 'audit', label: 'Audit', icon: Settings },
    { value: 'custom', label: 'Custom', icon: FileSpreadsheet },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'generating', label: 'Generating' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'failed', label: 'Failed' },
  ];

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'generating':
        return 'bg-blue-100 text-blue-700';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
    }
  };

  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'generating':
        return <Loader className="w-4 h-4 animate-spin" />;
      case 'scheduled':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Report['type']) => {
    switch (type) {
      case 'system_activity':
        return 'bg-blue-100 text-blue-600';
      case 'enrollment':
        return 'bg-green-100 text-green-600';
      case 'border_security':
        return 'bg-purple-100 text-purple-600';
      case 'security_alerts':
        return 'bg-red-100 text-red-600';
      case 'compliance':
        return 'bg-yellow-100 text-yellow-600';
      case 'audit':
        return 'bg-orange-100 text-orange-600';
      case 'custom':
        return 'bg-slate-100 text-slate-600';
    }
  };

  const getTypeIcon = (type: Report['type']) => {
    const Icon = reportTypes.find(t => t.value === type)?.icon || FileText;
    return <Icon className="w-5 h-5" />;
  };

  const filteredReports = reports.filter(report => {
    if (selectedType !== 'all' && report.type !== selectedType) return false;
    if (selectedStatus !== 'all' && report.status !== selectedStatus) return false;
    return true;
  });

  const stats = {
    total: reports.length,
    completed: reports.filter(r => r.status === 'completed').length,
    scheduled: reports.filter(r => r.status === 'scheduled').length,
    generating: reports.filter(r => r.status === 'generating').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Executive Reports</h1>
          <p className="text-slate-600 mt-1">Strategic reports and system audits</p>
        </div>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Reports</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Completed</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.completed}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Scheduled</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.scheduled}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Generating</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.generating}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Loader className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Filters:</span>
          </div>

          {/* Type Filter */}
          <div className="flex gap-1">
            {reportTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    selectedType === type.value
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {type.label}
                </button>
              );
            })}
          </div>

          <div className="h-6 w-px bg-slate-200" />

          {/* Status Filter */}
          <div className="flex gap-1">
            {statusOptions.map((status) => (
              <button
                key={status.value}
                onClick={() => setSelectedStatus(status.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  selectedStatus === status.value
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="font-bold text-slate-900">
            Available Reports ({filteredReports.length})
          </h2>
        </div>
        <div className="divide-y divide-slate-200">
          {filteredReports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 rounded-lg ${getTypeColor(report.type)}`}>
                    {getTypeIcon(report.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-slate-900">{report.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{report.description}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {report.period}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {report.generatedDate}
                      </div>
                      {report.status === 'completed' && (
                        <>
                          <div className="flex items-center gap-1">
                            <FileDown className="w-4 h-4" />
                            {report.format}
                          </div>
                          <div>{report.size}</div>
                        </>
                      )}
                      {report.schedule && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <Clock className="w-4 h-4" />
                          {report.schedule}
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      Report ID: {report.id}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {report.status === 'completed' && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setShowPreviewModal(true);
                        }}
                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                      <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </>
                  )}
                  {report.status === 'failed' && (
                    <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                      Retry
                    </button>
                  )}
                  {report.status === 'scheduled' && (
                    <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <Settings className="w-4 h-4" />
                      Configure
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Generate New Report</h2>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Report Type
                  </label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900">
                    <option>System Activity Report</option>
                    <option>Enrollment Summary</option>
                    <option>Border Security Briefing</option>
                    <option>Security Alerts & Incidents</option>
                    <option>Compliance Audit</option>
                    <option>Data Quality Audit</option>
                    <option>Custom Report</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Output Format
                  </label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="format" value="pdf" defaultChecked />
                      <span className="text-sm text-slate-700">PDF</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="format" value="excel" />
                      <span className="text-sm text-slate-700">Excel</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="format" value="csv" />
                      <span className="text-sm text-slate-700">CSV</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" />
                    <span className="text-sm text-slate-700">Schedule this report to run automatically</span>
                  </label>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Large reports may take several minutes to generate. You will be
                    notified when the report is ready for download.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedReport.title}</h2>
                <p className="text-sm text-slate-600 mt-1">Preview - {selectedReport.period}</p>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">{selectedReport.title}</h1>
                  <p className="text-slate-600">{selectedReport.period}</p>
                  <p className="text-sm text-slate-500 mt-1">Generated: {selectedReport.generatedDate}</p>
                </div>
                <div className="prose max-w-none">
                  <p className="text-slate-700 mb-4">{selectedReport.description}</p>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <FileText className="w-16 h-16 text-blue-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">Full report preview available in downloaded document</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                Download Full Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
