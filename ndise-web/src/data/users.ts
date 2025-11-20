// Enhanced user model with multi-role and permission support
import type { Permission, ClearanceLevel } from '../lib/permissions';
import { getPermissionsForRole, mergePermissions } from '../lib/permissions';

export interface User {
  id: string;
  username: string;
  password: string; // In production, this would be hashed
  fullName: string;
  roles: string[]; // Multiple roles support
  permissions: Permission[]; // Computed from roles + custom permissions
  customPermissions?: Permission[]; // Additional permissions beyond role defaults
  clearanceLevel: ClearanceLevel;
  email: string;
  department: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'exec.admin',
    password: 'demo2024',
    fullName: 'Dr. Emmanuel Johnson',
    roles: ['executive'],
    permissions: getPermissionsForRole('executive'),
    clearanceLevel: 5,
    email: 'e.johnson@nsa.gov.lr',
    department: 'Office of the Director',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    username: 'enroll.officer',
    password: 'demo2024',
    fullName: 'Sarah Williams',
    roles: ['enrollment'],
    permissions: getPermissionsForRole('enrollment'),
    clearanceLevel: 3,
    email: 's.williams@civilregistry.gov.lr',
    department: 'Civil Registry',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100',
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z'
  },
  {
    id: '3',
    username: 'border.officer',
    password: 'demo2024',
    fullName: 'James Kollie',
    roles: ['border'],
    permissions: getPermissionsForRole('border'),
    clearanceLevel: 4,
    email: 'j.kollie@immigration.gov.lr',
    department: 'Immigration Services',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100',
    isActive: true,
    createdAt: '2024-02-10T00:00:00Z'
  },
  {
    id: '4',
    username: 'police.officer',
    password: 'demo2024',
    fullName: 'Officer Michael Brown',
    roles: ['police'],
    permissions: getPermissionsForRole('police'),
    clearanceLevel: 3,
    email: 'm.brown@lnp.gov.lr',
    department: 'Liberia National Police',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100',
    isActive: true,
    createdAt: '2024-02-15T00:00:00Z'
  },
  {
    id: '5',
    username: 'agency.partner',
    password: 'demo2024',
    fullName: 'Grace Taylor',
    roles: ['agency'],
    permissions: getPermissionsForRole('agency'),
    clearanceLevel: 2,
    email: 'g.taylor@ecobank.com',
    department: 'Ecobank Liberia',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100',
    isActive: true,
    createdAt: '2024-03-01T00:00:00Z'
  },
  {
    id: '6',
    username: 'multi.role',
    password: 'demo2024',
    fullName: 'David Mensah',
    roles: ['enrollment', 'border'], // Multi-role user
    permissions: mergePermissions([
      getPermissionsForRole('enrollment'),
      getPermissionsForRole('border')
    ]),
    clearanceLevel: 4,
    email: 'd.mensah@nsa.gov.lr',
    department: 'National Security Agency',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100&h=100',
    isActive: true,
    createdAt: '2024-03-15T00:00:00Z'
  },
  {
    id: '7',
    username: 'nsa.analyst',
    password: 'demo2024',
    fullName: 'Agent Sarah Mensah',
    roles: ['nsa'],
    permissions: getPermissionsForRole('nsa'),
    clearanceLevel: 5,
    email: 's.mensah@nsa.gov.lr',
    department: 'National Security Agency - Intelligence Division',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100',
    isActive: true,
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: '8',
    username: 'sys.admin',
    password: 'demo2024',
    fullName: 'Administrator',
    roles: ['admin'],
    permissions: getPermissionsForRole('admin'),
    clearanceLevel: 5,
    email: 'admin@nsa.gov.lr',
    department: 'IT Department',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100&h=100',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// Helper function to authenticate user
export const authenticateUser = (username: string, password: string): User | null => {
  const user = mockUsers.find(
    u => u.username === username && u.password === password && u.isActive
  );
  
  if (user) {
    // Update last login
    return {
      ...user,
      lastLogin: new Date().toISOString()
    };
  }
  
  return null;
};

// Helper function to get user by ID
export const getUserById = (id: string): User | null => {
  return mockUsers.find(u => u.id === id) || null;
};
