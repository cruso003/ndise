import { useState } from 'react';
import { Key, Copy, RefreshCw, Trash2, Plus, Eye, EyeOff, Shield } from 'lucide-react';

interface APIKey {
  id: string;
  name: string;
  prefix: string;
  created: string;
  lastUsed: string;
  status: 'active' | 'revoked';
  environment: 'production' | 'sandbox';
}

export default function APIKeys() {
  const [keys, setKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Production Primary',
      prefix: 'pk_live_...',
      created: '2024-01-15',
      lastUsed: 'Just now',
      status: 'active',
      environment: 'production'
    },
    {
      id: '2',
      name: 'Development Test',
      prefix: 'pk_test_...',
      created: '2024-03-10',
      lastUsed: '2 days ago',
      status: 'active',
      environment: 'sandbox'
    }
  ]);

  const [showKeyModal, setShowKeyModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">API Keys</h1>
          <p className="text-slate-600 mt-1">Manage your API authentication credentials</p>
        </div>
        <button 
          onClick={() => setShowKeyModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Generate New Key
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-bold text-slate-900">Security Best Practices</h3>
              <p className="text-sm text-slate-600 mt-1">
                Never share your secret keys. Keep them secure and rotate them regularly. 
                Use separate keys for development and production environments.
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {keys.map((key) => (
            <div key={key.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${
                  key.environment === 'production' ? 'bg-purple-100 text-purple-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900">{key.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      key.environment === 'production' ? 'bg-purple-100 text-purple-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {key.environment}
                    </span>
                  </div>
                  <div className="font-mono text-sm text-slate-500 mt-1 flex items-center gap-2">
                    {key.prefix}
                    <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                      Created: {key.created}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Last Used</div>
                  <div className="text-sm font-medium text-slate-900">{key.lastUsed}</div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Copy Key ID">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Roll Key">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Revoke Key">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Webhook Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Webhook Configuration</h2>
          <button className="text-blue-600 text-sm font-medium hover:underline">Add Endpoint</button>
        </div>
        <p className="text-slate-600 text-sm mb-4">
          Receive real-time notifications for verification events and status changes.
        </p>
        
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <div className="font-mono text-sm text-slate-700">https://api.ecobank.com/webhooks/ndise/verify</div>
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded font-medium">verification.success</span>
            <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded font-medium">verification.failed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
