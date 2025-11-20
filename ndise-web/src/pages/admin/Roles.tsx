import { Shield, Plus, Edit2, Lock } from 'lucide-react';

export default function RoleManagement() {
  const roles = [
    { name: 'nsa', description: 'National Security Agency Analyst', permissions: 45, level: 5 },
    { name: 'executive', description: 'Executive Leadership & Oversight', permissions: 32, level: 5 },
    { name: 'border', description: 'Border Control Officer', permissions: 28, level: 4 },
    { name: 'police', description: 'Law Enforcement Officer', permissions: 24, level: 3 },
    { name: 'enrollment', description: 'Enrollment Officer', permissions: 18, level: 2 },
    { name: 'agency', description: 'External Agency Partner', permissions: 12, level: 2 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Role Management</h1>
          <p className="text-slate-600 mt-1">Define roles and permission sets</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Create New Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.name} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${
                role.level >= 5 ? 'bg-red-100 text-red-600' :
                role.level === 4 ? 'bg-orange-100 text-orange-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                <Shield className="w-6 h-6" />
              </div>
              <button className="text-slate-400 hover:text-blue-600">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 capitalize mb-1">{role.name}</h3>
            <p className="text-sm text-slate-500 mb-4 h-10">{role.description}</p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Clearance Level</span>
                <span className="font-bold text-slate-900">Level {role.level}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Permissions</span>
                <span className="font-bold text-slate-900">{role.permissions} capabilities</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button className="w-full py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                Configure Access
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
