import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, Download, Play } from 'lucide-react';

export default function BatchVerification() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
      setProgress(0);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setStatus('uploading');
    
    // Simulate upload and processing
    setTimeout(() => {
      setStatus('processing');
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus('completed');
            return 100;
          }
          return prev + 5;
        });
      }, 200);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Batch Verification</h1>
        <p className="text-slate-600 mt-1">Process bulk identity verifications via CSV upload</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:bg-slate-50 transition-colors relative">
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={status === 'processing' || status === 'uploading'}
              />
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                {file ? file.name : 'Drop CSV file here or click to upload'}
              </h3>
              <p className="text-slate-500 text-sm">
                Supports .csv and .xlsx files up to 10MB
              </p>
            </div>

            {file && status === 'idle' && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleUpload}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Start Processing
                </button>
              </div>
            )}

            {(status === 'processing' || status === 'uploading') && (
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm font-medium text-slate-700">
                  <span>{status === 'uploading' ? 'Uploading...' : 'Processing records...'}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {status === 'completed' && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="font-medium text-green-900">Processing Complete</div>
                    <div className="text-sm text-green-700">Processed 1,245 records successfully</div>
                  </div>
                </div>
                <button className="text-green-700 font-medium text-sm hover:underline flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  Download Report
                </button>
              </div>
            )}
          </div>

          {/* Recent Batches */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 font-medium text-slate-900">
              Recent Batches
            </div>
            <div className="divide-y divide-slate-200">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded text-blue-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">Batch_Verification_{2024010 + i}.csv</div>
                      <div className="text-xs text-slate-500">Processed on Nov {18 + i}, 2024</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900">500 Records</div>
                      <div className="text-xs text-green-600">100% Success</div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-blue-600">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-3">CSV Format Guide</h3>
            <p className="text-sm text-blue-800 mb-4">
              Your CSV file must follow the strict template format to be processed correctly.
            </p>
            <ul className="space-y-2 text-sm text-blue-800 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                Column A: National ID (Required)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                Column B: Full Name (Optional)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                Column C: Date of Birth (Optional)
              </li>
            </ul>
            <button className="w-full bg-white border border-blue-200 text-blue-700 py-2 rounded font-medium hover:bg-blue-50 flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Download Template
            </button>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-100">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-bold text-yellow-900 mb-1">Rate Limits Apply</h3>
                <p className="text-sm text-yellow-800">
                  Batch processing consumes your API quota. Maximum 5,000 records per batch file.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
