import { FileText, Download } from 'lucide-react';

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Executive Reports</h1>
        <p className="text-slate-600 mt-1">Strategic reports and system audits</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200 font-bold text-slate-900">
          Available Reports
        </div>
        <div className="divide-y divide-slate-200">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Monthly National Security Briefing</div>
                  <div className="text-sm text-slate-500">Generated on Nov {i}, 2024</div>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
