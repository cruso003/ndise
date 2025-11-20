import { BarChart2, TrendingUp, Users, Globe } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">System Analytics</h1>
        <p className="text-slate-600 mt-1">Deep dive into NDISE data and trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Enrollment Trends</h3>
          <div className="h-64 bg-slate-50 rounded flex items-center justify-center text-slate-400">
            [Enrollment Chart Placeholder]
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Demographic Distribution</h3>
          <div className="h-64 bg-slate-50 rounded flex items-center justify-center text-slate-400">
            [Demographics Chart Placeholder]
          </div>
        </div>
      </div>
    </div>
  );
}
