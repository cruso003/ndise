import { useState } from 'react';
import { Search, CheckCircle, XCircle, AlertTriangle, Shield, Download, Clock, Phone, MapPin } from 'lucide-react';

export default function Verification() {
  const [nationalId, setNationalId] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sample verification data with different scenarios
  const sampleData: Record<string, any> = {
    '1990010112345678': {
      status: 'valid',
      fullName: 'John Kwame Doe',
      dob: '1990-01-01',
      gender: 'Male',
      address: 'Sinkor, Monrovia',
      phone: '+231-77-123-4567',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
      verificationId: 'VER-2024-88392',
      timestamp: new Date().toISOString(),
      riskLevel: 'low',
      watchlistStatus: 'clear',
      accountsOpened: 2, // For banks
      simCardsIssued: 1, // For telecoms
    },
    '1985050567891234': {
      status: 'valid',
      fullName: 'Sarah Blessing Kollie',
      dob: '1985-05-05',
      gender: 'Female',
      address: 'Paynesville, Montserrado',
      phone: '+231-88-555-9876',
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
      verificationId: 'VER-2024-88393',
      timestamp: new Date().toISOString(),
      riskLevel: 'low',
      watchlistStatus: 'clear',
      accountsOpened: 1,
      simCardsIssued: 2,
    },
    '1992030398765432': {
      status: 'valid',
      fullName: 'Marcus Gaye',
      dob: '1992-03-03',
      gender: 'Male',
      address: 'Red Light, Monrovia',
      phone: '+231-77-888-3456',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
      verificationId: 'VER-2024-88394',
      timestamp: new Date().toISOString(),
      riskLevel: 'high',
      watchlistStatus: 'flagged',
      watchlistReason: 'Added to wanted list by Police. Active investigation.',
      accountsOpened: 0,
      simCardsIssued: 0,
      alerts: [
        { type: 'watchlist', message: 'Person is on national watchlist - High Risk', severity: 'critical' },
        { type: 'police', message: 'Active investigation by Liberia National Police', severity: 'high' },
      ],
    },
    '1988121298765432': {
      status: 'valid',
      fullName: 'Grace Nyemah',
      dob: '1988-12-12',
      gender: 'Female',
      address: 'Congo Town, Monrovia',
      phone: '+231-77-999-1234',
      photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200',
      verificationId: 'VER-2024-88395',
      timestamp: new Date().toISOString(),
      riskLevel: 'medium',
      watchlistStatus: 'clear',
      accountsOpened: 8, // Fraud alert - too many accounts
      simCardsIssued: 5, // Fraud alert - too many SIM cards
      alerts: [
        { type: 'fraud', message: 'FRAUD ALERT: 8 bank accounts opened in 3 months', severity: 'high' },
        { type: 'fraud', message: 'FRAUD ALERT: 5 SIM cards registered to this ID', severity: 'medium' },
      ],
    },
  };

  const handleVerify = () => {
    if (!nationalId) return;
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const result = sampleData[nationalId];
      if (result) {
        setVerificationResult(result);
      } else {
        setVerificationResult({
          status: 'invalid',
          message: 'National ID not found or invalid format'
        });
      }
      setIsLoading(false);
    }, 1200);
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
                verificationResult.status === 'valid'
                  ? verificationResult.riskLevel === 'high'
                    ? 'bg-red-600'
                    : verificationResult.riskLevel === 'medium'
                      ? 'bg-orange-600'
                      : 'bg-green-600'
                  : 'bg-red-600'
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
                    {/* Alerts Section */}
                    {verificationResult.alerts && verificationResult.alerts.length > 0 && (
                      <div className="space-y-2">
                        {verificationResult.alerts.map((alert: any, idx: number) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg border-l-4 ${
                              alert.severity === 'critical'
                                ? 'bg-red-50 border-red-600'
                                : alert.severity === 'high'
                                  ? 'bg-orange-50 border-orange-600'
                                  : 'bg-yellow-50 border-yellow-600'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                                alert.severity === 'critical' ? 'text-red-600' : alert.severity === 'high' ? 'text-orange-600' : 'text-yellow-600'
                              }`} />
                              <div className="flex-1">
                                <div className={`text-xs font-bold uppercase mb-1 ${
                                  alert.severity === 'critical' ? 'text-red-800' : alert.severity === 'high' ? 'text-orange-800' : 'text-yellow-800'
                                }`}>
                                  {alert.type === 'watchlist' ? '🚨 Watchlist Alert' : alert.type === 'police' ? '👮 Police Alert' : '⚠️ Fraud Alert'}
                                </div>
                                <div className={`text-sm font-medium ${
                                  alert.severity === 'critical' ? 'text-red-900' : alert.severity === 'high' ? 'text-orange-900' : 'text-yellow-900'
                                }`}>
                                  {alert.message}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Person Info */}
                    <div className="flex items-center gap-4">
                      <img
                        src={verificationResult.photoUrl}
                        alt="ID Photo"
                        className="w-20 h-20 rounded-lg object-cover border-2 border-slate-100"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900">{verificationResult.fullName}</h3>
                        <div className="text-slate-500 text-sm font-mono">{nationalId}</div>
                        <div className="mt-1">
                          {verificationResult.riskLevel === 'high' && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-bold rounded">HIGH RISK</span>
                          )}
                          {verificationResult.riskLevel === 'medium' && (
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs font-bold rounded">MEDIUM RISK</span>
                          )}
                          {verificationResult.riskLevel === 'low' && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-bold rounded">LOW RISK</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Basic Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500 block text-xs">Date of Birth</span>
                        <span className="font-medium">{verificationResult.dob}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-xs">Gender</span>
                        <span className="font-medium">{verificationResult.gender}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-xs flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          Address
                        </span>
                        <span className="font-medium">{verificationResult.address}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-xs flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          Phone
                        </span>
                        <span className="font-medium text-xs">{verificationResult.phone}</span>
                      </div>
                    </div>

                    {/* Watchlist Status */}
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-xs text-slate-500 mb-1 font-medium">Watchlist Status</div>
                      <div className="flex items-center gap-2">
                        {verificationResult.watchlistStatus === 'clear' ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-green-900">Clear - No Flags</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-red-600" />
                            <div>
                              <div className="font-bold text-red-900">FLAGGED</div>
                              <div className="text-xs text-red-700">{verificationResult.watchlistReason}</div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Usage Stats - Partner Specific */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                        <div className="text-xs text-blue-600 font-medium mb-1">Bank Accounts</div>
                        <div className={`text-2xl font-bold ${verificationResult.accountsOpened > 5 ? 'text-red-600' : 'text-blue-900'}`}>
                          {verificationResult.accountsOpened}
                        </div>
                        {verificationResult.accountsOpened > 5 && (
                          <div className="text-xs text-red-600 font-medium mt-1">⚠️ Unusual Activity</div>
                        )}
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                        <div className="text-xs text-purple-600 font-medium mb-1">SIM Cards</div>
                        <div className={`text-2xl font-bold ${verificationResult.simCardsIssued > 3 ? 'text-red-600' : 'text-purple-900'}`}>
                          {verificationResult.simCardsIssued}
                        </div>
                        {verificationResult.simCardsIssued > 3 && (
                          <div className="text-xs text-red-600 font-medium mt-1">⚠️ Unusual Activity</div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2 text-sm">
                        <Download className="w-4 h-4" />
                        Download Report
                      </button>
                      <button className="flex-1 bg-slate-600 text-white py-2 rounded-lg font-medium hover:bg-slate-700 flex items-center justify-center gap-2 text-sm">
                        <Clock className="w-4 h-4" />
                        View History
                      </button>
                    </div>

                    {/* Verification ID */}
                    <div className="pt-4 border-t border-slate-100">
                      <div className="text-xs text-slate-400 mb-1">Verification ID</div>
                      <div className="font-mono text-sm text-slate-600">{verificationResult.verificationId}</div>
                      <div className="text-xs text-slate-400 mt-1">Timestamp: {new Date(verificationResult.timestamp).toLocaleString()}</div>
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
