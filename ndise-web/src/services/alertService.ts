/**
 * NDISE Unified Alert Service
 *
 * Central alert broadcasting system for real-time notifications across all agencies.
 * Replaces fragmented alert systems with unified publish/subscribe architecture.
 */

export interface NDISEAlert {
  id: string;
  type: 'watchlist' | 'detention' | 'border_crossing' | 'suspicious_activity' | 'data_quality' | 'system' | 'intelligence';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  message: string;
  data?: {
    nationalId?: string;
    personName?: string;
    location?: string;
    agency?: string;
    cameraId?: string;
    checkpoint?: string;
    metadata?: Record<string, any>;
  };
  targetAgencies: string[]; // Agencies that should receive this alert
  createdBy: string; // Agency that created the alert
  createdByUser: string;
  createdAt: Date;
  expiresAt?: Date;
  status: 'active' | 'resolved' | 'expired';
  actions?: AlertAction[];
  acknowledgedBy?: string[];
}

export interface AlertAction {
  label: string;
  type: 'navigate' | 'execute' | 'acknowledge';
  target?: string; // URL for navigate, function for execute
  agencies: string[]; // Which agencies can perform this action
}

export interface AlertSubscription {
  agency: string;
  alertTypes: string[];
  severities: string[];
  callback: (alert: NDISEAlert) => void;
}

/**
 * In-memory alert database (would be replaced with database + WebSocket in production)
 */
let alertDatabase: NDISEAlert[] = [];
let subscriptions: AlertSubscription[] = [];

/**
 * Initialize with sample alerts
 */
const initializeAlerts = () => {
  const sampleAlerts: NDISEAlert[] = [
    {
      id: 'alert-001',
      type: 'watchlist',
      severity: 'critical',
      title: 'High-Risk Individual Added to National Watchlist',
      message: 'Marcus Gaye (LBR-2024-8234) has been flagged for fraud alerts and document forgery. Detain on sight.',
      data: {
        nationalId: 'LBR-2024-8234',
        personName: 'Marcus Gaye',
        agency: 'NSA',
        metadata: {
          reasonCode: 'fraud_alert',
          actions: ['detention', 'border_alert', 'surveillance'],
        },
      },
      targetAgencies: ['border', 'police', 'nsa', 'enrollment'],
      createdBy: 'NSA',
      createdByUser: 'Agent Sarah Williams',
      createdAt: new Date('2024-11-15T10:30:00'),
      status: 'active',
      actions: [
        {
          label: 'View Full Profile',
          type: 'navigate',
          target: '/id/LBR-2024-8234',
          agencies: ['border', 'police', 'nsa'],
        },
        {
          label: 'Start CCTV Surveillance',
          type: 'navigate',
          target: '/nsa/surveillance?targetId=LBR-2024-8234&targetName=Marcus%20Gaye',
          agencies: ['nsa'],
        },
      ],
    },
    {
      id: 'alert-002',
      type: 'border_crossing',
      severity: 'high',
      title: 'Watchlist Individual Detected at Border',
      message: 'Ahmed Hassan Ibrahim (SYR-NAT-8492341) attempted entry at Bo Waterside Border. Vehicle detained for search.',
      data: {
        nationalId: 'SYR-NAT-8492341',
        personName: 'Ahmed Hassan Ibrahim',
        location: 'Bo Waterside Border Checkpoint',
        checkpoint: 'CAM-005',
        metadata: {
          vehiclePlate: 'LBR-8234',
          detentionStatus: 'detained',
        },
      },
      targetAgencies: ['border', 'police', 'nsa'],
      createdBy: 'Border',
      createdByUser: 'Officer John Dolo',
      createdAt: new Date('2024-11-18T15:45:00'),
      status: 'active',
      actions: [
        {
          label: 'View Profile',
          type: 'navigate',
          target: '/id/SYR-NAT-8492341',
          agencies: ['border', 'police', 'nsa'],
        },
        {
          label: 'Send NSA Tactical Unit',
          type: 'execute',
          agencies: ['nsa'],
        },
      ],
      acknowledgedBy: ['border', 'nsa'],
    },
    {
      id: 'alert-003',
      type: 'suspicious_activity',
      severity: 'medium',
      title: 'CCTV Detection: Target Sighted',
      message: 'Marcus Gaye detected at Paynesville Market via facial recognition. Confidence: 94%',
      data: {
        nationalId: 'LBR-2024-8234',
        personName: 'Marcus Gaye',
        location: 'Paynesville Market, North Entrance',
        cameraId: 'cam-002',
        metadata: {
          confidence: 94,
          vehiclePlate: 'LBR-5678',
          timestamp: '2024-11-21T11:30:00',
        },
      },
      targetAgencies: ['nsa', 'police'],
      createdBy: 'NSA',
      createdByUser: 'AI Surveillance System',
      createdAt: new Date('2024-11-21T11:30:00'),
      status: 'active',
      actions: [
        {
          label: 'View CCTV Feed',
          type: 'navigate',
          target: '/nsa/surveillance?targetId=LBR-2024-8234&targetName=Marcus%20Gaye',
          agencies: ['nsa', 'police'],
        },
        {
          label: 'Dispatch Police Unit',
          type: 'execute',
          agencies: ['police'],
        },
      ],
    },
  ];

  alertDatabase = sampleAlerts;
};

initializeAlerts();

/**
 * Create a new alert and broadcast to subscribed agencies
 */
export function createAlert(alert: Omit<NDISEAlert, 'id' | 'createdAt' | 'status'>): NDISEAlert {
  const newAlert: NDISEAlert = {
    ...alert,
    id: `alert-${Date.now()}`,
    createdAt: new Date(),
    status: 'active',
    data: alert.data || {},
  };

  alertDatabase.push(newAlert);

  // Broadcast to subscribed agencies
  broadcastAlert(newAlert);

  console.log('[NDISE Alert Created]', {
    id: newAlert.id,
    type: newAlert.type,
    severity: newAlert.severity,
    targetAgencies: newAlert.targetAgencies,
  });

  return newAlert;
}

/**
 * Get all alerts for a specific agency
 */
export function getAlertsForAgency(agency: string, options?: {
  types?: string[];
  severities?: string[];
  status?: string;
  limit?: number;
}): NDISEAlert[] {
  let alerts = alertDatabase.filter(alert =>
    alert.targetAgencies.includes(agency) ||
    alert.targetAgencies.includes('all')
  );

  // Apply filters
  if (options?.types && options.types.length > 0) {
    alerts = alerts.filter(a => options.types!.includes(a.type));
  }

  if (options?.severities && options.severities.length > 0) {
    alerts = alerts.filter(a => options.severities!.includes(a.severity));
  }

  if (options?.status) {
    alerts = alerts.filter(a => a.status === options.status);
  }

  // Sort by creation date (newest first)
  alerts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Apply limit
  if (options?.limit) {
    alerts = alerts.slice(0, options.limit);
  }

  return alerts;
}

/**
 * Get alerts for a specific person
 */
export function getAlertsForPerson(nationalId: string): NDISEAlert[] {
  return alertDatabase.filter(alert =>
    alert.data?.nationalId === nationalId &&
    alert.status === 'active'
  );
}

/**
 * Subscribe to alerts
 */
export function subscribe(subscription: AlertSubscription): () => void {
  subscriptions.push(subscription);

  // Return unsubscribe function
  return () => {
    subscriptions = subscriptions.filter(s => s !== subscription);
  };
}

/**
 * Broadcast alert to subscribers
 */
function broadcastAlert(alert: NDISEAlert) {
  subscriptions.forEach(subscription => {
    // Check if this subscription should receive this alert
    const agencyMatch = alert.targetAgencies.includes(subscription.agency) ||
                       alert.targetAgencies.includes('all');

    const typeMatch = subscription.alertTypes.length === 0 ||
                     subscription.alertTypes.includes(alert.type) ||
                     subscription.alertTypes.includes('all');

    const severityMatch = subscription.severities.length === 0 ||
                         subscription.severities.includes(alert.severity) ||
                         subscription.severities.includes('all');

    if (agencyMatch && typeMatch && severityMatch) {
      // Call the callback
      try {
        subscription.callback(alert);
      } catch (error) {
        console.error('[NDISE Alert] Error in subscription callback:', error);
      }
    }
  });
}

/**
 * Acknowledge an alert
 */
export function acknowledgeAlert(alertId: string, agency: string): boolean {
  const alert = alertDatabase.find(a => a.id === alertId);
  if (!alert) return false;

  if (!alert.acknowledgedBy) {
    alert.acknowledgedBy = [];
  }

  if (!alert.acknowledgedBy.includes(agency)) {
    alert.acknowledgedBy.push(agency);
  }

  console.log('[NDISE Alert Acknowledged]', {
    id: alertId,
    agency,
    allAcknowledged: alert.acknowledgedBy.length === alert.targetAgencies.length,
  });

  return true;
}

/**
 * Resolve an alert
 */
export function resolveAlert(alertId: string, resolvedBy: string, resolution: string): boolean {
  const alert = alertDatabase.find(a => a.id === alertId);
  if (!alert) return false;

  alert.status = 'resolved';
  
  if (!alert.data) {
    alert.data = {};
  }
  
  if (!alert.data.metadata) {
    alert.data.metadata = {};
  }
  alert.data.metadata.resolvedBy = resolvedBy;
  alert.data.metadata.resolvedAt = new Date();
  alert.data.metadata.resolution = resolution;

  console.log('[NDISE Alert Resolved]', {
    id: alertId,
    resolvedBy,
    resolution,
  });

  // Notify subscribers of resolution
  const resolvedAlert: NDISEAlert = {
    ...alert,
    title: `[RESOLVED] ${alert.title}`,
    message: `${alert.message}\n\nResolution: ${resolution}`,
  };
  broadcastAlert(resolvedAlert);

  return true;
}

/**
 * Get alert statistics
 */
export function getAlertStats(agency?: string) {
  let alerts = alertDatabase;

  if (agency) {
    alerts = alerts.filter(a =>
      a.targetAgencies.includes(agency) ||
      a.targetAgencies.includes('all')
    );
  }

  const active = alerts.filter(a => a.status === 'active');

  return {
    total: active.length,
    bySeverity: {
      critical: active.filter(a => a.severity === 'critical').length,
      high: active.filter(a => a.severity === 'high').length,
      medium: active.filter(a => a.severity === 'medium').length,
      low: active.filter(a => a.severity === 'low').length,
      info: active.filter(a => a.severity === 'info').length,
    },
    byType: {
      watchlist: active.filter(a => a.type === 'watchlist').length,
      detention: active.filter(a => a.type === 'detention').length,
      border_crossing: active.filter(a => a.type === 'border_crossing').length,
      suspicious_activity: active.filter(a => a.type === 'suspicious_activity').length,
      data_quality: active.filter(a => a.type === 'data_quality').length,
      system: active.filter(a => a.type === 'system').length,
      intelligence: active.filter(a => a.type === 'intelligence').length,
    },
    unacknowledged: active.filter(a =>
      !a.acknowledgedBy ||
      a.acknowledgedBy.length < a.targetAgencies.length
    ).length,
    recent: active
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5),
  };
}

/**
 * Create a watchlist alert
 */
export function createWatchlistAlert(params: {
  nationalId: string;
  personName: string;
  reason: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  addedBy: string;
  addedByUser: string;
  targetAgencies: string[];
}): NDISEAlert {
  return createAlert({
    type: 'watchlist',
    severity: params.severity,
    title: `${params.severity.toUpperCase()} Priority: Individual Added to National Watchlist`,
    message: `${params.personName} (${params.nationalId}) has been flagged. Reason: ${params.reason}`,
    data: {
      nationalId: params.nationalId,
      personName: params.personName,
      agency: params.addedBy,
      metadata: {
        reason: params.reason,
      },
    },
    targetAgencies: params.targetAgencies,
    createdBy: params.addedBy,
    createdByUser: params.addedByUser,
    actions: [
      {
        label: 'View Full Profile',
        type: 'navigate',
        target: `/id/${params.nationalId}`,
        agencies: params.targetAgencies,
      },
    ],
  });
}

/**
 * Create a border crossing alert
 */
export function createBorderCrossingAlert(params: {
  nationalId: string;
  personName: string;
  checkpoint: string;
  location: string;
  type: 'entry' | 'exit' | 'detained';
  severity: 'critical' | 'high' | 'medium' | 'low';
  createdByUser: string;
}): NDISEAlert {
  const messages = {
    entry: `${params.personName} entered Liberia at ${params.checkpoint}`,
    exit: `${params.personName} exited Liberia at ${params.checkpoint}`,
    detained: `${params.personName} detained at ${params.checkpoint}`,
  };

  return createAlert({
    type: 'border_crossing',
    severity: params.severity,
    title: `Border ${params.type.toUpperCase()}: ${params.severity === 'critical' ? 'WATCHLIST INDIVIDUAL' : 'Crossing Event'}`,
    message: messages[params.type],
    data: {
      nationalId: params.nationalId,
      personName: params.personName,
      location: params.location,
      checkpoint: params.checkpoint,
      metadata: {
        crossingType: params.type,
      },
    },
    targetAgencies: params.severity === 'critical' ? ['border', 'police', 'nsa'] : ['border'],
    createdBy: 'Border',
    createdByUser: params.createdByUser,
    actions: [
      {
        label: 'View Profile',
        type: 'navigate',
        target: `/id/${params.nationalId}`,
        agencies: ['border', 'police', 'nsa'],
      },
    ],
  });
}

/**
 * Create a CCTV detection alert
 */
export function createCCTVDetectionAlert(params: {
  nationalId: string;
  personName: string;
  cameraId: string;
  location: string;
  confidence: number;
}): NDISEAlert {
  return createAlert({
    type: 'suspicious_activity',
    severity: params.confidence >= 90 ? 'high' : 'medium',
    title: 'CCTV Detection: Target Sighted',
    message: `${params.personName} detected at ${params.location} via facial recognition. Confidence: ${params.confidence}%`,
    data: {
      nationalId: params.nationalId,
      personName: params.personName,
      location: params.location,
      cameraId: params.cameraId,
      metadata: {
        confidence: params.confidence,
        timestamp: new Date().toISOString(),
      },
    },
    targetAgencies: ['nsa', 'police'],
    createdBy: 'NSA',
    createdByUser: 'AI Surveillance System',
    actions: [
      {
        label: 'View CCTV Feed',
        type: 'navigate',
        target: `/nsa/surveillance?targetId=${params.nationalId}&targetName=${encodeURIComponent(params.personName)}`,
        agencies: ['nsa', 'police'],
      },
    ],
  });
}

export default {
  createAlert,
  getAlertsForAgency,
  getAlertsForPerson,
  subscribe,
  acknowledgeAlert,
  resolveAlert,
  getAlertStats,
  createWatchlistAlert,
  createBorderCrossingAlert,
  createCCTVDetectionAlert,
};
