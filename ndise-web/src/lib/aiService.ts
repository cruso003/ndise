/**
 * AI Service Layer - The Intelligence Brain of NDISE
 * 
 * This service provides 8 core AI capabilities:
 * 1. Duplicate Detection (Biometric + Demographic)
 * 2. Pattern Recognition (Behavioral analysis)
 * 3. Relationship Mapping (Network analysis)
 * 4. Predictive Analytics (Forecasting)
 * 5. Anomaly Detection (Outlier identification)
 * 6. Smart Consolidation (Data fusion)
 * 7. Natural Language Queries (Conversational AI)
 * 8. Risk Scoring (Automated assessment)
 */



// ============================================
// 1. DUPLICATE DETECTION
// ============================================

export interface DuplicateDetectionResult {
  isDuplicate: boolean;
  confidence: number; // 0-100
  matches: Array<{
    personId: string;
    name: string;
    matchScore: number;
    biometricMatch?: number;
    demographicMatch?: number;
    factors: string[];
  }>;
  aiReasoning: string;
  recommendation: 'approve' | 'review' | 'reject';
}

export function detectDuplicates(
  _fingerprints: string[],
  _facePhoto: string,
  demographicData: {
    name: string;
    dob: string;
    motherName?: string;
    fatherName?: string;
  }
): DuplicateDetectionResult {
  // Simulate AI biometric matching
  const biometricScore = Math.random() * 100;
  
  // Simulate demographic fuzzy matching
  const demographicScore = calculateDemographicSimilarity(demographicData);
  
  // AI fusion: combine scores
  const overallConfidence = (biometricScore * 0.6) + (demographicScore * 0.4);
  
  const isDuplicate = overallConfidence > 70;
  
  return {
    isDuplicate,
    confidence: Math.round(overallConfidence),
    matches: isDuplicate ? [{
      personId: '1990010112345679',
      name: 'John K. Doe',
      matchScore: Math.round(overallConfidence),
      biometricMatch: Math.round(biometricScore),
      demographicMatch: Math.round(demographicScore),
      factors: [
        'Fingerprint match on right thumb (92%)',
        'Face similarity (85%)',
        'Name variation detected',
        'Same date of birth',
        'Mother name matches'
      ]
    }] : [],
    aiReasoning: isDuplicate 
      ? `High confidence duplicate detected. Biometric analysis shows ${Math.round(biometricScore)}% match, combined with ${Math.round(demographicScore)}% demographic similarity. Recommend human review.`
      : 'No significant matches found. Person appears to be unique in the system.',
    recommendation: overallConfidence > 90 ? 'reject' : overallConfidence > 70 ? 'review' : 'approve'
  };
}

function calculateDemographicSimilarity(_data: any): number {
  // Simplified fuzzy matching
  return Math.random() * 50 + 30; // 30-80
}

// ============================================
// 2. PATTERN RECOGNITION
// ============================================

export interface PatternDetection {
  id: string;
  type: 'coordinated_activity' | 'border_anomaly' | 'fraud_network' | 'ghost_identity' | 'document_forgery';
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  affectedPersons: number;
  location?: string;
  timestamp: string;
  evidence: Array<{
    type: string;
    description: string;
    confidence: number;
  }>;
  aiRecommendation: string;
  actionItems: string[];
}

export function analyzePatterns(_timeframe: 'day' | 'week' | 'month' = 'day'): PatternDetection[] {
  // This would normally query the database and run ML models
  // For now, return mock patterns from data file
  return [
    {
      id: 'pattern-001',
      type: 'coordinated_activity',
      confidence: 94,
      severity: 'critical',
      title: 'Coordinated SIM Purchases Detected',
      description: '15 foreigners purchased SIM cards within 30 minutes at the same location',
      affectedPersons: 15,
      location: 'Monrovia Central Market',
      timestamp: new Date().toISOString(),
      evidence: [
        {
          type: 'temporal_clustering',
          description: 'All purchases within 30-minute window',
          confidence: 97
        },
        {
          type: 'demographic_pattern',
          description: 'All purchasers are foreign nationals with tourist visas',
          confidence: 100
        },
        {
          type: 'geospatial_clustering',
          description: 'Same registration location (GPS coordinates match)',
          confidence: 95
        }
      ],
      aiRecommendation: 'Investigate for potential human trafficking or organized crime network',
      actionItems: [
        'Review foreigner profiles for visa compliance',
        'Check for shared addresses or contacts',
        'Monitor SIM activity patterns',
        'Alert Investigation Unit'
      ]
    },
    {
      id: 'pattern-002',
      type: 'border_anomaly',
      confidence: 89,
      severity: 'high',
      title: 'Border Traffic Surge Detected',
      description: '340% increase in border crossings at Bo Waterside compared to historical average',
      affectedPersons: 234,
      location: 'Bo Waterside (Ghana border)',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      evidence: [
        {
          type: 'statistical_anomaly',
          description: 'Traffic 3.4x higher than 30-day average',
          confidence: 92
        },
        {
          type: 'demographic_skew',
          description: 'Predominantly young males (ages 20-35)',
          confidence: 85
        }
      ],
      aiRecommendation: 'Deploy additional border security resources and investigate cause',
      actionItems: [
        'Alert border control to increase screening',
        'Check for organized migration events',
        'Review visa compliance rates',
        'Coordinate with Ghana authorities'
      ]
    }
  ];
}

// ============================================
// 3. RELATIONSHIP MAPPING
// ============================================

export interface RelationshipNode {
  id: string;
  name: string;
  type: 'citizen' | 'foreigner' | 'business';
  riskLevel?: 'low' | 'medium' | 'high';
}

export interface RelationshipEdge {
  source: string;
  target: string;
  relationshipType: 'family' | 'business' | 'phone_contact' | 'co_travel' | 'shared_address' | 'financial';
  strength: number; // 0-100
  confidence: number;
  evidence: string[];
}

export interface NetworkMap {
  centerNode: RelationshipNode;
  nodes: RelationshipNode[];
  edges: RelationshipEdge[];
  aiInsights: {
    clusterCount: number;
    highRiskConnections: number;
    keyFindings: string[];
    recommendation: string;
  };
}

export function mapRelationships(
  personId: string,
  _depth: number = 2,
  _includeTypes: string[] = ['all']
): NetworkMap {
  // Mock network - in production, this would query graph database
  return {
    centerNode: {
      id: personId,
      name: 'John Kwame Doe',
      type: 'citizen',
      riskLevel: 'medium'
    },
    nodes: [
      { id: '1992030112345678', name: 'Jane Doe', type: 'citizen', riskLevel: 'low' },
      { id: 'FID-2025-NGR-001', name: 'Adeola Okoye', type: 'foreigner', riskLevel: 'medium' },
      { id: '1985050112345670', name: 'Michael Johnson', type: 'citizen', riskLevel: 'high' },
    ],
    edges: [
      {
        source: personId,
        target: '1992030112345678',
        relationshipType: 'family',
        strength: 100,
        confidence: 100,
        evidence: ['Marriage certificate', 'Same address', 'Joint bank account']
      },
      {
        source: personId,
        target: 'FID-2025-NGR-001',
        relationshipType: 'business',
        strength: 75,
        confidence: 85,
        evidence: ['Same employer', 'Frequent phone contact', 'Co-travel records']
      },
      {
        source: personId,
        target: '1985050112345670',
        relationshipType: 'phone_contact',
        strength: 45,
        confidence: 70,
        evidence: ['Call frequency analysis', 'Text message patterns']
      }
    ],
    aiInsights: {
      clusterCount: 1,
      highRiskConnections: 1,
      keyFindings: [
        'One connection has criminal record',
        'Business associate has visa compliance issues',
        'Strong family cluster detected',
        'No evidence of organized crime network'
      ],
      recommendation: 'Monitor business associate (Adeola Okoye) for visa compliance. No immediate action required for subject.'
    }
  };
}

// ============================================
// 4. PREDICTIVE ANALYTICS
// ============================================

export interface PredictionResult {
  prediction: string;
  confidence: number;
  model: string;
  factors: Array<{
    factor: string;
    weight: number;
    value: any;
  }>;
  timeframe?: string;
}

export function predictOverstayRisk(_foreignerId: string): PredictionResult {
  // Simulate ML model prediction
  const riskScore = Math.random() * 100;
  
  return {
    prediction: riskScore > 70 ? 'HIGH_RISK' : riskScore > 40 ? 'MEDIUM_RISK' : 'LOW_RISK',
    confidence: 82,
    model: 'Overstay Prediction Model v2.1',
    factors: [
      { factor: 'Nationality overstay rate', weight: 0.25, value: '12% (Nigerian avg)' },
      { factor: 'Visa type', weight: 0.20, value: 'Tourist visa (higher risk)' },
      { factor: 'Previous compliance', weight: 0.20, value: 'No history' },
      { factor: 'Financial indicators', weight: 0.15, value: 'No local bank account' },
      { factor: 'Social ties', weight: 0.10, value: 'No family in Liberia' },
      { factor: 'Employment', weight: 0.10, value: 'No job verification' }
    ]
  };
}

export function forecastEnrollmentDemand(_location: string, days: number = 30): PredictionResult {
  const dailyAvg = 150 + Math.random() * 50;
  
  return {
    prediction: `${Math.round(dailyAvg * days)} enrollments expected`,
    confidence: 76,
    model: 'Enrollment Demand Forecasting Model v1.3',
    factors: [
      { factor: 'Historical average', weight: 0.40, value: `${Math.round(dailyAvg)}/day` },
      { factor: 'Seasonal trend', weight: 0.25, value: 'Peak season (+15%)' },
      { factor: 'Marketing campaigns', weight: 0.20, value: 'Active campaign' },
      { factor: 'Population coverage', weight: 0.15, value: '72% enrolled locally' }
    ],
    timeframe: `Next ${days} days`
  };
}

// ============================================
// 5. ANOMALY DETECTION
// ============================================

export interface AnomalyAlert {
  id: string;
  personId: string;
  personName: string;
  anomalyType: 'identity_theft' | 'fraud_pattern' | 'behavioral' | 'document_irregularity';
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  findings: string[];
  aiRecommendation: string;
  suggestedActions: string[];
  detectedAt: string;
}

export function detectAnomalies(_personId?: string): AnomalyAlert[] {
  // In production, this would run continuously and store alerts
  return [
    {
      id: 'anomaly-001',
      personId: '1990010112345678',
      personName: 'John Kwame Doe',
      anomalyType: 'identity_theft',
      confidence: 91,
      severity: 'critical',
      description: 'Suspicious identity activity detected',
      findings: [
        'Person inactive for 5 years (no border crossings, no service requests)',
        'Suddenly 8 SIM cards registered in one day',
        'Registration location different from registered address',
        'Pattern matches known identity theft cases'
      ],
      aiRecommendation: 'Possible identity theft. Suspend SIM cards and contact person for verification.',
      suggestedActions: [
        'Suspend all newly registered SIMs immediately',
        'Contact person via phone/email for verification',
        'Investigate SIM registration location',
        'Review recent document requests',
        'Flag for fraud investigation'
      ],
      detectedAt: new Date().toISOString()
    }
  ];
}

// ============================================
// 6. SMART CONSOLIDATION (already exists in apiIntegration.ts)
// ============================================
// This is the consolidatePersonData function we already built

// ============================================
// 7. NATURAL LANGUAGE QUERIES
// ============================================

export interface NLQueryResult {
  query: string;
  interpretation: string;
  results: any;
  confidence: number;
  suggestions?: string[];
}

export async function processNaturalLanguageQuery(query: string): Promise<NLQueryResult> {
  // Simplified NLP processing
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('overstay') && lowerQuery.includes('sim')) {
    return {
      query,
      interpretation: 'Finding foreigners who overstayed and have active SIM cards',
      results: {
        count: 23,
        persons: [
          { name: 'Ahmed Hassan', days_overstayed: 45, sims_active: 2 },
          { name: 'Chen Wei', days_overstayed: 62, sims_active: 1 }
        ]
      },
      confidence: 95,
      suggestions: [
        'Show only overstays > 60 days',
        'Filter by nationality',
        'Include those with suspended SIMs'
      ]
    };
  }
  
  if (lowerQuery.includes('enrolled') && lowerQuery.includes('month')) {
    return {
      query,
      interpretation: 'Comparing enrollment numbers this month vs last month',
      results: {
        this_month: 45678,
        last_month: 38456,
        change: '+18.8%',
        trend: 'increasing'
      },
      confidence: 98
    };
  }
  
  return {
    query,
    interpretation: 'Could not understand query. Please rephrase.',
    results: null,
    confidence: 0,
    suggestions: [
      'Show me overstays',
      'How many enrollments this month',
      'Find patterns in SIM fraud'
    ]
  };
}

// ============================================
// 8. RISK SCORING
// ============================================

export interface RiskScoreResult {
  personId: string;
  overallScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  breakdown: {
    criminal: { score: number; weight: number; status: string };
    visaCompliance: { score: number; weight: number; status: string };
    financial: { score: number; weight: number; status: string };
    associations: { score: number; weight: number; status: string };
    documents: { score: number; weight: number; status: string };
    behavior: { score: number; weight: number; status: string };
  };
  recommendations: string[];
  lastUpdated: string;
}

export function calculateRiskScore(
  personId: string,
  personType: 'citizen' | 'foreigner'
): RiskScoreResult {
  // Simulate AI risk calculation
  const scores = {
    criminal: Math.random() * 30, // 0-30 points
    visaCompliance: personType === 'foreigner' ? Math.random() * 25 : 0, // 0-25
    financial: Math.random() * 15, // 0-15
    associations: Math.random() * 15, // 0-15
    documents: Math.random() * 10, // 0-10
    behavior: Math.random() * 5 // 0-5
  };
  
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  
  return {
   personId,
    overallScore: Math.round(totalScore),
    riskLevel: totalScore > 70 ? 'critical' : totalScore > 50 ? 'high' : totalScore > 30 ? 'medium' : 'low',
    breakdown: {
      criminal: {
        score: Math.round(scores.criminal),
        weight: 30,
        status: scores.criminal > 15 ? 'Criminal history found' : 'No criminal record'
      },
      visaCompliance: {
        score: Math.round(scores.visaCompliance),
        weight: 25,
        status: scores.visaCompliance > 12 ? 'Overstay detected' : 'Compliant'
      },
      financial: {
        score: Math.round(scores.financial),
        weight: 15,
        status: scores.financial > 7 ? 'No bank account' : 'Normal'
      },
      associations: {
        score: Math.round(scores.associations),
        weight: 15,
        status: scores.associations > 7 ? 'Connected to known offenders' : 'Normal'
      },
      documents: {
        score: Math.round(scores.documents),
        weight: 10,
        status: scores.documents > 5 ? 'Document discrepancies' : 'Verified'
      },
      behavior: {
        score: Math.round(scores.behavior),
        weight: 5,
        status: scores.behavior > 2 ? 'Unusual patterns' : 'Normal'
      }
    },
    recommendations: totalScore > 70 ? [
      'Deny visa extension',
      'Issue deportation notice',
      'Monitor associates',
      'Alert border control'
    ] : totalScore > 50 ? [
      'Enhanced monitoring',
      'Verify employment',
      'Review documents'
    ] : [
      'Continue routine monitoring'
    ],
    lastUpdated: new Date().toISOString()
  };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function getAIConfidenceColor(confidence: number): string {
  if (confidence >= 90) return 'text-green-600';
  if (confidence >= 70) return 'text-yellow-600';
  if (confidence >= 50) return 'text-orange-600';
  return 'text-red-600';
}

export function getAIConfidenceLabel(confidence: number): string {
  if (confidence >= 90) return 'Very High';
  if (confidence >= 70) return 'High';
  if (confidence >= 50) return 'Medium';
  return 'Low';
}
