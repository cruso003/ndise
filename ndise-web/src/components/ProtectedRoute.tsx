import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  requiredPermissions?: string[]; // e.g., ['enrollment:read', 'enrollment:write']
  requireAll?: boolean; // If true, user must have ALL permissions. If false, ANY permission is enough
  children?: React.ReactNode;
}

export default function ProtectedRoute({ 
  requiredPermissions, 
  requireAll = false,
  children 
}: ProtectedRouteProps) {
  const { isAuthenticated, hasAnyPermission, hasAllPermissions } = useAuth();

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check permission-based access if permissions are specified
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAccess = requireAll
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);

    if (!hasAccess) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Render children if provided, otherwise render outlet for nested routes
  return children ? <>{children}</> : <Outlet />;
}
