import { Bell, Shield, Globe, Mail } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage your account and integration preferences</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 divide-y divide-slate-200">
        {/* Profile Section */}
        <div className="p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Organization Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
              <input type="text" value="Ecobank Liberia" disabled className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Business Registration</label>
              <input type="text" value="REG-2005-8829" disabled className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Technical Contact</label>
              <input type="text" defaultValue="tech-team@ecobank.com" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
              <input type="text" defaultValue="https://ecobank.com" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-900">Usage Alerts</div>
                <div className="text-sm text-slate-500">Notify when API usage exceeds 80% of quota</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-900">System Maintenance</div>
                <div className="text-sm text-slate-500">Receive emails about scheduled downtime</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-900">IP Whitelisting</div>
                <div className="text-sm text-slate-500">Restrict API access to specific IP addresses</div>
              </div>
              <button className="text-blue-600 font-medium text-sm hover:underline">Configure</button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-900">2-Factor Authentication</div>
                <div className="text-sm text-slate-500">Require 2FA for dashboard access</div>
              </div>
              <button className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-medium">Enabled</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-4">
        <button className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50">
          Cancel
        </button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </div>
  );
}
