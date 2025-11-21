import { useState } from 'react';
import { Search, Filter, Plus, User } from 'lucide-react';

interface Case {
  id: string;
  title: string;
  status: 'open' | 'closed' | 'pending_court' | 'cold';
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignedTo: string;
  dateOpened: string;
  category: 'Theft' | 'Assault' | 'Fraud' | 'Traffic' | 'Homicide';
}

export default function CaseManagement() {
  const [cases] = useState<Case[]>([
    {
      id: 'CASE-2024-8821',
      title: 'Armed Robbery at Sinkor 12th St',
      status: 'open',
      priority: 'high',
      assignedTo: 'Det. Michael Brown',
      dateOpened: '2024-11-18',
      category: 'Theft'
    },
    {
      id: 'CASE-2024-8815',
      title: 'Identity Fraud Ring Investigation',
      status: 'open',
      priority: 'critical',
      assignedTo: 'Det. Sarah Mensah',
      dateOpened: '2024-11-15',
      category: 'Fraud'
    },
    {
      id: 'CASE-2024-8790',
      title: 'Traffic Accident - Tubman Blvd',
      status: 'closed',
      priority: 'medium',
      assignedTo: 'Officer James Doe',
      dateOpened: '2024-11-10',
      category: 'Traffic'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Case Management</h1>
          <p className="text-slate-600 mt-1">Track investigations, evidence, and legal proceedings</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          New Case
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
                placeholder="Search cases..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Case List */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Case ID</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Title</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Priority</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Assigned To</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Date Opened</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {cases.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-sm text-slate-600">{c.id}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{c.title}</div>
                  <div className="text-xs text-slate-500">{c.category}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    c.status === 'open' ? 'bg-green-100 text-green-800' :
                    c.status === 'closed' ? 'bg-slate-100 text-slate-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {c.status.toUpperCase().replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    c.priority === 'critical' ? 'bg-red-100 text-red-800' :
                    c.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {c.priority.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  {c.assignedTo}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{c.dateOpened}</td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
