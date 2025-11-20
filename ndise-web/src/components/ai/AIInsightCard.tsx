import { Brain, AlertTriangle, TrendingUp } from 'lucide-react';
import type { PatternDetection, AnomalyAlert } from '../../lib/aiService';

interface AIInsightCardProps {
  insights: (PatternDetection |  AnomalyAlert)[];
  maxDisplay?: number;
}

export default function AIInsightCard({ insights, maxDisplay = 3 }: AIInsightCardProps) {
  const isPatternDetection = (insight: PatternDetection | AnomalyAlert): insight is PatternDetection => {
    return 'title' in insight;
  };
  
  const getSeverityColor = (severity: 'low' | 'medium' | 'high' | 'critical') => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'high':
        return 'bg-orange-50 border-orange-200 text-orange-900';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      case 'low':
        return 'bg-blue-50 border-blue-200 text-blue-900';
    }
  };
  
  const getSeverityBadge = (severity: 'low' | 'medium' | 'high' | 'critical') => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200 shadow-sm">
      <div className="px-6 py-4 border-b border-blue-200">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900">🤖 AI Intelligence Insights</h2>
        </div>
        <p className="text-sm text-slate-600 mt-1">
          AI-detected patterns and anomalies requiring attention
        </p>
      </div>
      
      <div className="p-6">
        {insights.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No significant patterns detected</p>
            <p className="text-xs mt-1">AI continues monitoring in real-time</p>
          </div>
        ) : (
          <div className="space-y-3">
            { insights.slice(0, maxDisplay).map((insight, idx) => (
              <div
                key={idx}
                className={`border rounded-lg p-4 ${getSeverityColor(insight.severity)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4" />
                      <h4 className="font-semibold text-sm">
                        {isPatternDetection(insight) ? insight.title : insight.description}
                      </h4>
                    </div>
                    <p className="text-xs opacity-90">
                      {isPatternDetection(insight) 
                        ? insight.description 
                        : `Person: ${insight.personName}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityBadge(insight.severity)}`}>
                      {insight.severity.toUpperCase()}
                    </div>
                    <div className="text-xs font-semibold bg-white/50 px-2 py-1 rounded">
                      {insight.confidence}% AI
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 bg-white/70 rounded p-2">
                  <div className="text-xs font-semibold mb-1">🤖 AI Recommendation:</div>
                  <div className="text-xs">
                    {isPatternDetection(insight) 
                      ? insight.aiRecommendation 
                      : insight.aiRecommendation}
                  </div>
                </div>
                
                <div className="mt-2 flex gap-2">
                  <button className="flex-1 bg-white/80 hover:bg-white text-xs font-medium py-2 rounded shadow-sm transition-colors">
                    View Details
                  </button>
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 rounded shadow-sm transition-colors">
                    Take Action
                  </button>
                </div>
              </div>
            ))}
            
            {insights.length > maxDisplay && (
              <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium mt-2">
                View all {insights.length} AI insights →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
