import { Save, Database, Lock, Globe, Bell } from 'lucide-react';

export default function SystemConfig() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">System Configuration</h1>
          <p className="text-slate-600 mt-1">Global system settings and parameters</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium hover:bg-blue-700">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <button className="w-full text-left px-4 py-3 bg-blue-50 text-blue-700 font-medium rounded-lg flex items-center gap-3">
            <Lock className="w-5 h-5" />
            Security & Auth
          </button>
          <button className="w-full text-left px-4 py-3 hover:bg-slate-50 text-slate-600 font-medium rounded-lg flex items-center gap-3">
            <Database className="w-5 h-5" />
            Database & Storage
          </button>
          <button className="w-full text-left px-4 py-3 hover:bg-slate-50 text-slate-600 font-medium rounded-lg flex items-center gap-3">
            <Globe className="w-5 h-5" />
            Network & API
          </button>
          <button className="w-full text-left px-4 py-3 hover:bg-slate-50 text-slate-600 font-medium rounded-lg flex items-center gap-3">
            <Bell className="w-5 h-5" />
            Notifications
          </button>
        </div>

        {/* Config Form */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Security & Authentication</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password Policy</label>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked className="rounded text-blue-600" />
                  <span className="text-slate-600">Require special characters</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked className="rounded text-blue-600" />
                  <span className="text-slate-600">Require numbers</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 text-sm">Minimum length:</span>
                  <input type="number" value="12" className="w-16 border border-slate-300 rounded px-2 py-1" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <label className="block text-sm font-medium text-slate-700 mb-2">Session Management</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-600 text-sm block mb-1">Session Timeout (minutes)</span>
                  <input type="number" value="30" className="w-full border border-slate-300 rounded px-3 py-2" />
                </div>
                <div>
                  <span className="text-slate-600 text-sm block mb-1">Max Concurrent Sessions</span>
                  <input type="number" value="3" className="w-full border border-slate-300 rounded px-3 py-2" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <label className="block text-sm font-medium text-slate-700 mb-2">Two-Factor Authentication (2FA)</label>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <div className="font-medium text-slate-900">Enforce 2FA for Admin Roles</div>
                  <div className="text-sm text-slate-500">All users with Level 4+ clearance must use 2FA</div>
                </div>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer bg-blue-600">
                  <span className="absolute left-6 inline-block w-6 h-6 bg-white border border-gray-300 rounded-full shadow transform transition-transform duration-200 ease-in-out translate-x-0"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
