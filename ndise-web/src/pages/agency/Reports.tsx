import { FileText, Download, Calendar, BarChart2 } from 'lucide-react';

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Usage Reports</h1>
          <p className="text-slate-600 mt-1">View and download API usage statements</p>
        </div>
        <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 font-medium hover:bg-slate-200">
          <Calendar className="w-4 h-4" />
          Last 30 Days
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="text-slate-500 text-sm font-medium mb-1">Total Requests</div>
          <div className="text-3xl font-bold text-slate-900">45,892</div>
          <div className="text-green-600 text-sm mt-1 flex items-center gap-1">
            <BarChart2 className="w-3 h-3" />
            +12.5% vs last month
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="text-slate-500 text-sm font-medium mb-1">Billable Calls</div>
          <div className="text-3xl font-bold text-slate-900">42,100</div>
          <div className="text-slate-400 text-sm mt-1">91.7% of total traffic</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="text-slate-500 text-sm font-medium mb-1">Estimated Cost</div>
          <div className="text-3xl font-bold text-slate-900">$421.00</div>
          <div className="text-slate-400 text-sm mt-1">@ $0.01 per call</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 font-bold text-slate-900">
          Monthly Statements
        </div>
        <div className="divide-y divide-slate-200">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">October 2024 Statement</div>
                  <div className="text-sm text-slate-500">Generated on Nov 1, 2024</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-900">$385.50</div>
                  <div className="text-xs text-green-600 font-medium">PAID</div>
                </div>
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
