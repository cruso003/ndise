import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Database } from 'lucide-react';
import { getDataSyncStats } from '../../lib/agencyIntegration';
import { useState } from 'react';

export default function DataSyncChart() {
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('today');
  const syncStats = getDataSyncStats();
  
  const getChartData = () => {
    return syncStats.byAgency.map(agency => ({
      name: agency.agencyName.split('(')[0].trim().slice(0, 20), // Shorten names
      records: timeframe === 'today' ? agency.recordsToday :
               timeframe === 'week' ? agency.recordsWeek :
               agency.recordsMonth
    })).slice(0, 8); // Top 8 agencies
  };

  const getTotalRecords = () => {
    switch (timeframe) {
      case 'today':
        return syncStats.today.toLocaleString();
      case 'week':
        return syncStats.thisWeek.toLocaleString();
      case 'month':
        return syncStats.thisMonth.toLocaleString();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-bold text-slate-900">Data Sync Activity</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeframe('today')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                timeframe === 'today'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeframe('week')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                timeframe === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                timeframe === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Month
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6 text-center">
          <div className="text-4xl font-bold text-blue-600">{getTotalRecords()}</div>
          <div className="text-sm text-slate-600">Total Records Synced</div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={getChartData()}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 11 }}
              stroke="#64748b"
            />
            <YAxis 
              tick={{ fontSize: 11 }}
              stroke="#64748b"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend />
            <Bar 
              dataKey="records" 
              fill="#3b82f6" 
              name="Records Synced"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
