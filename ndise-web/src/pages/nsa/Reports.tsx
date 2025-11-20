import { FileText, Download, Filter, Search, Calendar } from 'lucide-react';

interface Report {
  id: string;
  title: string;
  type: 'Intelligence' | 'Surveillance' | 'Audit' | 'Incident';
  date: string;
  author: string;
  classification: 'Top Secret' | 'Secret' | 'Confidential' | 'Unclassified';
  status: 'Final' | 'Draft' | 'Review';
}

export default function Reports() {
  const reports: Report[] = [
    {
      id: 'RPT-2024-001',
      title: 'Weekly Border Security Assessment',
      type: 'Intelligence',
      date: '2024-11-20',
      author: 'Analyst Sarah Mensah',
      classification: 'Secret',
      status: 'Final'
    },
    {
      id: 'RPT-2024-002',
      title: 'Surveillance Log: Sector 4 Activity',
      type: 'Surveillance',
      date: '2024-11-19',
      author: 'Ops Center Team A',
      classification: 'Confidential',
      status: 'Final'
    },
    {
      id: 'RPT-2024-003',
      title: 'Target Alpha Movement Analysis',
      type: 'Intelligence',
      date: '2024-11-18',
      author: 'Analyst John Doe',
      classification: 'Top Secret',
      status: 'Review'
    },
    {
      id: 'RPT-2024-004',
      title: 'System Access Audit Log',
      type: 'Audit',
      date: '2024-11-15',
      author: 'System Admin',
      classification: 'Secret',
      status: 'Final'
    },
    {
      id: 'RPT-2024-005',
      title: 'Incident Report: Unauthorized Entry Attempt',
      type: 'Incident',
      date: '2024-11-14',
      author: 'Border Command',
      classification: 'Confidential',
      status: 'Final'
    }
  ];

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'Top Secret': return 'bg-red-100 text-red-800 border-red-200';
      case 'Secret': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Confidential': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Intelligence Reports</h1>
          <p className="text-slate-600 mt-1">Access classified intelligence and operational reports</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Generate New Report
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search reports..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar className="w-4 h-4" />
            <span>Showing last 30 days</span>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Report Title</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Type</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Classification</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Date</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Author</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{report.title}</div>
                  <div className="text-xs text-slate-500">{report.id}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                    {report.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getClassificationColor(report.classification)}`}>
                    {report.classification.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{report.date}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{report.author}</td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
