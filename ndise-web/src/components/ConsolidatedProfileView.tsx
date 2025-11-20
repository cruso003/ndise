import { Card, CardHeader, CardTitle, CardContent, Badge, Alert, Button } from './ui';
import { CheckCircle, AlertTriangle, XCircle, Sparkles, Database, TrendingUp } from 'lucide-react';
import type { ConsolidatedProfile, DataConflict, AIRecommendation } from '../lib/apiIntegration';

interface ConsolidatedProfileViewProps {
  profile: ConsolidatedProfile;
  onAcceptRecommendation?: (recommendation: AIRecommendation) => void;
  onResolveConflict?: (conflict: DataConflict, chosenValue: any) => void;
}

export default function ConsolidatedProfileView({ 
  profile, 
  onAcceptRecommendation,
  onResolveConflict 
}: ConsolidatedProfileViewProps) {
  const getQualityColor = (score: number) => {
    if (score >= 0.9) return 'text-green-700 dark:text-green-400';
    if (score >= 0.7) return 'text-yellow-700 dark:text-yellow-400';
    return 'text-red-700 dark:text-red-400';
  };

  const getQualityLabel = (score: number) => {
    if (score >= 0.9) return 'Excellent';
    if (score >= 0.7) return 'Good';
    if (score >= 0.5) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="space-y-6">
      {/* Data Quality Overview */}
      <Card padding="md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              <div className="flex items-center gap-2">
                <TrendingUp size={20} />
                Data Quality Assessment
              </div>
            </CardTitle>
            <Badge variant={profile.dataQuality.overall >= 0.8 ? 'success' : 'warning'}>
              {getQualityLabel(profile.dataQuality.overall)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getQualityColor(profile.dataQuality.completeness)}`}>
                {(profile.dataQuality.completeness * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-[var(--color-text-secondary)] mt-1">Completeness</div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                {profile.linkedRecords.length}/5 sources
              </div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getQualityColor(profile.dataQuality.consistency)}`}>
                {(profile.dataQuality.consistency * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-[var(--color-text-secondary)] mt-1">Consistency</div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                {profile.conflicts.length} conflicts
              </div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getQualityColor(profile.dataQuality.accuracy)}`}>
                {(profile.dataQuality.accuracy * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-[var(--color-text-secondary)] mt-1">Accuracy</div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-1">Verified sources</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getQualityColor(profile.dataQuality.overall)}`}>
                {(profile.dataQuality.overall * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-[var(--color-text-secondary)] mt-1">Overall Score</div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-1">Combined rating</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      {profile.aiRecommendations.length > 0 && (
        <Card padding="md">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-purple-500" />
                AI-Powered Recommendations
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.aiRecommendations.map((rec, index) => (
                <Alert 
                  key={index} 
                  variant={rec.confidence >= 0.9 ? 'success' : 'info'}
                  title={`${rec.type.toUpperCase()}: ${rec.field}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm mb-2">{rec.reasoning}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-[var(--color-text-secondary)]">Current:</span>
                            <span className="ml-2 font-medium line-through text-red-600">
                              {String(rec.currentValue)}
                            </span>
                          </div>
                          <div>
                            <span className="text-[var(--color-text-secondary)]">Suggested:</span>
                            <span className="ml-2 font-medium text-green-600">
                              {String(rec.suggestedValue)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-[var(--color-text-secondary)]">
                            Confidence: {(rec.confidence * 100).toFixed(0)}%
                          </span>
                          <span className="text-xs text-[var(--color-text-secondary)]">•</span>
                          <span className="text-xs text-[var(--color-text-secondary)]">
                            Sources: {rec.sources.join(', ')}
                          </span>
                        </div>
                      </div>
                      {onAcceptRecommendation && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onAcceptRecommendation(rec)}
                          className="ml-4"
                        >
                          Accept
                        </Button>
                      )}
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Conflicts */}
      {profile.conflicts.length > 0 && (
        <Card padding="md">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-amber-500" />
                Data Conflicts Detected
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.conflicts.map((conflict, index) => (
                <Alert
                  key={index}
                  variant={conflict.severity === 'critical' ? 'error' : 'warning'}
                  title={`${conflict.field} - ${conflict.severity.toUpperCase()}`}
                >
                  <div className="space-y-3">
                    <p className="text-sm">{conflict.reason}</p>
                    <div className="space-y-2">
                      {conflict.sources.map((source, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-[var(--color-background)] rounded">
                          <div className="flex-1">
                            <span className="text-sm font-medium">{source.source}:</span>
                            <span className="ml-2 text-sm">{String(source.value)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[var(--color-text-secondary)]">
                              {(source.confidence * 100).toFixed(0)}% confident
                            </span>
                            {onResolveConflict && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onResolveConflict(conflict, source.value)}
                              >
                                Use This
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {conflict.aiSuggestion && (
                      <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles size={16} className="text-purple-500" />
                          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                            AI Suggestion
                          </span>
                        </div>
                        <p className="text-sm text-purple-600 dark:text-purple-400">
                          Recommended value: <strong>{String(conflict.aiSuggestion)}</strong>
                        </p>
                      </div>
                    )}
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Linked Records */}
      <Card padding="md">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Database size={20} />
              Linked Records ({profile.linkedRecords.length})
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* NDISE Record */}
            <div className={`p-4 rounded-lg border-2 ${profile.ndise ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-slate-900">National ID</span>
                {profile.ndise ? (
                  <CheckCircle size={16} className="text-green-700" />
                ) : (
                  <XCircle size={16} className="text-slate-400" />
                )}
              </div>
              {profile.ndise ? (
                <div className="text-xs space-y-1">
                  <div className="font-mono text-slate-900">{profile.ndise.nationalID}</div>
                  <div className="text-slate-700">
                    Enrolled: {profile.ndise.enrollmentDate}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-600">Not registered</div>
              )}
            </div>

            {/* Birth Certificate */}
            <div className={`p-4 rounded-lg border-2 ${profile.birthCertificate ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-slate-900">Birth Certificate</span>
                {profile.birthCertificate ? (
                  <CheckCircle size={16} className="text-green-700" />
                ) : (
                  <XCircle size={16} className="text-slate-400" />
                )}
              </div>
              {profile.birthCertificate ? (
                <div className="text-xs space-y-1">
                  <div className="font-mono text-slate-900">{profile.birthCertificate.certificateNumber}</div>
                  <div className="text-slate-700">
                    {profile.birthCertificate.issuingOffice}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-600">Not found</div>
              )}
            </div>

            {/* Passport */}
            <div className={`p-4 rounded-lg border-2 ${profile.passport ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-slate-900">Passport</span>
                {profile.passport ? (
                  <CheckCircle size={16} className="text-green-700" />
                ) : (
                  <XCircle size={16} className="text-slate-400" />
                )}
              </div>
              {profile.passport ? (
                <div className="text-xs space-y-1">
                  <div className="font-mono text-slate-900">{profile.passport.passportNumber}</div>
                  <div className="text-slate-700">
                    Expires: {profile.passport.expiryDate}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-600">Not found</div>
              )}
            </div>

            {/* Driver License */}
            <div className={`p-4 rounded-lg border-2 ${profile.driverLicense ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-slate-900">Driver License</span>
                {profile.driverLicense ? (
                  <CheckCircle size={16} className="text-green-700" />
                ) : (
                  <XCircle size={16} className="text-slate-400" />
                )}
              </div>
              {profile.driverLicense ? (
                <div className="text-xs space-y-1">
                  <div className="font-mono text-slate-900">{profile.driverLicense.licenseNumber}</div>
                  <div className="text-slate-700">
                    Class: {profile.driverLicense.licenseClass}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-600">Not found</div>
              )}
            </div>

            {/* Voter Card */}
            <div className={`p-4 rounded-lg border-2 ${profile.voterCard ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-slate-900">Voter Card</span>
                {profile.voterCard ? (
                  <CheckCircle size={16} className="text-green-700" />
                ) : (
                  <XCircle size={16} className="text-slate-400" />
                )}
              </div>
              {profile.voterCard ? (
                <div className="text-xs space-y-1">
                  <div className="font-mono text-slate-900">{profile.voterCard.voterID}</div>
                  <div className="text-slate-700">
                    {profile.voterCard.county}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-600">Not registered</div>
              )}
            </div>

            {/* Criminal Record */}
            <div className={`p-4 rounded-lg border-2 ${profile.criminalRecord?.hasRecord ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-slate-900">Criminal Record</span>
                {profile.criminalRecord?.hasRecord ? (
                  <AlertTriangle size={16} className="text-red-700" />
                ) : (
                  <CheckCircle size={16} className="text-green-700" />
                )}
              </div>
              {profile.criminalRecord ? (
                <div className="text-xs space-y-1">
                  <div className="text-slate-900">{profile.criminalRecord.hasRecord ? 'Record found' : 'No record'}</div>
                  {profile.criminalRecord.hasRecord && (
                    <div className="text-red-700">
                      Risk: {profile.criminalRecord.riskLevel}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-slate-600">Not checked</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
