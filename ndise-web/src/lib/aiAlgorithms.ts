/**
 * Improved AI Algorithms - Deterministic logic replacing Math.random()
 * These functions provide consistent, explainable results for demos
 */

/**
 * Calculate Levenshtein distance between two strings
 * Used for name similarity matching
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  const matrix: number[][] = [];

  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[s2.length][s1.length];
}

/**
 * Calculate name similarity percentage (0-100)
 */
export function calculateNameSimilarity(name1: string, name2: string): number {
  const distance = levenshteinDistance(name1, name2);
  const maxLength = Math.max(name1.length, name2.length);
  const similarity = ((maxLength - distance) / maxLength) * 100;
  return Math.max(0, Math.min(100, similarity));
}

/**
 * Jaccard similarity for set comparison
 * Used for demographic matching
 */
export function jaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  if (union.size === 0) return 0;
  return (intersection.size / union.size) * 100;
}

/**
 * Simple hash function for biometric simulation
 */
export function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Calculate biometric similarity based on hash comparison
 */
export function calculateBiometricSimilarity(
  biometric1: string[],
  biometric2: string[]
): number {
  if (!biometric1.length || !biometric2.length) return 0;

  // Hash each biometric sample
  const hash1 = biometric1.map(b => simpleHash(b));
  const hash2 = biometric2.map(b => simpleHash(b));

  // Calculate average difference
  const minLength = Math.min(hash1.length, hash2.length);
  let totalDiff = 0;

  for (let i = 0; i < minLength; i++) {
    const diff = Math.abs(hash1[i] - hash2[i]);
    // Normalize difference (assuming hash values can be quite large)
    const normalizedDiff = Math.min(diff / 1000000, 1);
    totalDiff += normalizedDiff;
  }

  const avgDiff = totalDiff / minLength;
  const similarity = (1 - avgDiff) * 100;

  return Math.max(0, Math.min(100, similarity));
}

/**
 * Calculate fingerprint match score deterministically
 */
export function calculateFingerprintMatch(
  personId: string,
  fingerprintData: string
): number {
  // Use person ID and fingerprint data to generate deterministic score
  const combinedHash = simpleHash(personId + fingerprintData);

  // Map hash to range 75-100 (realistic fingerprint match range)
  const score = 75 + (combinedHash % 26);

  // Add small variation based on data quality
  const quality = fingerprintData.length > 50 ? 5 : 0;

  return Math.min(100, score + quality);
}

/**
 * Calculate facial recognition match score deterministically
 */
export function calculateFaceMatch(
  personId: string,
  imageData: string
): number {
  // Use person ID and image data to generate deterministic score
  const combinedHash = simpleHash(personId + imageData);

  // Map hash to range 70-100 (realistic face match range)
  const score = 70 + (combinedHash % 31);

  // Add variation based on image quality
  const quality = imageData.length > 100 ? 5 : imageData.length > 50 ? 3 : 0;

  return Math.min(100, score + quality);
}

export interface RiskFactor {
  factor: string;
  score: number;
  weight: number;
  reason?: string;
}

export interface RiskScore {
  overall: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  breakdown: RiskFactor[];
  confidence: number;
}

/**
 * Calculate comprehensive risk score based on multiple factors
 * This is deterministic and explainable (no Math.random())
 */
export function calculateRiskScore(person: {
  criminalRecord?: { convictions: number; severity: 'low' | 'medium' | 'high' };
  visaStatus?: 'valid' | 'expired' | 'overstayed';
  overstayDays?: number;
  financialFlags?: number;
  travelAnomalies?: number;
  watchList?: boolean;
  biometricMismatch?: boolean;
  documentIssues?: number;
}): RiskScore {
  let totalScore = 0;
  const factors: RiskFactor[] = [];

  // Criminal history (0-30 points)
  if (person.criminalRecord && person.criminalRecord.convictions > 0) {
    const severityMultiplier =
      person.criminalRecord.severity === 'high' ? 3 :
      person.criminalRecord.severity === 'medium' ? 2 : 1;

    const criminalScore = Math.min(
      person.criminalRecord.convictions * 5 * severityMultiplier,
      30
    );

    totalScore += criminalScore;
    factors.push({
      factor: 'Criminal History',
      score: criminalScore,
      weight: 30,
      reason: `${person.criminalRecord.convictions} conviction(s), ${person.criminalRecord.severity} severity`,
    });
  }

  // Visa compliance (0-25 points)
  if (person.visaStatus === 'overstayed' && person.overstayDays) {
    const visaScore = Math.min(person.overstayDays / 10, 25);
    totalScore += visaScore;
    factors.push({
      factor: 'Visa Overstay',
      score: visaScore,
      weight: 25,
      reason: `${person.overstayDays} days overstayed`,
    });
  } else if (person.visaStatus === 'expired') {
    totalScore += 15;
    factors.push({
      factor: 'Expired Visa',
      score: 15,
      weight: 25,
      reason: 'Visa has expired',
    });
  }

  // Financial flags (0-20 points)
  if (person.financialFlags && person.financialFlags > 0) {
    const financialScore = Math.min(person.financialFlags * 5, 20);
    totalScore += financialScore;
    factors.push({
      factor: 'Financial Concerns',
      score: financialScore,
      weight: 20,
      reason: `${person.financialFlags} financial flag(s)`,
    });
  }

  // Travel anomalies (0-15 points)
  if (person.travelAnomalies && person.travelAnomalies > 0) {
    const travelScore = Math.min(person.travelAnomalies * 3, 15);
    totalScore += travelScore;
    factors.push({
      factor: 'Travel Anomalies',
      score: travelScore,
      weight: 15,
      reason: `${person.travelAnomalies} unusual travel pattern(s)`,
    });
  }

  // Watch list (automatic 40 points)
  if (person.watchList) {
    totalScore += 40;
    factors.push({
      factor: 'Watch List Match',
      score: 40,
      weight: 40,
      reason: 'Subject appears on active watch list',
    });
  }

  // Biometric mismatch (20 points)
  if (person.biometricMismatch) {
    totalScore += 20;
    factors.push({
      factor: 'Biometric Mismatch',
      score: 20,
      weight: 20,
      reason: 'Biometric verification failed',
    });
  }

  // Document issues (0-15 points)
  if (person.documentIssues && person.documentIssues > 0) {
    const docScore = Math.min(person.documentIssues * 7, 15);
    totalScore += docScore;
    factors.push({
      factor: 'Document Issues',
      score: docScore,
      weight: 15,
      reason: `${person.documentIssues} document irregularit(ies)`,
    });
  }

  const overall = Math.min(totalScore, 100);
  const level: 'low' | 'medium' | 'high' | 'critical' =
    overall >= 75 ? 'critical' :
    overall >= 50 ? 'high' :
    overall >= 25 ? 'medium' : 'low';

  // Calculate confidence based on number of factors
  const confidence = Math.min(60 + (factors.length * 8), 99);

  return {
    overall,
    level,
    breakdown: factors,
    confidence,
  };
}

/**
 * Detect duplicate records using multiple similarity metrics
 */
export function detectDuplicate(
  person1: {
    name: string;
    dateOfBirth: string;
    nationality: string;
    fingerprints?: string[];
  },
  person2: {
    name: string;
    dateOfBirth: string;
    nationality: string;
    fingerprints?: string[];
  }
): {
  isDuplicate: boolean;
  confidence: number;
  reasons: string[];
} {
  let totalScore = 0;
  const reasons: string[] = [];

  // Name similarity (40% weight)
  const nameSim = calculateNameSimilarity(person1.name, person2.name);
  totalScore += nameSim * 0.4;
  if (nameSim > 80) {
    reasons.push(`Name similarity: ${nameSim.toFixed(1)}%`);
  }

  // Date of birth match (20% weight)
  const dobMatch = person1.dateOfBirth === person2.dateOfBirth ? 100 : 0;
  totalScore += dobMatch * 0.2;
  if (dobMatch === 100) {
    reasons.push('Exact date of birth match');
  }

  // Nationality match (10% weight)
  const nationalityMatch = person1.nationality === person2.nationality ? 100 : 0;
  totalScore += nationalityMatch * 0.1;

  // Biometric similarity (30% weight)
  if (person1.fingerprints && person2.fingerprints) {
    const bioSim = calculateBiometricSimilarity(person1.fingerprints, person2.fingerprints);
    totalScore += bioSim * 0.3;
    if (bioSim > 90) {
      reasons.push(`Fingerprint match: ${bioSim.toFixed(1)}%`);
    }
  }

  const isDuplicate = totalScore >= 75; // 75% threshold for duplicate

  return {
    isDuplicate,
    confidence: Math.min(99, totalScore),
    reasons,
  };
}

/**
 * Extract entities from natural language query
 */
export function extractEntities(query: string): {
  names: string[];
  dates: string[];
  locations: string[];
  numbers: string[];
} {
  const lowerQuery = query.toLowerCase();

  // Simple name extraction (capitalized words)
  const namePattern = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g;
  const names = query.match(namePattern) || [];

  // Date extraction
  const datePattern = /\b\d{4}-\d{2}-\d{2}\b|\b\d{2}\/\d{2}\/\d{4}\b/g;
  const dates = query.match(datePattern) || [];

  // Location keywords
  const locationKeywords = ['monrovia', 'gbarnga', 'buchanan', 'ganta', 'voinjama', 'nigeria', 'ghana', 'liberia'];
  const locations = locationKeywords.filter(loc => lowerQuery.includes(loc));

  // Numbers
  const numberPattern = /\b\d+\b/g;
  const numbers = query.match(numberPattern) || [];

  return { names, dates, locations, numbers };
}

/**
 * Classify query intent
 */
export function classifyIntent(query: string): {
  intent: 'search' | 'compare' | 'alert' | 'analyze' | 'report';
  confidence: number;
  keywords: string[];
} {
  const lowerQuery = query.toLowerCase();
  const keywords: string[] = [];

  // Search intent
  if (lowerQuery.includes('find') || lowerQuery.includes('search') || lowerQuery.includes('who is') || lowerQuery.includes('show me')) {
    keywords.push(...['find', 'search', 'show'].filter(k => lowerQuery.includes(k)));
    return { intent: 'search', confidence: 85, keywords };
  }

  // Compare intent
  if (lowerQuery.includes('compare') || lowerQuery.includes('difference') || lowerQuery.includes('vs')) {
    keywords.push(...['compare', 'difference', 'vs'].filter(k => lowerQuery.includes(k)));
    return { intent: 'compare', confidence: 90, keywords };
  }

  // Alert intent
  if (lowerQuery.includes('alert') || lowerQuery.includes('flag') || lowerQuery.includes('watch')) {
    keywords.push(...['alert', 'flag', 'watch'].filter(k => lowerQuery.includes(k)));
    return { intent: 'alert', confidence: 88, keywords };
  }

  // Analyze intent
  if (lowerQuery.includes('pattern') || lowerQuery.includes('trend') || lowerQuery.includes('analyze')) {
    keywords.push(...['pattern', 'trend', 'analyze'].filter(k => lowerQuery.includes(k)));
    return { intent: 'analyze', confidence: 87, keywords };
  }

  // Report intent
  if (lowerQuery.includes('report') || lowerQuery.includes('how many') || lowerQuery.includes('statistics')) {
    keywords.push(...['report', 'statistics', 'how many'].filter(k => lowerQuery.includes(k)));
    return { intent: 'report', confidence: 83, keywords };
  }

  // Default to search
  return { intent: 'search', confidence: 60, keywords: [] };
}
