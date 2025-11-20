// Mock API service for identity consolidation
// In production, these would be real API calls to government agencies

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  confidence?: number;
  source: string;
  timestamp: string;
}

export interface BirthCertificateRecord {
  certificateNumber: string;
  fullName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: string;
  fatherName: string;
  motherName: string;
  registrationDate: string;
  issuingOffice: string;
  verified: boolean;
}

export interface PassportRecord {
  passportNumber: string;
  fullName: string;
  dateOfBirth: string;
  gender?: string;
  nationality: string;
  issueDate: string;
  expiryDate: string;
  placeOfIssue: string;
  photo?: string;
}

export interface DriverLicenseRecord {
  licenseNumber: string;
  fullName: string;
  dateOfBirth: string;
  address: string;
  issueDate: string;
  expiryDate: string;
  licenseClass: string;
  photo?: string;
}

export interface VoterCardRecord {
  voterID: string;
  fullName: string;
  dateOfBirth: string;
  county: string;
  district: string;
  pollingStation: string;
  registrationDate: string;
}

export interface CriminalRecord {
  hasRecord: boolean;
  arrests?: number;
  convictions?: number;
  activeWarrants?: number;
  lastIncidentDate?: string;
  riskLevel?: 'low' | 'medium' | 'high';
}

export interface NDISERecord {
  nationalID: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phone: string;
  email?: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'suspended';
  biometricQuality: number;
  photo?: string;
}

export interface DuplicateMatch {
  nationalID: string;
  fullName: string;
  dateOfBirth: string;
  matchScore: number;
  matchType: 'biometric' | 'demographic' | 'both';
  photo?: string;
  details: string;
}

export interface ConsolidatedProfile {
  ndise?: NDISERecord;
  birthCertificate?: BirthCertificateRecord;
  passport?: PassportRecord;
  driverLicense?: DriverLicenseRecord;
  voterCard?: VoterCardRecord;
  criminalRecord?: CriminalRecord;
  linkedRecords: string[];
  dataQuality: {
    completeness: number;
    consistency: number;
    accuracy: number;
    overall: number;
  };
  conflicts: DataConflict[];
  aiRecommendations: AIRecommendation[];
}

export interface DataConflict {
  field: string;
  sources: {
    source: string;
    value: any;
    confidence: number;
  }[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  aiSuggestion?: any;
  reason: string;
}

export interface AIRecommendation {
  type: 'correction' | 'merge' | 'flag' | 'verify';
  field: string;
  currentValue: any;
  suggestedValue: any;
  confidence: number;
  reasoning: string;
  sources: string[];
}

// Mock API Services
class CivilRegistryAPI {
  async verifyBirthCertificate(certificateNumber: string): Promise<APIResponse<BirthCertificateRecord>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data
    return {
      success: true,
      data: {
        certificateNumber,
        fullName: 'John Doe',
        dateOfBirth: '1990-05-15',
        placeOfBirth: 'Monrovia',
        gender: 'Male',
        fatherName: 'James Doe',
        motherName: 'Mary Doe',
        registrationDate: '1990-06-01',
        issuingOffice: 'Monrovia Central Registry',
        verified: true,
      },
      confidence: 0.95,
      source: 'Civil Registry',
      timestamp: new Date().toISOString(),
    };
  }

  async searchByName(name: string, dob: string): Promise<APIResponse<BirthCertificateRecord[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock search logic
    const mockRecord = {
        certificateNumber: 'BC-1990-12345',
        fullName: 'John Doe',
        dateOfBirth: '1990-05-15',
        placeOfBirth: 'Monrovia',
        gender: 'Male',
        fatherName: 'James Doe',
        motherName: 'Mary Doe',
        registrationDate: '1990-06-01',
        issuingOffice: 'Monrovia Central Registry',
        verified: true,
    };

    const nameMatch = name.toLowerCase().includes('john') || name.toLowerCase().includes('doe');
    const dobMatch = dob === mockRecord.dateOfBirth;

    if (nameMatch && dobMatch) {
        return {
            success: true,
            data: [mockRecord],
            source: 'Civil Registry',
            timestamp: new Date().toISOString(),
        };
    }

    return {
      success: true,
      data: [],
      source: 'Civil Registry',
      timestamp: new Date().toISOString(),
    };
  }
}

class ImmigrationAPI {
  async searchPassport(_name: string, _dob: string): Promise<APIResponse<PassportRecord | null>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: null, // No passport found
      source: 'Immigration',
      timestamp: new Date().toISOString(),
    };
  }

  async verifyPassport(passportNumber: string): Promise<APIResponse<PassportRecord>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: {
        passportNumber,
        fullName: 'John Doe',
        dateOfBirth: '1990-05-15',
        gender: 'Male',
        nationality: 'Liberian',
        issueDate: '2020-01-15',
        expiryDate: '2030-01-15',
        placeOfIssue: 'Monrovia',
      },
      confidence: 0.98,
      source: 'Immigration',
      timestamp: new Date().toISOString(),
    };
  }
}

class DVAAPI {
  async searchDriverLicense(_name: string, _dob: string): Promise<APIResponse<DriverLicenseRecord | null>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: null,
      source: 'Driver & Vehicle Authority',
      timestamp: new Date().toISOString(),
    };
  }
}

class NECAPI {
  async searchVoterCard(_name: string, _dob: string): Promise<APIResponse<VoterCardRecord | null>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: null,
      source: 'National Elections Commission',
      timestamp: new Date().toISOString(),
    };
  }
}

class PoliceAPI {
  async checkCriminalRecord(_name: string, _dob: string): Promise<APIResponse<CriminalRecord>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: {
        hasRecord: false,
        arrests: 0,
        convictions: 0,
        activeWarrants: 0,
        riskLevel: 'low',
      },
      source: 'Police',
      timestamp: new Date().toISOString(),
    };
  }
}

class NDISEAPI {
  async searchByBiometric(_fingerprints: any): Promise<APIResponse<DuplicateMatch[]>> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock: Return potential duplicates
    return {
      success: true,
      data: [
        {
          nationalID: 'LBR-2023-001234',
          fullName: 'John M. Doe',
          dateOfBirth: '1990-05-15',
          matchScore: 0.87,
          matchType: 'biometric',
          details: 'Fingerprint match: 8/10 fingers',
        },
      ],
      source: 'NDISE',
      timestamp: new Date().toISOString(),
    };
  }

  async searchByDemographic(name: string, dob: string, _phone?: string): Promise<APIResponse<DuplicateMatch[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockMatch: DuplicateMatch = {
          nationalID: 'LBR-2023-001234',
          fullName: 'John M. Doe',
          dateOfBirth: '1990-05-15',
          matchScore: 0.87,
          matchType: 'demographic',
          details: 'Demographic match: Name and DOB',
    };

    const nameMatch = name.toLowerCase().includes('john') || name.toLowerCase().includes('doe');
    const dobMatch = dob === mockMatch.dateOfBirth;

    if (nameMatch && dobMatch) {
        return {
            success: true,
            data: [mockMatch],
            source: 'NDISE',
            timestamp: new Date().toISOString(),
        };
    }

    return {
      success: true,
      data: [],
      source: 'NDISE',
      timestamp: new Date().toISOString(),
    };
  }

  async getProfile(nationalID: string): Promise<APIResponse<NDISERecord>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: {
        nationalID,
        fullName: 'John Doe',
        dateOfBirth: '1990-05-15',
        gender: 'Male',
        address: '123 Main St, Monrovia',
        phone: '+231 777 123 456',
        enrollmentDate: '2024-01-15',
        status: 'active',
        biometricQuality: 0.92,
      },
      source: 'NDISE',
      timestamp: new Date().toISOString(),
    };
  }
}

// AI-Powered Data Consolidation Service
class AIConsolidationService {
  /**
   * Consolidate data from multiple sources and detect conflicts using robust matching
   */
  async consolidateIdentity(data: {
    enrollment?: any;
    birthCert?: BirthCertificateRecord;
    passport?: PassportRecord;
    driverLicense?: DriverLicenseRecord;
    voterCard?: VoterCardRecord;
    ndise?: NDISERecord;
    biometrics?: any;
  }): Promise<ConsolidatedProfile> {
    const conflicts: DataConflict[] = [];
    const recommendations: AIRecommendation[] = [];

    // ROBUST MATCHING: Use biometric + demographic scoring
    // Name alone is NOT sufficient for conflict detection
    
    // 1. Biometric Matching Score (if available)
    const biometricScore = data.biometrics ? this.calculateBiometricMatch(data) : null;
    
    // 2. Demographic Matching Score
    const demographicScore = this.calculateDemographicMatch(data);
    
    // 3. Document Verification Score
    const documentScore = this.calculateDocumentScore(data);
    
    // Combined confidence score
    const overallMatchConfidence = this.calculateOverallConfidence(
      biometricScore,
      demographicScore,
      documentScore
    );

    // Only flag conflicts if MULTIPLE indicators suggest different persons
    // Name variation alone (e.g., "John Doe" vs "John M. Doe") is NOT a conflict
    
    // Check for CRITICAL conflicts (likely different persons)
    if (overallMatchConfidence < 0.7) {
      // DOB mismatch is critical
      const dobs = [
        { source: 'Enrollment', value: data.enrollment?.dateOfBirth, weight: 0.7 },
        { source: 'Birth Certificate', value: data.birthCert?.dateOfBirth, weight: 1.0 }, // Most authoritative
        { source: 'Passport', value: data.passport?.dateOfBirth, weight: 0.9 },
        { source: 'NDISE', value: data.ndise?.dateOfBirth, weight: 0.8 },
      ].filter(d => d.value);

      const uniqueDOBs = [...new Set(dobs.map(d => d.value))];
      if (uniqueDOBs.length > 1) {
        // Calculate weighted consensus
        const weightedDOB = this.getWeightedConsensus(dobs);
        
        conflicts.push({
          field: 'dateOfBirth',
          sources: dobs.map(d => ({ source: d.source, value: d.value, confidence: d.weight })),
          severity: 'critical',
          aiSuggestion: weightedDOB,
          reason: 'Date of birth mismatch detected across multiple sources. Birth certificate is most authoritative.',
        });

        recommendations.push({
          type: 'correction',
          field: 'dateOfBirth',
          currentValue: data.enrollment?.dateOfBirth,
          suggestedValue: weightedDOB,
          confidence: 0.95,
          reasoning: 'Birth certificate is the legal authoritative source for date of birth',
          sources: ['Birth Certificate'],
        });
      }

      // Gender mismatch is critical
      const genders = [
        { source: 'Enrollment', value: data.enrollment?.gender, weight: 0.7 },
        { source: 'Birth Certificate', value: data.birthCert?.gender, weight: 1.0 },
        { source: 'Passport', value: data.passport?.gender, weight: 0.9 },
        { source: 'NDISE', value: data.ndise?.gender, weight: 0.8 },
      ].filter(g => g.value);

      const uniqueGenders = [...new Set(genders.map(g => g.value))];
      if (uniqueGenders.length > 1) {
        const weightedGender = this.getWeightedConsensus(genders);
        
        conflicts.push({
          field: 'gender',
          sources: genders.map(g => ({ source: g.source, value: g.value, confidence: g.weight })),
          severity: 'critical',
          aiSuggestion: weightedGender,
          reason: 'Gender mismatch - likely indicates different persons or data entry error',
        });
      }
    }

    // Check for MEDIUM severity conflicts (data quality issues)
    // Name variations are OK if other factors match
    const names = [
      { source: 'Enrollment', value: data.enrollment?.fullName, weight: 0.7 },
      { source: 'Birth Certificate', value: data.birthCert?.fullName, weight: 1.0 },
      { source: 'Passport', value: data.passport?.fullName, weight: 0.9 },
      { source: 'Driver License', value: data.driverLicense?.fullName, weight: 0.8 },
      { source: 'NDISE', value: data.ndise?.fullName, weight: 0.8 },
    ].filter(n => n.value);

    if (names.length > 1) {
      // Use fuzzy matching for names
      const nameSimilarity = this.calculateNameSimilarity(names.map(n => n.value));
      
      // Only flag if names are significantly different AND other factors don't match
      if (nameSimilarity < 0.7 && overallMatchConfidence < 0.8) {
        const weightedName = this.getWeightedConsensus(names);
        
        conflicts.push({
          field: 'fullName',
          sources: names.map(n => ({ source: n.source, value: n.value, confidence: n.weight })),
          severity: 'medium',
          aiSuggestion: weightedName,
          reason: 'Name variation detected. Consider standardizing to official document name.',
        });

        recommendations.push({
          type: 'correction',
          field: 'fullName',
          currentValue: data.enrollment?.fullName,
          suggestedValue: weightedName,
          confidence: 0.75,
          reasoning: 'Standardize to official government document name (Birth Certificate/Passport)',
          sources: names.map(n => n.source),
        });
      } else if (nameSimilarity >= 0.7 && nameSimilarity < 0.95) {
        // Minor name variation (e.g., middle initial) - just recommend, don't conflict
        const weightedName = this.getWeightedConsensus(names);
        
        recommendations.push({
          type: 'verify',
          field: 'fullName',
          currentValue: data.enrollment?.fullName,
          suggestedValue: weightedName,
          confidence: 0.6,
          reasoning: 'Minor name variation detected (e.g., middle initial). Verify with citizen.',
          sources: names.map(n => n.source),
        });
      }
    }

    // Calculate data quality scores
    const completeness = this.calculateCompleteness(data);
    const consistency = this.calculateConsistency(conflicts, overallMatchConfidence);
    const accuracy = this.calculateAccuracy(data, documentScore);
    const overall = (completeness + consistency + accuracy) / 3;

    return {
      ndise: data.ndise,
      birthCertificate: data.birthCert,
      passport: data.passport,
      driverLicense: data.driverLicense,
      voterCard: data.voterCard,
      linkedRecords: Object.keys(data).filter(k => data[k as keyof typeof data] && k !== 'biometrics'),
      dataQuality: {
        completeness,
        consistency,
        accuracy,
        overall,
      },
      conflicts,
      aiRecommendations: recommendations,
    };
  }

  /**
   * Calculate biometric match score (fingerprint + face)
   */
  private calculateBiometricMatch(data: any): number {
    // In production, this would use actual biometric matching algorithms
    // For now, simulate based on data availability
    if (!data.biometrics) return 0;
    
    // Simulate fingerprint match score (0-1)
    const fingerprintScore = 0.92; // Mock: 92% match
    
    // Simulate face match score (0-1)
    const faceScore = 0.88; // Mock: 88% match
    
    // Combined biometric score (weighted average)
    return (fingerprintScore * 0.7) + (faceScore * 0.3);
  }

  /**
   * Calculate demographic match score (DOB, gender, location)
   */
  private calculateDemographicMatch(data: any): number {
    let score = 0;
    let factors = 0;

    // DOB match (most important)
    const dobs = [data.enrollment?.dateOfBirth, data.birthCert?.dateOfBirth, data.passport?.dateOfBirth]
      .filter(Boolean);
    if (dobs.length > 1) {
      const dobMatch = new Set(dobs).size === 1 ? 1.0 : 0.0;
      score += dobMatch * 0.5; // 50% weight
      factors++;
    }

    // Gender match
    const genders = [data.enrollment?.gender, data.birthCert?.gender, data.passport?.gender]
      .filter(Boolean);
    if (genders.length > 1) {
      const genderMatch = new Set(genders).size === 1 ? 1.0 : 0.0;
      score += genderMatch * 0.3; // 30% weight
      factors++;
    }

    // Location match (less important)
    const locations = [data.enrollment?.placeOfBirth, data.birthCert?.placeOfBirth]
      .filter(Boolean);
    if (locations.length > 1) {
      const locationMatch = this.fuzzyMatch(locations[0], locations[1]);
      score += locationMatch * 0.2; // 20% weight
      factors++;
    }

    return factors > 0 ? score : 0.5; // Default to 0.5 if no factors
  }

  /**
   * Calculate document verification score
   */
  private calculateDocumentScore(data: any): number {
    let score = 0;
    let count = 0;

    if (data.birthCert?.verified) { score += 1.0; count++; }
    if (data.passport) { score += 0.9; count++; }
    if (data.driverLicense) { score += 0.7; count++; }
    if (data.voterCard) { score += 0.6; count++; }

    return count > 0 ? score / count : 0;
  }

  /**
   * Calculate overall confidence that records belong to same person
   */
  private calculateOverallConfidence(
    biometricScore: number | null,
    demographicScore: number,
    documentScore: number
  ): number {
    if (biometricScore !== null) {
      // If biometrics available, heavily weight them
      return (biometricScore * 0.6) + (demographicScore * 0.3) + (documentScore * 0.1);
    } else {
      // Without biometrics, rely on demographics and documents
      return (demographicScore * 0.7) + (documentScore * 0.3);
    }
  }

  /**
   * Calculate name similarity using fuzzy matching
   */
  private calculateNameSimilarity(names: string[]): number {
    if (names.length < 2) return 1.0;
    
    // Simple Levenshtein-based similarity
    let totalSimilarity = 0;
    let comparisons = 0;

    for (let i = 0; i < names.length; i++) {
      for (let j = i + 1; j < names.length; j++) {
        totalSimilarity += this.fuzzyMatch(names[i], names[j]);
        comparisons++;
      }
    }

    return comparisons > 0 ? totalSimilarity / comparisons : 1.0;
  }

  /**
   * Fuzzy string matching (simplified Levenshtein)
   */
  private fuzzyMatch(str1: string, str2: string): number {
    if (!str1 || !str2) return 0;
    
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();
    
    if (s1 === s2) return 1.0;
    
    // Simple similarity: ratio of common characters
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    
    let matches = 0;
    for (let i = 0; i < shorter.length; i++) {
      if (longer.includes(shorter[i])) matches++;
    }
    
    return matches / longer.length;
  }

  /**
   * Get weighted consensus value
   */
  private getWeightedConsensus(items: { source: string; value: any; weight: number }[]): any {
    // Group by value and sum weights
    const grouped = items.reduce((acc, item) => {
      const key = String(item.value);
      if (!acc[key]) {
        acc[key] = { value: item.value, totalWeight: 0 };
      }
      acc[key].totalWeight += item.weight;
      return acc;
    }, {} as Record<string, { value: any; totalWeight: number }>);

    // Return value with highest total weight
    return Object.values(grouped)
      .sort((a, b) => b.totalWeight - a.totalWeight)[0]?.value;
  }

  /**
   * Calculate consistency score based on conflicts and match confidence
   */
  private calculateConsistency(conflicts: DataConflict[], matchConfidence: number): number {
    const conflictPenalty = conflicts.reduce((sum, c) => {
      const severityWeight = { low: 0.05, medium: 0.1, high: 0.15, critical: 0.25 };
      return sum + severityWeight[c.severity];
    }, 0);

    const baseScore = Math.max(0, 1 - conflictPenalty);
    return (baseScore + matchConfidence) / 2;
  }

  /**
   * Calculate accuracy based on document verification
   */
  private calculateAccuracy(_data: any, documentScore: number): number {
    return documentScore;
  }

  private calculateCompleteness(data: any): number {
    const totalFields = 5; // ndise, birthCert, passport, driverLicense, voterCard
    const filledFields = Object.values(data).filter(v => v !== undefined && v !== null && v !== false).length;
    return filledFields / totalFields;
  }
}

// Export singleton instances
export const civilRegistryAPI = new CivilRegistryAPI();
export const immigrationAPI = new ImmigrationAPI();
export const dvaAPI = new DVAAPI();
export const necAPI = new NECAPI();
export const policeAPI = new PoliceAPI();
export const ndiseAPI = new NDISEAPI();
export const aiConsolidation = new AIConsolidationService();

// Utility function to consolidate all data for a person
export async function consolidatePersonData(params: {
  name: string;
  dob: string;
  phone?: string;
  birthCertNumber?: string;
  passportNumber?: string;
  nationalID?: string;
  fingerprints?: any;
}): Promise<ConsolidatedProfile> {
  
  // 1. Fetch NDISE record first (to correctly handle search -> getProfile flow)
  let ndiseRecord: NDISERecord | undefined;
  try {
    if (params.nationalID) {
      const response = await ndiseAPI.getProfile(params.nationalID);
      if (response.success) ndiseRecord = response.data;
    } else {
      const response = await ndiseAPI.searchByDemographic(params.name, params.dob, params.phone);
      if (response.success && response.data && response.data.length > 0) {
        // Found a match, fetch full profile
        const match = response.data[0];
        const profileResponse = await ndiseAPI.getProfile(match.nationalID);
        if (profileResponse.success) ndiseRecord = profileResponse.data;
      }
    }
  } catch (error) {
    console.error('Error fetching NDISE record:', error);
  }

  // 2. Fetch other records in parallel
  const results = await Promise.allSettled([
    params.birthCertNumber 
      ? civilRegistryAPI.verifyBirthCertificate(params.birthCertNumber)
      : civilRegistryAPI.searchByName(params.name, params.dob),
    immigrationAPI.searchPassport(params.name, params.dob),
    dvaAPI.searchDriverLicense(params.name, params.dob),
    necAPI.searchVoterCard(params.name, params.dob),
    policeAPI.checkCriminalRecord(params.name, params.dob),
  ]);

  const data = {
    birthCert: results[0].status === 'fulfilled' 
      ? (Array.isArray(results[0].value.data) ? results[0].value.data[0] : results[0].value.data)
      : undefined,
    passport: results[1].status === 'fulfilled' ? (results[1].value.data || undefined) : undefined,
    driverLicense: results[2].status === 'fulfilled' ? (results[2].value.data || undefined) : undefined,
    voterCard: results[3].status === 'fulfilled' ? (results[3].value.data || undefined) : undefined,
    criminalRecord: results[4].status === 'fulfilled' ? results[4].value.data : undefined,
    ndise: ndiseRecord,
  };

  return aiConsolidation.consolidateIdentity(data);
}
