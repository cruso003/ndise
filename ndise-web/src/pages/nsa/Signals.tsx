// import { useState } from 'react';
import { Radio, Wifi, Phone, Globe, Lock, Unlock, AlertTriangle, BarChart2, Activity } from 'lucide-react';

interface Signal {
  id: string;
  type: 'GSM' | 'Satellite' | 'Radio' | 'Internet';
  frequency: string;
  strength: number;
  source: string;
  destination: string;
  content: string;
  encrypted: boolean;
  timestamp: string;
  riskScore: number;
}

export default function Signals() {
  // const [filter, setFilter] = useState('all');

  const signals: Signal[] = [
    {
      id: 'SIG-9021',
      type: 'GSM',
      frequency: '1800 MHz',
      strength: 85,
      source: '+231 77 012 3456',
      destination: '+231 88 654 3210',
      content: 'Package delivery confirmed for tonight at the usual spot.',
      encrypted: false,
      timestamp: '10:42:15',
      riskScore: 78
    },
    {
      id: 'SIG-9022',
      type: 'Internet',
      frequency: '2.4 GHz',
      strength: 92,
      source: '192.168.1.45',
      destination: '10.0.0.5',
      content: '[ENCRYPTED DATA PACKET]',
      encrypted: true,
      timestamp: '10:42:18',
      riskScore: 45
    },
    {
      id: 'SIG-9023',
      type: 'Radio',
      frequency: '446.00625 MHz',
      strength: 60,
      source: 'Unknown (Triangulating...)',
      destination: 'Broadcast',
      content: 'Movement detected in sector 4. Proceed with caution.',
      encrypted: false,
      timestamp: '10:42:25',
      riskScore: 92
    },
    {
      id: 'SIG-9024',
      type: 'Satellite',
      frequency: '1.6 GHz',
      strength: 40,
      source: 'Sat-Phone-Alpha',
      destination: 'Sat-Phone-Bravo',
      content: '[ENCRYPTED VOICE STREAM]',
      encrypted: true,
      timestamp: '10:42:30',
      riskScore: 65
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Signals Intelligence</h1>
          <p className="text-slate-600 mt-1">Intercept and analyze communication signals</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
            <Wifi className="w-4 h-4 animate-pulse" />
            Scanner Active
          </div>
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm font-medium">
            <Radio className="w-4 h-4" />
            4 Bands Monitored
          </div>
        </div>
      </div>

      {/* Spectrum Analyzer Visualization (Simulated) */}
      <div className="bg-slate-900 rounded-xl p-6 text-white h-64 relative overflow-hidden">
        <div className="absolute top-4 left-4 text-xs font-mono text-green-400">
          FREQ: 400MHz - 2.4GHz | BW: 20MHz | GAIN: +12dB
        </div>
        <div className="flex items-end justify-between h-full gap-1 pt-8">
          {Array.from({ length: 50 }).map((_, i) => {
            const height = Math.random() * 100;
            const isSpike = height > 80;
            return (
              <div 
                key={i} 
                className={`w-full rounded-t transition-all duration-300 ${
                  isSpike ? 'bg-red-500' : 'bg-green-500/50'
                }`}
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>
      </div>

      {/* Signal Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Intercepted Signals
          </h2>
          
          {signals.map((signal) => (
            <div key={signal.id} className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    signal.type === 'GSM' ? 'bg-blue-100 text-blue-600' :
                    signal.type === 'Radio' ? 'bg-orange-100 text-orange-600' :
                    signal.type === 'Internet' ? 'bg-purple-100 text-purple-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {signal.type === 'GSM' && <Phone className="w-5 h-5" />}
                    {signal.type === 'Radio' && <Radio className="w-5 h-5" />}
                    {signal.type === 'Internet' && <Globe className="w-5 h-5" />}
                    {signal.type === 'Satellite' && <Wifi className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{signal.type} Signal</div>
                    <div className="text-xs text-slate-500">{signal.frequency} • {signal.timestamp}</div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${
                  signal.riskScore > 80 ? 'bg-red-100 text-red-800' :
                  signal.riskScore > 50 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  Risk: {signal.riskScore}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-3 bg-slate-50 p-3 rounded">
                <div>
                  <span className="text-slate-500 block text-xs">Source</span>
                  <span className="font-mono font-medium">{signal.source}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">Destination</span>
                  <span className="font-mono font-medium">{signal.destination}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                {signal.encrypted ? (
                  <Lock className="w-4 h-4 text-slate-400 mt-1" />
                ) : (
                  <Unlock className="w-4 h-4 text-green-500 mt-1" />
                )}
                <div className={`text-sm font-mono ${signal.encrypted ? 'text-slate-400 italic' : 'text-slate-800'}`}>
                  "{signal.content}"
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4" />
              Signal Distribution
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>GSM/Cellular</span>
                  <span className="font-bold">45%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Internet Traffic</span>
                  <span className="font-bold">30%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '30%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Radio Frequencies</span>
                  <span className="font-bold">15%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '15%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Satellite</span>
                  <span className="font-bold">10%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-slate-500 h-2 rounded-full" style={{ width: '10%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800 font-bold mb-2">
              <AlertTriangle className="w-5 h-5" />
              Threat Alert
            </div>
            <p className="text-sm text-red-700">
              Unusual spike in encrypted radio traffic detected in Sector 4 (Border Region). 
              Pattern matches known smuggling operations.
            </p>
            <button className="mt-3 w-full bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700">
              Analyze Pattern
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
