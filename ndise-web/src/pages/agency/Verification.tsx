import { useState } from 'react';
import { Search, CheckCircle, XCircle, AlertTriangle, User, Shield } from 'lucide-react';

export default function Verification() {
  const [nationalId, setNationalId] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = () => {
    if (!nationalId) return;
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (nationalId === '1990010112345678') {
        setVerificationResult({
          status: 'valid',
          fullName: 'John Kwame Doe',
          dob: '1990-01-01',
          gender: 'Male',
          photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
          verificationId: 'VER-2024-88392',
          timestamp: new Date().toISOString()
        });
      } else {
        setVerificationResult({
          status: 'invalid',
          message: 'National ID not found or invalid format'
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Identity Verification</h1>
        <p className="text-slate-600 mt-1">Manually verify customer identity using National ID</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verification Form */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Verify Identity</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">National ID Number</label>
              <div className="relative">
                <input
                  type="text"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  placeholder="Enter 16-digit National ID"
                  className="w-full pl-4 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Format: YYYYMMDD + 8 digits</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <span className="font-bold block mb-1">Consent Required</span>
                By performing this verification, you confirm that you have obtained the customer's consent to verify their identity against the National Registry.
              </div>
            </div>

            <button
              onClick={handleVerify}
              disabled={isLoading || !nationalId}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Verify Identity
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Area */}
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-6 flex items-center justify-center min-h-[400px]">
          {!verificationResult && !isLoading && (
            <div className="text-center text-slate-500">
              <Shield className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>Enter a National ID to see verification results</p>
            </div>
          )}

          {isLoading && (
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Connecting to National Registry...</p>
            </div>
          )}

          {verificationResult && !isLoading && (
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className={`p-4 text-white flex items-center justify-between ${
                verificationResult.status === 'valid' ? 'bg-green-600' : 'bg-red-600'
              }`}>
                <div className="flex items-center gap-2 font-bold text-lg">
                  {verificationResult.status === 'valid' ? (
                    <>
                      <CheckCircle className="w-6 h-6" />
                      Identity Verified
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6" />
                      Verification Failed
                    </>
                  )}
                </div>
                <div className="text-xs opacity-80 font-mono">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>

              <div className="p-6">
                {verificationResult.status === 'valid' ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <img 
                        src={verificationResult.photoUrl} 
                        alt="ID Photo" 
                        className="w-20 h-20 rounded-lg object-cover border-2 border-slate-100"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{verificationResult.fullName}</h3>
                        <div className="text-slate-500">{nationalId}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500 block text-xs">Date of Birth</span>
                        <span className="font-medium">{verificationResult.dob}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-xs">Gender</span>
                        <span className="font-medium">{verificationResult.gender}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <div className="text-xs text-slate-400 mb-1">Verification ID</div>
                      <div className="font-mono text-sm text-slate-600">{verificationResult.verificationId}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-900 mb-1">Invalid ID</h3>
                    <p className="text-slate-600 text-sm">{verificationResult.message}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
