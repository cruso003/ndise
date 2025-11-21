import { useState } from 'react';
import {
  Printer,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Filter,
  AlertTriangle,
} from 'lucide-react';

interface PrintJob {
  id: string;
  enrollmentId: string;
  name: string;
  idNumber: string;
  status: 'pending' | 'printing' | 'completed' | 'failed' | 'paused';
  priority: 'normal' | 'high' | 'urgent';
  printer: string;
  queuePosition: number;
  submittedAt: string;
  completedAt?: string;
  retries: number;
  error?: string;
}

interface Printer {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'busy' | 'error' | 'maintenance';
  model: string;
  cardsRemaining: number;
  cardsCapacity: number;
  ribbonLevel: number;
  currentJob?: string;
  totalPrinted: number;
  errorCount: number;
}

export default function IDCardPrinting() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedPrinter, setSelectedPrinter] = useState<string>('all');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<PrintJob | null>(null);

  // Sample Print Jobs
  const printJobs: PrintJob[] = [
    {
      id: 'PJ-2024-001',
      enrollmentId: 'ENR-2024-15234',
      name: 'Mamie Flomo',
      idNumber: 'LBR-20241234567',
      status: 'printing',
      priority: 'urgent',
      printer: 'Printer-01',
      queuePosition: 0,
      submittedAt: '2024-01-15 14:25',
      retries: 0,
    },
    {
      id: 'PJ-2024-002',
      enrollmentId: 'ENR-2024-15235',
      name: 'Joseph Kollie',
      idNumber: 'LBR-20241234568',
      status: 'pending',
      priority: 'high',
      printer: 'Printer-01',
      queuePosition: 1,
      submittedAt: '2024-01-15 14:28',
      retries: 0,
    },
    {
      id: 'PJ-2024-003',
      enrollmentId: 'ENR-2024-15236',
      name: 'Grace Kpannah',
      idNumber: 'LBR-20241234569',
      status: 'pending',
      priority: 'normal',
      printer: 'Printer-01',
      queuePosition: 2,
      submittedAt: '2024-01-15 14:30',
      retries: 0,
    },
    {
      id: 'PJ-2024-004',
      enrollmentId: 'ENR-2024-15237',
      name: 'Emmanuel Dahn',
      idNumber: 'LBR-20241234570',
      status: 'completed',
      priority: 'normal',
      printer: 'Printer-01',
      queuePosition: -1,
      submittedAt: '2024-01-15 13:45',
      completedAt: '2024-01-15 13:47',
      retries: 0,
    },
    {
      id: 'PJ-2024-005',
      enrollmentId: 'ENR-2024-15238',
      name: 'Sarah Togba',
      idNumber: 'LBR-20241234571',
      status: 'completed',
      priority: 'normal',
      printer: 'Printer-02',
      queuePosition: -1,
      submittedAt: '2024-01-15 13:50',
      completedAt: '2024-01-15 13:52',
      retries: 0,
    },
    {
      id: 'PJ-2024-006',
      enrollmentId: 'ENR-2024-15239',
      name: 'Marcus Gaye',
      idNumber: 'LBR-20241234572',
      status: 'failed',
      priority: 'high',
      printer: 'Printer-02',
      queuePosition: -1,
      submittedAt: '2024-01-15 14:10',
      retries: 2,
      error: 'Card stock jam detected',
    },
    {
      id: 'PJ-2024-007',
      enrollmentId: 'ENR-2024-15240',
      name: 'Victoria Doe',
      idNumber: 'LBR-20241234573',
      status: 'pending',
      priority: 'normal',
      printer: 'Printer-02',
      queuePosition: 0,
      submittedAt: '2024-01-15 14:32',
      retries: 0,
    },
    {
      id: 'PJ-2024-008',
      enrollmentId: 'ENR-2024-15241',
      name: 'Patrick Junius',
      idNumber: 'LBR-20241234574',
      status: 'paused',
      priority: 'normal',
      printer: 'Printer-03',
      queuePosition: 0,
      submittedAt: '2024-01-15 14:15',
      retries: 0,
    },
  ];

  // Sample Printers
  const printers: Printer[] = [
    {
      id: 'Printer-01',
      name: 'ID Card Printer 01',
      location: 'Enrollment Center - Monrovia',
      status: 'busy',
      model: 'Datacard SD360',
      cardsRemaining: 245,
      cardsCapacity: 500,
      ribbonLevel: 68,
      currentJob: 'PJ-2024-001',
      totalPrinted: 12456,
      errorCount: 23,
    },
    {
      id: 'Printer-02',
      name: 'ID Card Printer 02',
      location: 'Enrollment Center - Gbarnga',
      status: 'error',
      model: 'Datacard SD360',
      cardsRemaining: 89,
      cardsCapacity: 500,
      ribbonLevel: 25,
      totalPrinted: 8934,
      errorCount: 45,
    },
    {
      id: 'Printer-03',
      name: 'ID Card Printer 03',
      location: 'Enrollment Center - Buchanan',
      status: 'online',
      model: 'Evolis Primacy',
      cardsRemaining: 412,
      cardsCapacity: 500,
      ribbonLevel: 82,
      totalPrinted: 5678,
      errorCount: 12,
    },
    {
      id: 'Printer-04',
      name: 'ID Card Printer 04',
      location: 'Enrollment Center - Voinjama',
      status: 'maintenance',
      model: 'Evolis Primacy',
      cardsRemaining: 0,
      cardsCapacity: 500,
      ribbonLevel: 0,
      totalPrinted: 3245,
      errorCount: 8,
    },
  ];

  const getStatusColor = (status: PrintJob['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'printing':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      case 'paused':
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status: PrintJob['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'printing':
        return <Printer className="w-4 h-4 animate-pulse" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      case 'paused':
        return <Pause className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: PrintJob['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'normal':
        return 'text-slate-600';
    }
  };

  const getPrinterStatusColor = (status: Printer['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-700';
      case 'busy':
        return 'bg-blue-100 text-blue-700';
      case 'offline':
        return 'bg-slate-100 text-slate-700';
      case 'error':
        return 'bg-red-100 text-red-700';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const filteredJobs = printJobs.filter(job => {
    if (selectedStatus !== 'all' && job.status !== selectedStatus) return false;
    if (selectedPriority !== 'all' && job.priority !== selectedPriority) return false;
    if (selectedPrinter !== 'all' && job.printer !== selectedPrinter) return false;
    return true;
  });

  const stats = {
    total: printJobs.length,
    pending: printJobs.filter(j => j.status === 'pending').length,
    printing: printJobs.filter(j => j.status === 'printing').length,
    completed: printJobs.filter(j => j.status === 'completed').length,
    failed: printJobs.filter(j => j.status === 'failed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">ID Card Printing</h1>
        <p className="text-slate-600 mt-1">Print queue management and card stock tracking</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Jobs</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Pending</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.pending}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Printing</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.printing}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Printer className="w-6 h-6 text-blue-600" />
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
              <p className="text-sm font-medium text-slate-600">Failed</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.failed}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Printers Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {printers.map((printer) => (
          <div
            key={printer.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-slate-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">{printer.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{printer.location}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPrinterStatusColor(printer.status)}`}>
                {printer.status.charAt(0).toUpperCase() + printer.status.slice(1)}
              </span>
            </div>

            <div className="space-y-3">
              {/* Card Stock */}
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-600">Card Stock</span>
                  <span className="text-slate-900 font-medium">
                    {printer.cardsRemaining}/{printer.cardsCapacity}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      printer.cardsRemaining / printer.cardsCapacity > 0.5
                        ? 'bg-green-500'
                        : printer.cardsRemaining / printer.cardsCapacity > 0.2
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${(printer.cardsRemaining / printer.cardsCapacity) * 100}%` }}
                  />
                </div>
              </div>

              {/* Ribbon Level */}
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-600">Ribbon Level</span>
                  <span className="text-slate-900 font-medium">{printer.ribbonLevel}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      printer.ribbonLevel > 50
                        ? 'bg-green-500'
                        : printer.ribbonLevel > 20
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${printer.ribbonLevel}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-500">Total Printed</p>
                  <p className="text-sm font-bold text-slate-900">{printer.totalPrinted.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Errors</p>
                  <p className="text-sm font-bold text-slate-900">{printer.errorCount}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Filters:</span>
          </div>

          {/* Status Filter */}
          <div className="flex gap-1">
            {[
              { value: 'all', label: 'All Status' },
              { value: 'pending', label: 'Pending' },
              { value: 'printing', label: 'Printing' },
              { value: 'completed', label: 'Completed' },
              { value: 'failed', label: 'Failed' },
              { value: 'paused', label: 'Paused' },
            ].map((status) => (
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

          <div className="h-6 w-px bg-slate-200" />

          {/* Priority Filter */}
          <div className="flex gap-1">
            {[
              { value: 'all', label: 'All Priority' },
              { value: 'urgent', label: 'Urgent' },
              { value: 'high', label: 'High' },
              { value: 'normal', label: 'Normal' },
            ].map((priority) => (
              <button
                key={priority.value}
                onClick={() => setSelectedPriority(priority.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  selectedPriority === priority.value
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {priority.label}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-200" />

          {/* Printer Filter */}
          <select
            value={selectedPrinter}
            onChange={(e) => setSelectedPrinter(e.target.value)}
            className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg"
          >
            <option value="all">All Printers</option>
            {printers.map((printer) => (
              <option key={printer.id} value={printer.id}>
                {printer.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Print Queue */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="font-bold text-slate-900">Print Queue ({filteredJobs.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Job ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Name / ID Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Printer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Queue Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{job.id}</div>
                    <div className="text-xs text-slate-500">{job.enrollmentId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">{job.name}</div>
                    <div className="text-xs text-slate-500">{job.idNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(job.status)}`}>
                      {getStatusIcon(job.status)}
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                    {job.error && (
                      <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {job.error}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getPriorityColor(job.priority)}`}>
                      {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {job.printer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {job.queuePosition >= 0 ? `#${job.queuePosition + 1}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{job.submittedAt}</div>
                    {job.completedAt && (
                      <div className="text-xs text-slate-500">Done: {job.completedAt}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedJob(job);
                          setShowPreviewModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {job.status === 'failed' && (
                        <button className="text-orange-600 hover:text-orange-800 font-medium" title="Retry">
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                      {job.status === 'pending' && (
                        <button className="text-green-600 hover:text-green-800 font-medium" title="Start">
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">ID Card Preview</h2>
                <p className="text-sm text-slate-600 mt-1">Job: {selectedJob.id}</p>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              {/* ID Card Preview */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 text-white shadow-xl aspect-[1.6/1] flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold mb-1">REPUBLIC OF LIBERIA</div>
                  <div className="text-xs">National Digital Identity System</div>
                </div>
                <div className="flex items-end justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-bold mb-1">{selectedJob.name}</div>
                    <div className="text-xs opacity-90">ID: {selectedJob.idNumber}</div>
                    <div className="text-xs opacity-75 mt-2">Issued: Jan 15, 2024</div>
                  </div>
                  <div className="w-20 h-24 bg-white/20 rounded flex items-center justify-center text-xs">
                    Photo
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Enrollment ID:</span>
                  <span className="text-sm font-medium text-slate-900">{selectedJob.enrollmentId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Printer:</span>
                  <span className="text-sm font-medium text-slate-900">{selectedJob.printer}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Priority:</span>
                  <span className={`text-sm font-medium ${getPriorityColor(selectedJob.priority)}`}>
                    {selectedJob.priority.charAt(0).toUpperCase() + selectedJob.priority.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(selectedJob.status)}`}>
                    {getStatusIcon(selectedJob.status)}
                    {selectedJob.status.charAt(0).toUpperCase() + selectedJob.status.slice(1)}
                  </span>
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
              {selectedJob.status === 'failed' && (
                <button className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Retry Print
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
