/**
 * Agency Integration Monitoring Service
 * Tracks health, performance, and data sync metrics for all integrated agencies
 */

export interface AgencyMetrics {
  agencyId: string;
  agencyName: string;
  category: 'government' | 'security' | 'services' | 'private';
  
  // Health Status
  status: 'online' | 'degraded' | 'offline';
  lastSyncTime: string;
  avgResponseTime: number; // milliseconds
  uptime: number; // percentage (0-100)
  
  // Data Volume
  recordsSyncedToday: number;
  recordsSyncedThisWeek: number;
  recordsSyncedThisMonth: number;
  totalRecords: number;
  
  // Quality Metrics
  dataCompleteness: number; // 0-100%
  accuracyScore: number; // 0-100%
  conflictRate: number; // percentage
  duplicateCount: number;
  
  // API Performance
  callsToday: number;
  successRate: number; // percentage
  errorRate: number;
  rateLimitHits: number;
}

export interface IntegrationEvent {
  id: string;
  timestamp: string;
  agencyId: string;
  agencyName: string;
  eventType: 'sync' | 'api_call' | 'error' | 'alert' | 'connection_restored' | 'connection_lost';
  
  // For sync events
  recordsProcessed?: number;
  recordsAdded?: number;
  recordsUpdated?: number;
  conflictsDetected?: number;
  
  // For error events
  errorCode?: string;
  errorMessage?: string;
  
  // Context
  triggeredBy: 'scheduled' | 'manual' | 'real_time' | 'system';
  officer?: string;
  severity?: 'info' | 'warning' | 'error' | 'critical';
}

// Mock agency data
const agencies: AgencyMetrics[] = [
  {
    agencyId: 'nir',
    agencyName: 'Civil Registry (NIR)',
    category: 'government',
    status: 'online',
    lastSyncTime: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 mins ago
    avgResponseTime: 145,
    uptime: 99.8,
    recordsSyncedToday: 12345,
    recordsSyncedThisWeek: 87654,
    recordsSyncedThisMonth: 345678,
    totalRecords: 4500000,
    dataCompleteness: 96,
    accuracyScore: 98,
    conflictRate: 1.2,
    duplicateCount: 234,
    callsToday: 45678,
    successRate: 99.2,
    errorRate: 0.8,
    rateLimitHits: 0
  },
  {
    agencyId: 'immigration',
    agencyName: 'Immigration Service',
    category: 'security',
    status: 'online',
    lastSyncTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    avgResponseTime: 187,
    uptime: 99.1,
    recordsSyncedToday: 9876,
    recordsSyncedThisWeek: 65432,
    recordsSyncedThisMonth: 234567,
    totalRecords: 250000,
    dataCompleteness: 94,
    accuracyScore: 97,
    conflictRate: 2.1,
    duplicateCount: 89,
    callsToday: 23456,
    successRate: 98.9,
    errorRate: 1.1,
    rateLimitHits: 3
  },
  {
    agencyId: 'police',
    agencyName: 'Liberia National Police (LIPS)',
    category: 'security',
    status: 'degraded',
    lastSyncTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    avgResponseTime: 450,
    uptime: 94.2,
    recordsSyncedToday: 7654,
    recordsSyncedThisWeek: 54321,
    recordsSyncedThisMonth: 198765,
    totalRecords: 850000,
    dataCompleteness: 88,
    accuracyScore: 92,
    conflictRate: 3.5,
    duplicateCount: 456,
    callsToday: 34567,
    successRate: 95.5,
    errorRate: 4.5,
    rateLimitHits: 12
  },
  {
    agencyId: 'health',
    agencyName: 'Ministry of Health',
    category: 'government',
    status: 'online',
    lastSyncTime: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    avgResponseTime: 210,
    uptime: 97.8,
    recordsSyncedToday: 5432,
    recordsSyncedThisWeek: 43210,
    recordsSyncedThisMonth: 187654,
    totalRecords: 3200000,
    dataCompleteness: 82,
    accuracyScore: 89,
    conflictRate: 4.8,
    duplicateCount: 678,
    callsToday: 12345,
    successRate: 97.2,
    errorRate: 2.8,
    rateLimitHits: 5
  },
  {
    agencyId: 'lta',
    agencyName: 'LTA (SIM Registration)',
    category: 'services',
    status: 'online',
    lastSyncTime: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    avgResponseTime: 95,
    uptime: 99.9,
    recordsSyncedToday: 890,
    recordsSyncedThisWeek: 6234,
    recordsSyncedThisMonth: 28901,
    totalRecords: 4200000,
    dataCompleteness: 99,
    accuracyScore: 99,
    conflictRate: 0.3,
    duplicateCount: 23,
    callsToday: 89012,
    successRate: 99.7,
    errorRate: 0.3,
    rateLimitHits: 0
  },
  {
    agencyId: 'tax',
    agencyName: 'Revenue Authority (Tax)',
    category: 'government',
    status: 'offline',
    lastSyncTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    avgResponseTime: 0,
    uptime: 85.1,
    recordsSyncedToday: 0,
    recordsSyncedThisWeek: 1234,
    recordsSyncedThisMonth: 156789,
    totalRecords: 2800000,
    dataCompleteness: 78,
   accuracyScore: 85,
    conflictRate: 6.2,
    duplicateCount: 890,
    callsToday: 0,
    successRate: 0,
    errorRate: 100,
    rateLimitHits: 0
  },
  {
    agencyId: 'nec',
    agencyName: 'National Election Commission',
    category: 'government',
    status: 'online',
    lastSyncTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    avgResponseTime: 320,
    uptime: 96.5,
    recordsSyncedToday: 2345,
    recordsSyncedThisWeek: 18765,
    recordsSyncedThisMonth: 89012,
    totalRecords: 2450000,
    dataCompleteness: 92,
    accuracyScore: 95,
    conflictRate: 1.8,
    duplicateCount: 345,
    callsToday: 8901,
    successRate: 98.1,
    errorRate: 1.9,
    rateLimitHits: 2
  },
  {
    agencyId: 'dva',
    agencyName: 'Driver & Vehicle Authority',
    category: 'services',
    status: 'online',
    lastSyncTime: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    avgResponseTime: 275,
    uptime: 95.3,
    recordsSyncedToday: 1876,
    recordsSyncedThisWeek: 13456,
    recordsSyncedThisMonth: 67890,
    totalRecords: 780000,
    dataCompleteness: 90,
    accuracyScore: 93,
    conflictRate: 2.7,
    duplicateCount: 123,
    callsToday: 15678,
    successRate: 96.8,
    errorRate: 3.2,
    rateLimitHits: 7
  }
];

export function getAllAgencies(): AgencyMetrics[] {
  return agencies;
}

export function getAgencyById(agencyId: string): AgencyMetrics | undefined {
  return agencies.find(a => a.agencyId === agencyId);
}

export function getAgenciesByStatus(status: 'online' | 'degraded' | 'offline'): AgencyMetrics[] {
  return agencies.filter(a => a.status === status);
}

export function getAgencyHealthSummary() {
  const online = agencies.filter(a => a.status === 'online').length;
  const degraded = agencies.filter(a => a.status === 'degraded').length;
  const offline = agencies.filter(a => a.status === 'offline').length;
  
  const avgUptime = agencies.reduce((sum, a) => sum + a.uptime, 0) / agencies.length;
  const avgResponseTime = agencies
    .filter(a => a.status !== 'offline')
    .reduce((sum, a) => sum + a.avgResponseTime, 0) / (agencies.length - offline);
  
  return {
    total: agencies.length,
    online,
    degraded,
    offline,
    healthScore: Math.round((online / agencies.length) * 100),
    avgUptime: Math.round(avgUptime * 10) / 10,
    avgResponseTime: Math.round(avgResponseTime)
  };
}

// Mock integration events
export function getRecentIntegrationEvents(limit: number = 50): IntegrationEvent[] {
  const events: IntegrationEvent[] = [];
  const now = Date.now();
  
  // Generate mock events
  for (let i = 0; i < limit; i++) {
    const agency = agencies[Math.floor(Math.random() * agencies.length)];
    const types: IntegrationEvent['eventType'][] = ['sync', 'api_call', 'error', 'alert'];
    const eventType = types[Math.floor(Math.random() * types.length)];
    
    events.push({
      id: `event-${Date.now()}-${i}`,
      timestamp: new Date(now - i * 5 * 60 * 1000).toISOString(),
      agencyId: agency.agencyId,
      agencyName: agency.agencyName,
      eventType,
      recordsProcessed: eventType === 'sync' ? Math.floor(Math.random() * 5000) : undefined,
      recordsAdded: eventType === 'sync' ? Math.floor(Math.random() * 100) : undefined,
      recordsUpdated: eventType === 'sync' ? Math.floor(Math.random() * 500) : undefined,
      conflictsDetected: eventType === 'sync' ? Math.floor(Math.random() * 10) : undefined,
      errorMessage: eventType === 'error' ? 'Connection timeout' : undefined,
      triggeredBy: 'scheduled',
      severity: eventType === 'error' ? 'error' : 'info'
    });
  }
  
  return events.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function getDataSyncStats() {
  const today = agencies.reduce((sum, a) => sum + a.recordsSyncedToday, 0);
  const thisWeek = agencies.reduce((sum, a) => sum + a.recordsSyncedThisWeek, 0);
  const thisMonth = agencies.reduce((sum, a) => sum + a.recordsSyncedThisMonth, 0);
  
  return {
    today,
    thisWeek,
    thisMonth,
    byAgency: agencies.map(a => ({
      agencyId: a.agencyId,
      agencyName: a.agencyName,
      recordsToday: a.recordsSyncedToday,
      recordsWeek: a.recordsSyncedThisWeek,
      recordsMonth: a.recordsSyncedThisMonth
    })).sort((a, b) => b.recordsToday - a.recordsToday)
  };
}

export function getDataQualityMetrics() {
  return agencies.map(a => ({
    agencyId: a.agencyId,
    agencyName: a.agencyName,
    completeness: a.dataCompleteness,
    accuracy: a.accuracyScore,
    conflictRate: a.conflictRate,
    duplicates: a.duplicateCount,
    overallQuality: Math.round(
      (a.dataCompleteness * 0.4) + 
      (a.accuracyScore * 0.4) - 
      (a.conflictRate * 5)
    )
  })).sort((a, b) => b.overallQuality - a.overallQuality);
}
