import { BookOpen, Code, Terminal, FileText, ChevronRight } from 'lucide-react';

export default function Documentation() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Developer Documentation</h1>
          <p className="text-slate-600 mt-1">Integration guides, API references, and SDKs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-900">
              Guides
            </div>
            <nav className="p-2 space-y-1">
              <a href="#" className="block px-3 py-2 rounded-md bg-blue-50 text-blue-700 font-medium">Introduction</a>
              <a href="#" className="block px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50">Authentication</a>
              <a href="#" className="block px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50">Rate Limits</a>
              <a href="#" className="block px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50">Errors</a>
            </nav>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-900">
              API Reference
            </div>
            <nav className="p-2 space-y-1">
              <a href="#" className="block px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50">Identity Verification</a>
              <a href="#" className="block px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50">Biometric Match</a>
              <a href="#" className="block px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50">Document Validation</a>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-8">
          {/* Quick Start */}
          <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Quick Start</h2>
            <p className="text-slate-600 mb-6">
              Get started with the NDISE Identity Verification API in minutes. Follow these steps to integrate secure identity checks into your application.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 border border-slate-200 rounded-lg hover:border-blue-500 transition-colors cursor-pointer group">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Key className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">1. Get API Keys</h3>
                <p className="text-sm text-slate-500">Generate your production and sandbox credentials.</p>
              </div>
              <div className="p-4 border border-slate-200 rounded-lg hover:border-blue-500 transition-colors cursor-pointer group">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">2. Install SDK</h3>
                <p className="text-sm text-slate-500">Use our official libraries for Node, Python, or Java.</p>
              </div>
              <div className="p-4 border border-slate-200 rounded-lg hover:border-blue-500 transition-colors cursor-pointer group">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <Code className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">3. Verify User</h3>
                <p className="text-sm text-slate-500">Make your first verification request.</p>
              </div>
            </div>

            <div className="bg-slate-900 rounded-lg p-6 text-white font-mono text-sm overflow-x-auto">
              <div className="flex items-center gap-2 text-slate-400 mb-2 border-b border-slate-700 pb-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2">Example Request</span>
              </div>
              <pre className="language-bash">
{`curl -X POST https://api.ndise.gov.lr/v1/verify \\
  -H "Authorization: Bearer pk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "national_id": "1990010112345678",
    "consent_token": "ct_..."
  }'`}
              </pre>
            </div>
          </section>

          {/* SDKs */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Official SDKs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="#" className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 text-green-700 rounded flex items-center justify-center font-bold">JS</div>
                  <div>
                    <div className="font-bold text-slate-900">Node.js</div>
                    <div className="text-xs text-slate-500">v2.4.0</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </a>
              <a href="#" className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded flex items-center justify-center font-bold">PY</div>
                  <div>
                    <div className="font-bold text-slate-900">Python</div>
                    <div className="text-xs text-slate-500">v1.8.2</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Key({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m21 2-2 2m-7.6 7.6a6.5 6.5 0 1 1 5.3-5.3L21 2v5h-3v3h-2l-4.4 4.4" />
    </svg>
  )
}
