import { useState } from 'react';
import { Ticket, Search, Filter, Plus, Car, CreditCard, AlertTriangle } from 'lucide-react';

interface Ticket {
  id: string;
  offense: string;
  violatorName: string;
  licensePlate: string;
  amount: number;
  status: 'unpaid' | 'paid' | 'overdue' | 'contested';
  dateIssued: string;
  officer: string;
  location: string;
}

export default function ETicketing() {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'TCK-2024-9901',
      offense: 'Speeding (20km/h over limit)',
      violatorName: 'John K. Doe',
      licensePlate: 'A-12345',
      amount: 50.00,
      status: 'unpaid',
      dateIssued: '2024-11-20',
      officer: 'Officer James Doe',
      location: 'Tubman Blvd'
    },
    {
      id: 'TCK-2024-9882',
      offense: 'Illegal Parking',
      violatorName: 'Mary Smith',
      licensePlate: 'B-98765',
      amount: 25.00,
      status: 'overdue',
      dateIssued: '2024-11-15',
      officer: 'Officer Michael Brown',
      location: 'Broad Street'
    },
    {
      id: 'TCK-2024-9850',
      offense: 'Expired Registration',
      violatorName: 'Peter Johnson',
      licensePlate: 'C-45678',
      amount: 75.00,
      status: 'paid',
      dateIssued: '2024-11-10',
      officer: 'Officer Sarah Mensah',
      location: 'Red Light'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">E-Ticketing</h1>
          <p className="text-slate-600 mt-1">Issue and manage traffic violations digitally</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Issue New Ticket
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="text-slate-500 text-sm font-medium mb-1">Tickets Issued Today</div>
          <div className="text-3xl font-bold text-slate-900">145</div>
          <div className="text-green-600 text-sm mt-1">+12% vs yesterday</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="text-slate-500 text-sm font-medium mb-1">Revenue Collected</div>
          <div className="text-3xl font-bold text-slate-900">$3,450</div>
          <div className="text-slate-400 text-sm mt-1">Today</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="text-slate-500 text-sm font-medium mb-1">Unpaid Violations</div>
          <div className="text-3xl font-bold text-slate-900">892</div>
          <div className="text-red-600 text-sm mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Action required
          </div>
        </div>
      </div>

      {/* Ticket List */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-4">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by plate or ticket ID..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Ticket ID</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Offense</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Violator</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Amount</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Date</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {tickets.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-sm text-slate-600">{t.id}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{t.offense}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Car className="w-3 h-3" />
                    {t.licensePlate}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-900">{t.violatorName}</td>
                <td className="px-6 py-4 font-medium text-slate-900">${t.amount.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    t.status === 'paid' ? 'bg-green-100 text-green-800' :
                    t.status === 'overdue' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {t.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{t.dateIssued}</td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1">
                    <CreditCard className="w-4 h-4" />
                    Process Payment
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
