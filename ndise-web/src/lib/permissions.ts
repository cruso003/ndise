// Permission system for granular access control

export type Resource = 
  | 'dashboard'
  | 'nsa'
  | 'enrollment'
  | 'border'
  | 'police'
  | 'agency'
  | 'reports'
  | 'analytics'
  | 'audit'
  | 'users'
  | 'system';

export type Action = 
  | 'read'
  | 'write'
  | 'delete'
  | 'approve'
  | 'export'
  | 'manage';

export interface Permission {
  resource: Resource;
  actions: Action[];
}

export type ClearanceLevel = 1 | 2 | 3 | 4 | 5;

// Helper to create permission string (e.g., "enrollment:read")
export function createPermissionString(resource: Resource, action: Action): string {
  return `${resource}:${action}`;
}

// Helper to parse permission string
export function parsePermissionString(permission: string): { resource: Resource; action: Action } | null {
  const [resource, action] = permission.split(':');
  if (!resource || !action) return null;
  return { resource: resource as Resource, action: action as Action };
}

// Check if user has specific permission
export function hasPermission(
  userPermissions: Permission[],
  resource: Resource,
  action: Action
): boolean {
  const permission = userPermissions.find(p => p.resource === resource);
  return permission ? permission.actions.includes(action) : false;
}

// Check if user has any of the specified permissions
export function hasAnyPermission(
  userPermissions: Permission[],
  requiredPermissions: string[]
): boolean {
  return requiredPermissions.some(perm => {
    const parsed = parsePermissionString(perm);
    if (!parsed) return false;
    return hasPermission(userPermissions, parsed.resource, parsed.action);
  });
}

// Check if user has all of the specified permissions
export function hasAllPermissions(
  userPermissions: Permission[],
  requiredPermissions: string[]
): boolean {
  return requiredPermissions.every(perm => {
    const parsed = parsePermissionString(perm);
    if (!parsed) return false;
    return hasPermission(userPermissions, parsed.resource, parsed.action);
  });
}

// Predefined permission sets for common roles
export const PERMISSION_SETS = {
  // NSA Analyst - full intelligence access
  nsa: [
    { resource: 'dashboard' as Resource, actions: ['read'] as Action[] },
    { resource: 'nsa' as Resource, actions: ['read', 'write', 'manage'] as Action[] },
    { resource: 'enrollment' as Resource, actions: ['read'] as Action[] },
    { resource: 'border' as Resource, actions: ['read'] as Action[] },
    { resource: 'police' as Resource, actions: ['read'] as Action[] },
    { resource: 'reports' as Resource, actions: ['read', 'export'] as Action[] },
    { resource: 'analytics' as Resource, actions: ['read'] as Action[] },
    { resource: 'audit' as Resource, actions: ['read'] as Action[] },
  ],
  
  // Executive - full read access to everything
  executive: [
    { resource: 'dashboard' as Resource, actions: ['read'] as Action[] },
    { resource: 'enrollment' as Resource, actions: ['read'] as Action[] },
    { resource: 'border' as Resource, actions: ['read'] as Action[] },
    { resource: 'police' as Resource, actions: ['read'] as Action[] },
    { resource: 'agency' as Resource, actions: ['read'] as Action[] },
    { resource: 'reports' as Resource, actions: ['read', 'export'] as Action[] },
    { resource: 'analytics' as Resource, actions: ['read'] as Action[] },
    { resource: 'audit' as Resource, actions: ['read'] as Action[] },
  ],

  // Enrollment officer - full access to enrollment
  enrollment: [
    { resource: 'dashboard' as Resource, actions: ['read'] as Action[] },
    { resource: 'enrollment' as Resource, actions: ['read', 'write', 'approve', 'export'] as Action[] },
    { resource: 'reports' as Resource, actions: ['read', 'export'] as Action[] },
    { resource: 'analytics' as Resource, actions: ['read'] as Action[] },
  ],

  // Border control officer - full access to border/immigration
  border: [
    { resource: 'dashboard' as Resource, actions: ['read'] as Action[] },
    { resource: 'border' as Resource, actions: ['read', 'write', 'approve', 'export'] as Action[] },
    { resource: 'reports' as Resource, actions: ['read', 'export'] as Action[] },
    { resource: 'analytics' as Resource, actions: ['read'] as Action[] },
  ],

  // Police officer - full access to police portal
  police: [
    { resource: 'dashboard' as Resource, actions: ['read'] as Action[] },
    { resource: 'police' as Resource, actions: ['read', 'write', 'approve', 'export'] as Action[] },
    { resource: 'reports' as Resource, actions: ['read', 'export'] as Action[] },
    { resource: 'analytics' as Resource, actions: ['read'] as Action[] },
  ],

  // Agency partner - limited access to agency services
  agency: [
    { resource: 'dashboard' as Resource, actions: ['read'] as Action[] },
    { resource: 'agency' as Resource, actions: ['read', 'export'] as Action[] },
    { resource: 'reports' as Resource, actions: ['read', 'export'] as Action[] },
  ],

  // System administrator - full access to everything
  admin: [
    { resource: 'dashboard' as Resource, actions: ['read', 'write', 'manage'] as Action[] },
    { resource: 'enrollment' as Resource, actions: ['read', 'write', 'delete', 'approve', 'export', 'manage'] as Action[] },
    { resource: 'border' as Resource, actions: ['read', 'write', 'delete', 'approve', 'export', 'manage'] as Action[] },
    { resource: 'police' as Resource, actions: ['read', 'write', 'delete', 'approve', 'export', 'manage'] as Action[] },
    { resource: 'agency' as Resource, actions: ['read', 'write', 'delete', 'approve', 'export', 'manage'] as Action[] },
    { resource: 'reports' as Resource, actions: ['read', 'write', 'export', 'manage'] as Action[] },
    { resource: 'analytics' as Resource, actions: ['read', 'manage'] as Action[] },
    { resource: 'audit' as Resource, actions: ['read', 'export'] as Action[] },
    { resource: 'users' as Resource, actions: ['read', 'write', 'delete', 'manage'] as Action[] },
    { resource: 'system' as Resource, actions: ['read', 'write', 'manage'] as Action[] },
  ],
};

// Get permissions for a role
export function getPermissionsForRole(role: string): Permission[] {
  return PERMISSION_SETS[role as keyof typeof PERMISSION_SETS] || [];
}

// Merge multiple permission sets (for multi-role users)
export function mergePermissions(permissionSets: Permission[][]): Permission[] {
  const merged = new Map<Resource, Set<Action>>();

  permissionSets.forEach(permissions => {
    permissions.forEach(({ resource, actions }) => {
      if (!merged.has(resource)) {
        merged.set(resource, new Set());
      }
      actions.forEach(action => merged.get(resource)!.add(action));
    });
  });

  return Array.from(merged.entries()).map(([resource, actions]) => ({
    resource,
    actions: Array.from(actions),
  }));
}
