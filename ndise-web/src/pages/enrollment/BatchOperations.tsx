import { useState } from 'react';
import {
  Upload,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
  Users,
  Play,
  Pause,
  RotateCcw,
  Eye,
  FileText,
  Filter,
} from 'lucide-react';

interface BatchOperation {
  id: string;
  type: 'import' | 'approval' | 'verification' | 'export' | 'status_update';
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'paused';
  totalRecords: number;
  processedRecords: number;
  successfulRecords: number;
  failedRecords: number;
  startedAt: string;
  completedAt?: string;
  initiatedBy: string;
  errors?: string[];
}

export default function BatchOperations() {
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<BatchOperation | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Sample Batch Operations
  const batchOperations: BatchOperation[] = [
    {
      id: 'BO-2024-001',
      type: 'import',
      name: 'Bulk Enrollment Import - January 2024',
      status: 'processing',
      totalRecords: 5000,
      processedRecords: 3245,
      successfulRecords: 3198,
      failedRecords: 47,
      startedAt: '2024-01-15 14:00',
      initiatedBy: 'Admin User',
    },
    {
      id: 'BO-2024-002',
      type: 'approval',
      name: 'Mass Enrollment Approval - December 2023',
      status: 'completed',
      totalRecords: 2834,
      processedRecords: 2834,
      successfulRecords: 2756,
      failedRecords: 78,
      startedAt: '2024-01-10 09:30',
      completedAt: '2024-01-10 11:45',
      initiatedBy: 'Supervisor Jane',
      errors: ['78 records failed validation checks'],
    },
    {
      id: 'BO-2024-003',
      type: 'verification',
      name: 'Biometric Batch Verification',
      status: 'completed',
      totalRecords: 1250,
      processedRecords: 1250,
      successfulRecords: 1203,
      failedRecords: 47,
      startedAt: '2024-01-14 16:00',
      completedAt: '2024-01-14 18:30',
      initiatedBy: 'System Admin',
      errors: ['47 records had biometric match failures'],
    },
    {
      id: 'BO-2024-004',
      type: 'export',
      name: 'Monthly Enrollment Report Export',
      status: 'completed',
      totalRecords: 3892,
      processedRecords: 3892,
      successfulRecords: 3892,
      failedRecords: 0,
      startedAt: '2024-01-12 08:00',
      completedAt: '2024-01-12 08:15',
      initiatedBy: 'Report Admin',
    },
    {
      id: 'BO-2024-005',
      type: 'status_update',
      name: 'Bulk Status Update - Expired IDs',
      status: 'failed',
      totalRecords: 856,
      processedRecords: 234,
      successfulRecords: 0,
      failedRecords: 234,
      startedAt: '2024-01-15 12:00',
      initiatedBy: 'Admin User',
      errors: ['Database connection timeout', 'Transaction rollback initiated'],
    },
    {
      id: 'BO-2024-006',
      type: 'import',
      name: 'Border Crossing Data Import',
      status: 'pending',
      totalRecords: 1500,
      processedRecords: 0,
      successfulRecords: 0,
      failedRecords: 0,
      startedAt: '2024-01-15 15:00',
      initiatedBy: 'Border Admin',
    },
  ];

  const operationTypes = [
    { value: 'all', label: 'All Types', icon: FileSpreadsheet },
    { value: 'import', label: 'Import', icon: Upload },
    { value: 'approval', label: 'Approval', icon: CheckCircle },
    { value: 'verification', label: 'Verification', icon: Eye },
    { value: 'export', label: 'Export', icon: Download },
    { value: 'status_update', label: 'Status Update', icon: Clock },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
    { value: 'paused', label: 'Paused' },
  ];

  const getStatusColor = (status: BatchOperation['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      case 'paused':
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status: BatchOperation['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
        return <Clock className="w-4 h-4 animate-spin" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      case 'paused':
        return <Pause className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: BatchOperation['type']) => {
    switch (type) {
      case 'import':
        return 'bg-blue-100 text-blue-600';
      case 'approval':
        return 'bg-green-100 text-green-600';
      case 'verification':
        return 'bg-purple-100 text-purple-600';
      case 'export':
        return 'bg-orange-100 text-orange-600';
      case 'status_update':
        return 'bg-yellow-100 text-yellow-600';
    }
  };

  const getTypeIcon = (type: BatchOperation['type']) => {
    const Icon = operationTypes.find(t => t.value === type)?.icon || FileSpreadsheet;
    return <Icon className="w-5 h-5" />;
  };

  const filteredOperations = batchOperations.filter(op => {
    if (selectedType !== 'all' && op.type !== selectedType) return false;
    if (selectedStatus !== 'all' && op.status !== selectedStatus) return false;
    return true;
  });

  const stats = {
    total: batchOperations.length,
    processing: batchOperations.filter(o => o.status === 'processing').length,
    completed: batchOperations.filter(o => o.status === 'completed').length,
    failed: batchOperations.filter(o => o.status === 'failed').length,
  };

  const calculateProgress = (op: BatchOperation) => {
    return op.totalRecords > 0 ? (op.processedRecords / op.totalRecords) * 100 : 0;
  };

  const calculateSuccessRate = (op: BatchOperation) => {
    return op.processedRecords > 0
      ? ((op.successfulRecords / op.processedRecords) * 100).toFixed(1)
      : '0.0';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Batch Operations</h1>
          <p className="text-slate-600 mt-1">Bulk import, mass approval, and batch processing tools</p>
        </div>
        <button
          onClick={() => setShowImportModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload className="w-4 h-4" />
          New Batch Operation
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Operations</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileSpreadsheet className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Processing</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.processing}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600 animate-spin" />
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

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Upload className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900">Bulk Import</div>
              <div className="text-xs text-slate-500">Import enrollments from CSV/Excel</div>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900">Mass Approval</div>
              <div className="text-xs text-slate-500">Approve pending enrollments in bulk</div>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Download className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900">Bulk Export</div>
              <div className="text-xs text-slate-500">Export records to CSV/Excel</div>
            </div>
          </button>
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
            {operationTypes.map((type) => {
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

      {/* Operations List */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="font-bold text-slate-900">Batch Operations ({filteredOperations.length})</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {filteredOperations.map((operation) => (
            <div key={operation.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 rounded-lg ${getTypeColor(operation.type)}`}>
                    {getTypeIcon(operation.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-slate-900">{operation.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(operation.status)}`}>
                        {getStatusIcon(operation.status)}
                        {operation.status.charAt(0).toUpperCase() + operation.status.slice(1)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    {operation.status === 'processing' && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                          <span>Progress: {operation.processedRecords.toLocaleString()} / {operation.totalRecords.toLocaleString()}</span>
                          <span>{calculateProgress(operation).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${calculateProgress(operation)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Statistics */}
                    <div className="flex items-center gap-6 text-sm mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-600">Total: {operation.totalRecords.toLocaleString()}</span>
                      </div>
                      {operation.processedRecords > 0 && (
                        <>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-green-700">{operation.successfulRecords.toLocaleString()} successful</span>
                          </div>
                          {operation.failedRecords > 0 && (
                            <div className="flex items-center gap-2">
                              <XCircle className="w-4 h-4 text-red-600" />
                              <span className="text-red-700">{operation.failedRecords.toLocaleString()} failed</span>
                            </div>
                          )}
                          <div className="text-slate-600">
                            Success Rate: {calculateSuccessRate(operation)}%
                          </div>
                        </>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>ID: {operation.id}</span>
                      <span>Started: {operation.startedAt}</span>
                      {operation.completedAt && <span>Completed: {operation.completedAt}</span>}
                      <span>By: {operation.initiatedBy}</span>
                    </div>

                    {/* Errors */}
                    {operation.errors && operation.errors.length > 0 && (
                      <div className="mt-2 p-3 bg-red-50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-xs font-medium text-red-700 mb-1">Errors:</div>
                            {operation.errors.map((error, index) => (
                              <div key={index} className="text-xs text-red-600">• {error}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedOperation(operation);
                      setShowDetailsModal(true);
                    }}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Details
                  </button>
                  {operation.status === 'failed' && (
                    <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors">
                      <RotateCcw className="w-4 h-4" />
                      Retry
                    </button>
                  )}
                  {operation.status === 'processing' && (
                    <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors">
                      <Pause className="w-4 h-4" />
                      Pause
                    </button>
                  )}
                  {operation.status === 'pending' && (
                    <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                      <Play className="w-4 h-4" />
                      Start
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">New Batch Operation</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Operation Type
                  </label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900">
                    <option>Bulk Import</option>
                    <option>Mass Approval</option>
                    <option>Batch Verification</option>
                    <option>Bulk Export</option>
                    <option>Status Update</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Upload File
                  </label>
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm text-slate-600 mb-2">
                      Drop your file here or click to browse
                    </p>
                    <p className="text-xs text-slate-500">
                      Supported formats: CSV, Excel (.xlsx, .xls)
                    </p>
                    <button className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      Select File
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">Download Template</p>
                    <p className="text-xs text-blue-700">Get the CSV template with required fields</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                    Download
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Operation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedOperation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedOperation.name}</h2>
                <p className="text-sm text-slate-600 mt-1">Operation ID: {selectedOperation.id}</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Type</p>
                  <p className="text-sm font-medium text-slate-900 capitalize">{selectedOperation.type.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getStatusColor(selectedOperation.status)}`}>
                    {getStatusIcon(selectedOperation.status)}
                    {selectedOperation.status.charAt(0).toUpperCase() + selectedOperation.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Records</p>
                  <p className="text-sm font-medium text-slate-900">{selectedOperation.totalRecords.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Processed</p>
                  <p className="text-sm font-medium text-slate-900">{selectedOperation.processedRecords.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Successful</p>
                  <p className="text-sm font-medium text-green-700">{selectedOperation.successfulRecords.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Failed</p>
                  <p className="text-sm font-medium text-red-700">{selectedOperation.failedRecords.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Started At</p>
                  <p className="text-sm font-medium text-slate-900">{selectedOperation.startedAt}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Completed At</p>
                  <p className="text-sm font-medium text-slate-900">{selectedOperation.completedAt || '-'}</p>
                </div>
              </div>

              {selectedOperation.errors && selectedOperation.errors.length > 0 && (
                <div className="p-4 bg-red-50 rounded-lg">
                  <h3 className="text-sm font-bold text-red-900 mb-2">Errors</h3>
                  {selectedOperation.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-700 mb-1">• {error}</div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
