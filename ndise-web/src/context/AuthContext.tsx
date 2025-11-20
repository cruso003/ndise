import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authenticateUser, getUserById, type User } from '../data/users';
import type { Resource, Action } from '../lib/permissions';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../lib/permissions';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: string | string[]) => boolean;
  hasPermission: (resource: Resource, action: Action) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  canAccessRoute: (path: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'ndise_session';

// Route to permission mapping
const ROUTE_PERMISSIONS: Record<string, string[]> = {
  '/dashboard': ['dashboard:read'],
  '/enrollment': ['enrollment:read'],
  '/border': ['border:read'],
  '/police': ['police:read'],
  '/agency': ['agency:read'],
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session from localStorage on mount
  useEffect(() => {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (sessionData) {
      try {
        const { userId } = JSON.parse(sessionData);
        const storedUser = getUserById(userId);
        if (storedUser) {
          setUser(storedUser);
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      } catch (error) {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const authenticatedUser = authenticateUser(username, password);
    
    if (authenticatedUser) {
      // Remove password from stored user object
      const { password: _, ...userWithoutPassword } = authenticatedUser;
      setUser(userWithoutPassword as User);
      
      // Store session
      localStorage.setItem(SESSION_KEY, JSON.stringify({ 
        userId: authenticatedUser.id,
        timestamp: Date.now()
      }));
      
      return true;
    }
    
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  const hasRoleCheck = useCallback((role: string | string[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.some(r => user.roles.includes(r));
    }
    
    return user.roles.includes(role);
  }, [user]);

  const hasPermissionCheck = useCallback((resource: Resource, action: Action): boolean => {
    if (!user) return false;
    return hasPermission(user.permissions, resource, action);
  }, [user]);

  const hasAnyPermissionCheck = useCallback((permissions: string[]): boolean => {
    if (!user) return false;
    return hasAnyPermission(user.permissions, permissions);
  }, [user]);

  const hasAllPermissionsCheck = useCallback((permissions: string[]): boolean => {
    if (!user) return false;
    return hasAllPermissions(user.permissions, permissions);
  }, [user]);

  const canAccessRoute = useCallback((path: string): boolean => {
    if (!user) return false;
    
    const requiredPermissions = ROUTE_PERMISSIONS[path];
    if (!requiredPermissions) return true; // No specific permissions required
    
    return hasAnyPermission(user.permissions, requiredPermissions);
  }, [user]);

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    hasRole: hasRoleCheck,
    hasPermission: hasPermissionCheck,
    hasAnyPermission: hasAnyPermissionCheck,
    hasAllPermissions: hasAllPermissionsCheck,
    canAccessRoute
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
