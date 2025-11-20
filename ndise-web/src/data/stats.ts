export const stats = {
  totalCitizens: 3854210,
  totalEnrollments: 3854210, // Alias for totalCitizens
  enrollmentTarget: 4500000,
  totalForeigners: 45230,
  activeForeigners: 42100, // Slightly less than total
  overstays: 3130,
  activeSims: 4100200,
  linkedSims: 3950100,
  agenciesIntegrated: 12,
  dailyEnrollments: 2450,
  uptime: "99.98%"
};

export const enrollmentTrends = [
  { name: 'Jan', citizens: 4000, foreigners: 2400 },
  { name: 'Feb', citizens: 3000, foreigners: 1398 },
  { name: 'Mar', citizens: 2000, foreigners: 9800 },
  { name: 'Apr', citizens: 2780, foreigners: 3908 },
  { name: 'May', citizens: 1890, foreigners: 4800 },
  { name: 'Jun', citizens: 2390, foreigners: 3800 },
];

export const statusDistribution = [
  { name: 'Active', value: 3854210, color: '#10B981', trend: { percent: 2.5 } },
  { name: 'Pending', value: 125430, color: '#F59E0B', trend: { percent: -5.2 } },
  { name: 'Rejected', value: 4520, color: '#EF4444', trend: { percent: 1.1 } },
  { name: 'Suspended', value: 1205, color: '#6B7280', trend: { percent: 0.0 } },
];

export const recentEnrollments = [
  {
    type: 'New Citizen Registration',
    name: 'Sarah Johnson',
    location: 'Monrovia Center',
    time: '2 mins ago'
  },
  {
    type: 'Foreign Resident Renewal',
    name: 'Amara Diallo',
    location: 'Ganta Office',
    time: '15 mins ago'
  },
  {
    type: 'SIM Card Link',
    name: 'John Doe',
    location: 'Online Portal',
    time: '32 mins ago'
  },
  {
    type: 'Birth Registration',
    name: 'Baby Boy Kpadeh',
    location: 'JFK Medical Center',
    time: '1 hour ago'
  }
];

export const borderStats = {
  entriesToday: 1245,
  exitsToday: 982,
  watchlistHits: 3,
  visaVerifications: 156
};

export const borderTraffic = [
  { time: '06:00', entries: 45, exits: 30 },
  { time: '08:00', entries: 120, exits: 85 },
  { time: '10:00', entries: 240, exits: 150 },
  { time: '12:00', entries: 180, exits: 120 },
  { time: '14:00', entries: 210, exits: 190 },
  { time: '16:00', entries: 280, exits: 220 },
  { time: '18:00', entries: 150, exits: 180 },
  { time: '20:00', entries: 90, exits: 60 },
];

export const recentCrossings = [
  {
    id: 'CR-2024-001',
    name: 'James Carter',
    nationality: 'USA',
    type: 'Entry',
    point: 'Roberts Intl Airport',
    status: 'Cleared',
    time: '5 mins ago'
  },
  {
    id: 'CR-2024-002',
    name: 'Fatima Hassan',
    nationality: 'Sierra Leone',
    type: 'Exit',
    point: 'Bo Waterside',
    status: 'Cleared',
    time: '12 mins ago'
  },
  {
    id: 'CR-2024-003',
    name: 'Chen Wei',
    nationality: 'China',
    type: 'Entry',
    point: 'Roberts Intl Airport',
    status: 'Flagged',
    alertType: 'Visa Expiring',
    time: '25 mins ago'
  },
  {
    id: 'CR-2024-004',
    name: 'Kwame Nkrumah',
    nationality: 'Ghana',
    type: 'Entry',
    point: 'Harper Border',
    status: 'Cleared',
    time: '45 mins ago'
  }
];

export const policeStats = {
  activeWarrants: 452,
  dailyVerifications: 2890,
  missingPersons: 84,
  stolenIds: 12
};

export const wantedPersons = [
  {
    id: 'W-2024-089',
    name: 'John "Snake" Doe',
    offense: 'Armed Robbery',
    riskLevel: 'High',
    lastSeen: 'Monrovia (Sinkor)',
    status: 'Active'
  },
  {
    id: 'W-2024-092',
    name: 'Peter S. Kamara',
    offense: 'Fraud / Forgery',
    riskLevel: 'Medium',
    lastSeen: 'Gbarnga',
    status: 'Active'
  },
  {
    id: 'W-2024-105',
    name: 'Unknown Suspect #4',
    offense: 'Vandalism',
    riskLevel: 'Low',
    lastSeen: 'Paynesville',
    status: 'Active'
  }
];

export const policeAlerts = [
  {
    id: 'PA-001',
    type: 'Identity Match',
    message: 'Biometric match found for wanted suspect at RIA Border Control.',
    time: '10 mins ago',
    severity: 'critical'
  },
  {
    id: 'PA-002',
    type: 'Stolen ID Usage',
    message: 'Reported stolen ID card used for SIM registration in West Point.',
    time: '45 mins ago',
    severity: 'high'
  },
  {
    id: 'PA-003',
    type: 'Missing Person',
    message: 'New missing person report filed: Sarah T. Blah (Age 14).',
    time: '2 hours ago',
    severity: 'medium'
  },
  {
    id: 'PA-004',
    type: 'System Update',
    message: 'Criminal database synchronized with Interpol.',
    time: '4 hours ago',
    severity: 'low'
  }
];

export const agencyStats = {
  totalApiCalls: 1250400,
  activePartners: 45,
  successRate: "99.95%",
  avgResponseTime: "45ms"
};

export const agencyPartners = [
  {
    id: 'AG-001',
    name: 'Ecobank Liberia',
    sector: 'Banking',
    status: 'Operational',
    apiCalls: '450k',
    uptime: '99.99%'
  },
  {
    id: 'AG-002',
    name: 'Lonestar Cell MTN',
    sector: 'Telecom',
    status: 'Operational',
    apiCalls: '890k',
    uptime: '99.95%'
  },
  {
    id: 'AG-003',
    name: 'Orange Liberia',
    sector: 'Telecom',
    status: 'Warning',
    apiCalls: '760k',
    uptime: '98.50%'
  },
  {
    id: 'AG-004',
    name: 'JFK Medical Center',
    sector: 'Healthcare',
    status: 'Operational',
    apiCalls: '120k',
    uptime: '99.99%'
  },
  {
    id: 'AG-005',
    name: 'Access Bank',
    sector: 'Banking',
    status: 'Operational',
    apiCalls: '230k',
    uptime: '99.98%'
  },
  {
    id: 'AG-006',
    name: 'Liberia Revenue Authority',
    sector: 'Government',
    status: 'Operational',
    apiCalls: '560k',
    uptime: '99.99%'
  }
];

export const apiUsage = [
  { name: 'Banking', calls: 4500 },
  { name: 'Telecom', calls: 8200 },
  { name: 'Healthcare', calls: 2100 },
  { name: 'Govt', calls: 3400 },
  { name: 'Other', calls: 1200 },
];
