import type { NetworkGraphData, GraphNode, GraphLink } from '../components/NetworkGraph';

// Sample network for case investigations
export const investigationNetwork: NetworkGraphData = {
  nodes: [
    {
      id: 'central-1',
      name: 'Marcus Gaye',
      type: 'person',
      riskLevel: 'critical',
      size: 10,
      details: {
        idNumber: 'LBR-2024-8234',
        age: 34,
        location: 'Monrovia',
        occupation: 'Business Owner',
        flagReason: 'Multiple fraud alerts, unusual travel patterns',
      },
    },
    {
      id: 'person-2',
      name: 'Sarah Togba',
      type: 'person',
      riskLevel: 'high',
      details: {
        idNumber: 'LBR-2024-8235',
        relationship: 'Business Partner',
        location: 'Monrovia',
      },
    },
    {
      id: 'person-3',
      name: 'James Kollie',
      type: 'person',
      riskLevel: 'medium',
      details: {
        idNumber: 'LBR-2024-8236',
        relationship: 'Brother',
        location: 'Gbarnga',
      },
    },
    {
      id: 'person-4',
      name: 'Victoria Doe',
      type: 'person',
      riskLevel: 'low',
      details: {
        idNumber: 'LBR-2024-8237',
        relationship: 'Spouse',
        location: 'Monrovia',
      },
    },
    {
      id: 'person-5',
      name: 'Emmanuel Dahn',
      type: 'person',
      riskLevel: 'high',
      details: {
        idNumber: 'LBR-2024-8238',
        relationship: 'Associate',
        location: 'Lagos, Nigeria',
      },
    },
    {
      id: 'person-6',
      name: 'Grace Kpannah',
      type: 'person',
      riskLevel: 'neutral',
      details: {
        idNumber: 'LBR-2024-8239',
        relationship: 'Employee',
        location: 'Monrovia',
      },
    },
    {
      id: 'org-1',
      name: 'Global Trade Ltd',
      type: 'organization',
      riskLevel: 'high',
      details: {
        type: 'Import/Export Company',
        location: 'Monrovia',
        status: 'Under Investigation',
      },
    },
    {
      id: 'org-2',
      name: 'West Africa Bank',
      type: 'organization',
      riskLevel: 'neutral',
      details: {
        type: 'Financial Institution',
        location: 'Monrovia',
      },
    },
    {
      id: 'loc-1',
      name: 'Roberts Intl Airport',
      type: 'location',
      riskLevel: 'neutral',
      details: {
        type: 'Border Checkpoint',
        county: 'Margibi',
      },
    },
    {
      id: 'person-7',
      name: 'Patrick Junius',
      type: 'person',
      riskLevel: 'medium',
      details: {
        idNumber: 'LBR-2024-8240',
        relationship: 'Business Associate',
        location: 'Buchanan',
      },
    },
    {
      id: 'person-8',
      name: 'Mamie Flomo',
      type: 'person',
      riskLevel: 'low',
      details: {
        idNumber: 'LBR-2024-8241',
        relationship: 'Sister',
        location: 'Gbarnga',
      },
    },
  ],
  links: [
    {
      source: 'central-1',
      target: 'person-2',
      type: 'business',
      strength: 9,
      label: 'Co-owners of Global Trade Ltd',
      details: {
        since: '2019',
        frequency: 'Daily contact',
      },
    },
    {
      source: 'central-1',
      target: 'person-3',
      type: 'family',
      strength: 8,
      label: 'Brothers',
      details: {
        relationship: 'Siblings',
      },
    },
    {
      source: 'central-1',
      target: 'person-4',
      type: 'family',
      strength: 10,
      label: 'Married',
      details: {
        since: '2015',
        children: 2,
      },
    },
    {
      source: 'central-1',
      target: 'person-5',
      type: 'business',
      strength: 7,
      label: 'Frequent business transactions',
      details: {
        transactions: '23 in last 6 months',
        totalValue: '$234,000',
      },
    },
    {
      source: 'central-1',
      target: 'person-6',
      type: 'business',
      strength: 4,
      label: 'Employer-Employee',
      details: {
        position: 'Accountant',
        since: '2021',
      },
    },
    {
      source: 'central-1',
      target: 'org-1',
      type: 'business',
      strength: 10,
      label: 'Company Director',
      details: {
        role: 'Managing Director',
        ownership: '60%',
      },
    },
    {
      source: 'central-1',
      target: 'org-2',
      type: 'financial',
      strength: 6,
      label: 'Bank Account Holder',
      details: {
        accounts: 3,
        type: 'Business & Personal',
      },
    },
    {
      source: 'central-1',
      target: 'loc-1',
      type: 'travel',
      strength: 8,
      label: 'Frequent Traveler',
      details: {
        trips: '12 in last year',
        destinations: 'Nigeria, Ghana, Ivory Coast',
      },
    },
    {
      source: 'person-2',
      target: 'org-1',
      type: 'business',
      strength: 10,
      label: 'Company Director',
      details: {
        role: 'Finance Director',
        ownership: '40%',
      },
    },
    {
      source: 'person-2',
      target: 'person-5',
      type: 'business',
      strength: 5,
      label: 'Business contact',
      details: {
        meetings: '8 recorded',
      },
    },
    {
      source: 'person-3',
      target: 'person-8',
      type: 'family',
      strength: 8,
      label: 'Siblings',
    },
    {
      source: 'person-5',
      target: 'org-1',
      type: 'business',
      strength: 7,
      label: 'Major Client',
      details: {
        contracts: '15+ shipments',
      },
    },
    {
      source: 'person-5',
      target: 'loc-1',
      type: 'travel',
      strength: 9,
      label: 'Frequent Border Crosser',
      details: {
        crossings: '24 in last year',
      },
    },
    {
      source: 'person-6',
      target: 'org-1',
      type: 'business',
      strength: 6,
      label: 'Employee',
      details: {
        department: 'Finance',
      },
    },
    {
      source: 'person-7',
      target: 'org-1',
      type: 'business',
      strength: 5,
      label: 'Supplier',
      details: {
        supplies: 'Logistics services',
      },
    },
    {
      source: 'central-1',
      target: 'person-7',
      type: 'phone',
      strength: 6,
      label: 'Regular phone contact',
      details: {
        calls: '45 in last 3 months',
      },
    },
    {
      source: 'central-1',
      target: 'person-8',
      type: 'family',
      strength: 7,
      label: 'Siblings',
    },
    {
      source: 'person-4',
      target: 'person-8',
      type: 'family',
      strength: 5,
      label: 'Sister-in-law',
    },
  ],
};

// Sample network for overstay tracking
export const overstayNetwork: NetworkGraphData = {
  nodes: [
    {
      id: 'overstay-1',
      name: 'Ahmed Hassan',
      type: 'person',
      riskLevel: 'high',
      size: 10,
      details: {
        nationality: 'Nigerian',
        visaType: 'Tourist',
        entryDate: '2023-06-15',
        overstayDays: 145,
      },
    },
    {
      id: 'person-9',
      name: 'David Mensah',
      type: 'person',
      riskLevel: 'medium',
      details: {
        nationality: 'Ghanaian',
        relationship: 'Known Associate',
      },
    },
    {
      id: 'person-10',
      name: 'Fatima Koroma',
      type: 'person',
      riskLevel: 'low',
      details: {
        nationality: 'Sierra Leonean',
        relationship: 'Landlord',
      },
    },
    {
      id: 'loc-2',
      name: 'Guesthouse Paynesville',
      type: 'location',
      riskLevel: 'neutral',
      details: {
        type: 'Accommodation',
        address: 'Paynesville, Monrovia',
      },
    },
  ],
  links: [
    {
      source: 'overstay-1',
      target: 'person-9',
      type: 'associate',
      strength: 7,
      label: 'Frequent meetings',
      details: {
        locations: 'Red Light Market, Duala',
      },
    },
    {
      source: 'overstay-1',
      target: 'person-10',
      type: 'business',
      strength: 8,
      label: 'Renting accommodation',
      details: {
        since: '2023-06-16',
        rent: '$200/month',
      },
    },
    {
      source: 'overstay-1',
      target: 'loc-2',
      type: 'associate',
      strength: 9,
      label: 'Current residence',
      details: {
        checkIn: '2023-06-16',
      },
    },
  ],
};

// Sample network for surveillance tracking
export const surveillanceNetwork: NetworkGraphData = {
  nodes: [
    {
      id: 'target-1',
      name: 'Unknown Subject',
      type: 'person',
      riskLevel: 'critical',
      size: 10,
      details: {
        description: 'Male, approx 30-35 years',
        lastSeen: 'Camera 12 - NSA Headquarters',
      },
    },
    {
      id: 'vehicle-1',
      name: 'Black SUV',
      type: 'event',
      riskLevel: 'high',
      details: {
        plate: 'LBR-8234',
        make: 'Toyota Land Cruiser',
      },
    },
    {
      id: 'loc-3',
      name: 'NSA Headquarters',
      type: 'location',
      riskLevel: 'neutral',
      details: {
        type: 'Government Building',
      },
    },
    {
      id: 'loc-4',
      name: 'Capitol Building',
      type: 'location',
      riskLevel: 'neutral',
      details: {
        type: 'Government Building',
      },
    },
  ],
  links: [
    {
      source: 'target-1',
      target: 'vehicle-1',
      type: 'associate',
      strength: 9,
      label: 'Seen entering vehicle',
      details: {
        timestamp: '2024-01-15 14:23',
        camera: 'Camera 12',
      },
    },
    {
      source: 'target-1',
      target: 'loc-3',
      type: 'travel',
      strength: 7,
      label: 'Sighted multiple times',
      details: {
        sightings: 5,
        period: 'Last 2 weeks',
      },
    },
    {
      source: 'vehicle-1',
      target: 'loc-3',
      type: 'travel',
      strength: 8,
      label: 'Parked nearby',
    },
    {
      source: 'vehicle-1',
      target: 'loc-4',
      type: 'travel',
      strength: 6,
      label: 'Also sighted here',
      details: {
        date: '2024-01-14',
      },
    },
  ],
};

// Helper function to generate custom network data
export function generateNetworkData(
  centerPerson: {
    id: string;
    name: string;
    riskLevel: 'critical' | 'high' | 'medium' | 'low' | 'neutral';
  },
  connectionCount: number = 5
): NetworkGraphData {
  const nodes: GraphNode[] = [
    {
      id: centerPerson.id,
      name: centerPerson.name,
      type: 'person',
      riskLevel: centerPerson.riskLevel,
      size: 10,
    },
  ];

  const links: GraphLink[] = [];

  const names = [
    'John Doe',
    'Mary Smith',
    'James Brown',
    'Sarah Johnson',
    'Michael Williams',
    'Patricia Jones',
    'Robert Davis',
    'Jennifer Miller',
    'David Wilson',
    'Linda Moore',
  ];

  const relationshipTypes: Array<'family' | 'business' | 'phone' | 'travel' | 'financial' | 'associate'> = [
    'family',
    'business',
    'phone',
    'travel',
    'financial',
    'associate',
  ];

  for (let i = 0; i < connectionCount; i++) {
    const nodeId = `node-${i + 1}`;
    nodes.push({
      id: nodeId,
      name: names[i % names.length],
      type: 'person',
      riskLevel: i % 4 === 0 ? 'high' : i % 3 === 0 ? 'medium' : 'low',
    });

    links.push({
      source: centerPerson.id,
      target: nodeId,
      type: relationshipTypes[i % relationshipTypes.length],
      strength: Math.floor(Math.random() * 5) + 5, // 5-10
    });
  }

  return { nodes, links };
}
