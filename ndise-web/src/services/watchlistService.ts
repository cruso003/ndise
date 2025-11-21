/**
 * NDISE Unified Watchlist Service
 *
 * Single source of truth for all watchlist/flagging operations across agencies.
 * Replaces fragmented agency-specific watchlists with centralized system.
 */

export interface WatchlistEntry {
  id: string;
  nationalId: string;
  personName: string;
  reason: string;
  reasonCode: 'border_security' | 'wanted_criminal' | 'nsa_intelligence' | 'fraud_alert' | 'overstay' | 'document_fraud' | 'smuggling' | 'trafficking';
  severity: 'critical' | 'high' | 'medium' | 'low';
  addedBy: string; // Agency that added the flag
  addedByUser: string;
  addedAt: Date;
  expiresAt?: Date;
  actions: WatchlistAction[];
  metadata?: Record<string, any>;
  status: 'active' | 'resolved' | 'expired';
}

export interface WatchlistAction {
  type: 'detention' | 'border_alert' | 'interview' | 'surveillance' | 'notify_agency';
  description: string;
  agencies: string[]; // Agencies that should be notified/take action
}

export interface WatchlistFilter {
  reasonCodes?: string[];
  severities?: string[];
  agencies?: string[];
  status?: string;
  searchTerm?: string;
}

/**
 * In-memory watchlist database (would be replaced with actual database in production)
 */
let watchlistDatabase: Map<string, WatchlistEntry[]> = new Map();

// Initialize with sample data
const initializeWatchlist = () => {
  const sampleEntries: WatchlistEntry[] = [
    {
      id: 'wl-001',
      nationalId: 'LBR-2024-8234',
      personName: 'Marcus Gaye',
      reason: 'Multiple fraud alerts, unusual cross-border travel patterns, suspected involvement in document forgery network',
      reasonCode: 'fraud_alert',
      severity: 'critical',
      addedBy: 'NSA',
      addedByUser: 'Agent Sarah Williams',
      addedAt: new Date('2024-11-15T10:30:00'),
      actions: [
        {
          type: 'detention',
          description: 'Detain on sight and notify NSA immediately',
          agencies: ['border', 'police', 'nsa'],
        },
        {
          type: 'border_alert',
          description: 'Alert all checkpoints - do not allow exit',
          agencies: ['border'],
        },
        {
          type: 'surveillance',
          description: 'Active CCTV monitoring across all locations',
          agencies: ['nsa'],
        },
      ],
      status: 'active',
    },
    {
      id: 'wl-002',
      nationalId: 'SYR-NAT-8492341',
      personName: 'Ahmed Hassan Ibrahim',
      reason: 'Suspected involvement in smuggling network, multiple border crossings in short period',
      reasonCode: 'smuggling',
      severity: 'critical',
      addedBy: 'Border',
      addedByUser: 'Officer John Dolo',
      addedAt: new Date('2024-11-18T08:15:00'),
      actions: [
        {
          type: 'detention',
          description: 'Exercise extreme caution - detain and search vehicle',
          agencies: ['border', 'police'],
        },
        {
          type: 'notify_agency',
          description: 'Notify NSA of any crossing attempts',
          agencies: ['nsa'],
        },
      ],
      status: 'active',
    },
    {
      id: 'wl-003',
      nationalId: 'NIG-NAT-4567890',
      personName: 'Sarah Williams',
      reason: 'Document fraud - forged passport detected at Roberts International Airport',
      reasonCode: 'document_fraud',
      severity: 'high',
      addedBy: 'Border',
      addedByUser: 'Immigration Officer Mary Kpan',
      addedAt: new Date('2024-11-19T14:20:00'),
      expiresAt: new Date('2025-02-19T14:20:00'), // 3 month flag
      actions: [
        {
          type: 'interview',
          description: 'Conduct thorough interview and document verification',
          agencies: ['border'],
        },
        {
          type: 'border_alert',
          description: 'Alert on entry - verify fingerprints carefully',
          agencies: ['border'],
        },
      ],
      status: 'active',
    },
  ];

  // Index by nationalId for fast lookup
  sampleEntries.forEach(entry => {
    const existing = watchlistDatabase.get(entry.nationalId) || [];
    watchlistDatabase.set(entry.nationalId, [...existing, entry]);
  });
};

initializeWatchlist();

/**
 * Get all watchlist entries for a specific person
 */
export function getWatchlistEntriesByPerson(nationalId: string): WatchlistEntry[] {
  return watchlistDatabase.get(nationalId) || [];
}

/**
 * Check if a person is on any watchlist
 */
export function isOnWatchlist(nationalId: string): boolean {
  const entries = getWatchlistEntriesByPerson(nationalId);
  return entries.some(e => e.status === 'active');
}

/**
 * Get the highest severity watchlist entry for a person
 */
export function getWatchlistSeverity(nationalId: string): 'critical' | 'high' | 'medium' | 'low' | null {
  const entries = getWatchlistEntriesByPerson(nationalId).filter(e => e.status === 'active');
  if (entries.length === 0) return null;

  const severityOrder = ['critical', 'high', 'medium', 'low'];
  for (const severity of severityOrder) {
    if (entries.some(e => e.severity === severity)) {
      return severity as any;
    }
  }
  return null;
}

/**
 * Add a person to the watchlist
 */
export function addToWatchlist(entry: Omit<WatchlistEntry, 'id' | 'addedAt' | 'status'>): WatchlistEntry {
  const newEntry: WatchlistEntry = {
    ...entry,
    id: `wl-${Date.now()}`,
    addedAt: new Date(),
    status: 'active',
  };

  const existing = watchlistDatabase.get(entry.nationalId) || [];
  watchlistDatabase.set(entry.nationalId, [...existing, newEntry]);

  // Broadcast alert to all agencies specified in actions
  const affectedAgencies = new Set<string>();
  newEntry.actions.forEach(action => {
    action.agencies.forEach(agency => affectedAgencies.add(agency));
  });

  console.log('[NDISE Watchlist] Added:', {
    person: entry.personName,
    nationalId: entry.nationalId,
    reason: entry.reasonCode,
    severity: entry.severity,
    alertedAgencies: Array.from(affectedAgencies),
  });

  // TODO: Broadcast real-time alert to agency dashboards
  broadcastWatchlistAlert('added', newEntry, Array.from(affectedAgencies));

  return newEntry;
}

/**
 * Remove a person from the watchlist
 */
export function removeFromWatchlist(entryId: string, removedBy: string, reason: string): boolean {
  for (const [_, entries] of watchlistDatabase.entries()) {
    const entry = entries.find(e => e.id === entryId);
    if (entry && entry.status === 'active') {
      entry.status = 'resolved';
      entry.metadata = {
        ...entry.metadata,
        removedBy,
        removedAt: new Date(),
        removalReason: reason,
      };

      console.log('[NDISE Watchlist] Removed:', {
        person: entry.personName,
        removedBy,
        reason,
      });

      // TODO: Broadcast removal to agencies
      const affectedAgencies = new Set<string>();
      entry.actions.forEach(action => {
        action.agencies.forEach(agency => affectedAgencies.add(agency));
      });
      broadcastWatchlistAlert('removed', entry, Array.from(affectedAgencies));

      return true;
    }
  }
  return false;
}

/**
 * Search watchlist entries
 */
export function searchWatchlist(filter: WatchlistFilter): WatchlistEntry[] {
  const allEntries: WatchlistEntry[] = [];
  for (const entries of watchlistDatabase.values()) {
    allEntries.push(...entries);
  }

  return allEntries.filter(entry => {
    // Status filter
    if (filter.status && entry.status !== filter.status) return false;

    // Reason code filter
    if (filter.reasonCodes && filter.reasonCodes.length > 0) {
      if (!filter.reasonCodes.includes(entry.reasonCode)) return false;
    }

    // Severity filter
    if (filter.severities && filter.severities.length > 0) {
      if (!filter.severities.includes(entry.severity)) return false;
    }

    // Agency filter
    if (filter.agencies && filter.agencies.length > 0) {
      const entryAgencies = new Set<string>();
      entry.actions.forEach(action => {
        action.agencies.forEach(agency => entryAgencies.add(agency));
      });
      const hasMatchingAgency = filter.agencies.some(agency => entryAgencies.has(agency));
      if (!hasMatchingAgency) return false;
    }

    // Search term filter
    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      const matchesName = entry.personName.toLowerCase().includes(term);
      const matchesId = entry.nationalId.toLowerCase().includes(term);
      const matchesReason = entry.reason.toLowerCase().includes(term);
      if (!matchesName && !matchesId && !matchesReason) return false;
    }

    return true;
  });
}

/**
 * Get watchlist statistics
 */
export function getWatchlistStats() {
  const allEntries: WatchlistEntry[] = [];
  for (const entries of watchlistDatabase.values()) {
    allEntries.push(...entries);
  }

  const active = allEntries.filter(e => e.status === 'active');

  return {
    total: active.length,
    bySeverity: {
      critical: active.filter(e => e.severity === 'critical').length,
      high: active.filter(e => e.severity === 'high').length,
      medium: active.filter(e => e.severity === 'medium').length,
      low: active.filter(e => e.severity === 'low').length,
    },
    byReasonCode: {
      border_security: active.filter(e => e.reasonCode === 'border_security').length,
      wanted_criminal: active.filter(e => e.reasonCode === 'wanted_criminal').length,
      nsa_intelligence: active.filter(e => e.reasonCode === 'nsa_intelligence').length,
      fraud_alert: active.filter(e => e.reasonCode === 'fraud_alert').length,
      overstay: active.filter(e => e.reasonCode === 'overstay').length,
      document_fraud: active.filter(e => e.reasonCode === 'document_fraud').length,
      smuggling: active.filter(e => e.reasonCode === 'smuggling').length,
      trafficking: active.filter(e => e.reasonCode === 'trafficking').length,
    },
    recentAdditions: active
      .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())
      .slice(0, 10),
  };
}

/**
 * Broadcast watchlist alert to agencies
 * In production, this would use WebSocket/SSE to notify agency dashboards in real-time
 */
function broadcastWatchlistAlert(
  type: 'added' | 'removed' | 'updated',
  entry: WatchlistEntry,
  agencies: string[]
) {
  // TODO: Implement real-time broadcasting
  // For now, just log
  console.log('[NDISE Alert Broadcast]', {
    type,
    entry: {
      id: entry.id,
      person: entry.personName,
      nationalId: entry.nationalId,
      severity: entry.severity,
    },
    agencies,
    timestamp: new Date(),
  });
}

/**
 * Get recommended actions for a watchlist entry
 */
export function getRecommendedActions(nationalId: string, context: 'border' | 'police' | 'nsa'): string[] {
  const entries = getWatchlistEntriesByPerson(nationalId).filter(e => e.status === 'active');
  if (entries.length === 0) return [];

  const actions: string[] = [];

  entries.forEach(entry => {
    entry.actions.forEach(action => {
      if (action.agencies.includes(context)) {
        actions.push(`${action.type.toUpperCase()}: ${action.description}`);
      }
    });
  });

  return actions;
}

export default {
  getWatchlistEntriesByPerson,
  isOnWatchlist,
  getWatchlistSeverity,
  addToWatchlist,
  removeFromWatchlist,
  searchWatchlist,
  getWatchlistStats,
  getRecommendedActions,
};
