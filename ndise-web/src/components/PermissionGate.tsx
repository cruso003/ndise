import { type ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Resource, Action } from '../lib/permissions';

interface PermissionGateProps {
  children: ReactNode;
  permissions?: string[]; // e.g., ['enrollment:write', 'enrollment:approve']
  resource?: Resource;
  action?: Action;
  requireAll?: boolean; // If true, user must have ALL permissions. If false, ANY permission is enough
  fallback?: ReactNode; // What to render if user doesn't have permission
}

/**
 * PermissionGate - Conditionally render children based on user permissions
 * 
 * Usage:
 * <PermissionGate permissions={['enrollment:approve']}>
 *   <button>Approve</button>
 * </PermissionGate>
 * 
 * Or:
 * <PermissionGate resource="enrollment" action="write">
 *   <button>Edit</button>
 * </PermissionGate>
 */
export default function PermissionGate({
  children,
  permissions,
  resource,
  action,
  requireAll = false,
  fallback = null
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

  let hasAccess = false;

  // Check using resource and action
  if (resource && action) {
    hasAccess = hasPermission(resource, action);
  }
  // Check using permission strings
  else if (permissions && permissions.length > 0) {
    hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }
  // No permissions specified - render children
  else {
    hasAccess = true;
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
