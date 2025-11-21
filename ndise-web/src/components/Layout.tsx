import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut,
  FileText,
  Search,
  Package,
  Printer,
  BarChart3,
  Settings,
  AlertTriangle,
  FileCheck,
  Briefcase,
  Ticket,
  Key,
  BookOpen,
  Bell,
  ChevronDown,
  Menu,
  X,
  Plus,
  List,
  Activity,
  Shield,
  ClipboardList,
  Users,
  Camera,
  Target,
  Radio,
  Zap,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';
import { hasAnyPermission } from '../lib/permissions';

interface NavItem {
  icon: React.ElementType;
  label: string;
  to: string;
  permissions: string[];
}

interface NavSection {
  title: string;
  items: NavItem[];
  permissions: string[];
}

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  active: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, to, active }) => (
  <Link
    to={to}
    className={clsx(
      "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm",
      active
        ? "bg-[var(--color-primary)] text-white shadow-md"
        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
    )}
  >
    <Icon size={18} />
    <span className="font-medium">{label}</span>
  </Link>
);

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  // Define navigation sections for each role
  const navigationSections: Record<string, NavSection[]> = {
    nsa: [
      {
        title: 'NSA Operations',
        permissions: ['nsa:read'],
        items: [
          { icon: Shield, label: 'Operations Center', to: '/nsa/operations-center', permissions: ['nsa:read'] },
          { icon: Zap, label: 'AI Command Center', to: '/nsa/ai-command', permissions: ['nsa:read'] },
          { icon: Camera, label: 'Surveillance (CCTV)', to: '/nsa/surveillance', permissions: ['nsa:read'] },
          { icon: Target, label: 'Target Tracking', to: '/nsa/tracking', permissions: ['nsa:read'] },
          { icon: Radio, label: 'Signals Intelligence', to: '/nsa/signals', permissions: ['nsa:read'] },
          { icon: FileText, label: 'Intel Reports', to: '/nsa/reports', permissions: ['nsa:read'] },
        ],
      },
    ],
    enrollment: [
      {
        title: 'Enrollment',
        permissions: ['enrollment:read'],
        items: [
          { icon: LayoutDashboard, label: 'Dashboard', to: '/enrollment/dashboard', permissions: ['enrollment:read'] },
          { icon: Plus, label: 'New Enrollment', to: '/enrollment/new', permissions: ['enrollment:write'] },
          { icon: List, label: 'Enrollment Queue', to: '/enrollment/queue', permissions: ['enrollment:read'] },
          { icon: Search, label: 'Search Citizens', to: '/enrollment/search', permissions: ['enrollment:read'] },
          { icon: Package, label: 'Batch Operations', to: '/enrollment/batch', permissions: ['enrollment:write'] },
          { icon: Printer, label: 'ID Card Printing', to: '/enrollment/printing', permissions: ['enrollment:read'] },
          { icon: FileText, label: 'Reports', to: '/enrollment/reports', permissions: ['enrollment:read'] },
          { icon: Settings, label: 'Settings', to: '/enrollment/settings', permissions: ['enrollment:read'] },
        ],
      },
    ],
    border: [
      {
        title: 'Border Control',
        permissions: ['border:read'],
        items: [
          { icon: LayoutDashboard, label: 'Dashboard', to: '/border/dashboard', permissions: ['border:read'] },
          { icon: Activity, label: 'Live Crossings', to: '/border/live', permissions: ['border:read'] },
          { icon: AlertTriangle, label: 'Watchlist', to: '/border/watchlist', permissions: ['border:manage'] },
          { icon: Bell, label: 'Overstay Tracking', to: '/border/overstay', permissions: ['border:read'] },
          { icon: FileCheck, label: 'Visa Management', to: '/border/visa', permissions: ['border:write'] },
          { icon: Search, label: 'Search & Verify', to: '/border/search', permissions: ['border:read'] },
          { icon: FileText, label: 'Reports', to: '/border/reports', permissions: ['border:read'] },
          { icon: Settings, label: 'Settings', to: '/border/settings', permissions: ['border:read'] },
        ],
      },
    ],
    police: [
      {
        title: 'Police Portal',
        permissions: ['police:read'],
        items: [
          { icon: LayoutDashboard, label: 'Dashboard', to: '/police/dashboard', permissions: ['police:read'] },
          { icon: Search, label: 'Search & Verify', to: '/police/search', permissions: ['police:read'] },
          { icon: Shield, label: 'Wanted Persons', to: '/police/wanted', permissions: ['police:read'] },
          { icon: Briefcase, label: 'Case Management', to: '/police/cases', permissions: ['police:write'] },
          { icon: Ticket, label: 'E-Ticketing', to: '/police/ticketing', permissions: ['police:write'] },
          { icon: ClipboardList, label: 'Incident Reports', to: '/police/incidents', permissions: ['police:write'] },
          { icon: FileText, label: 'Reports', to: '/police/reports', permissions: ['police:read'] },
          { icon: Settings, label: 'Settings', to: '/police/settings', permissions: ['police:read'] },
        ],
      },
    ],
    agency: [
      {
        title: 'Agency Services',
        permissions: ['agency:read'],
        items: [
          { icon: LayoutDashboard, label: 'Dashboard', to: '/agency/dashboard', permissions: ['agency:read'] },
          { icon: Search, label: 'Quick Verification', to: '/agency/verification', permissions: ['agency:read'] },
          { icon: Package, label: 'Batch Verification', to: '/agency/batch', permissions: ['agency:read'] },
          { icon: ClipboardList, label: 'Verification History', to: '/agency/history', permissions: ['agency:read'] },
          { icon: Bell, label: 'Alerts & Notifications', to: '/agency/alerts', permissions: ['agency:read'] },
          { icon: FileText, label: 'Reports', to: '/agency/reports', permissions: ['agency:read'] },
          { icon: Settings, label: 'Settings', to: '/agency/settings', permissions: ['agency:read'] },
        ],
      },
    ],
    executive: [
      {
        title: 'Executive',
        permissions: ['dashboard:read'],
        items: [
          { icon: LayoutDashboard, label: 'Overview', to: '/executive/dashboard', permissions: ['dashboard:read'] },
          { icon: BarChart3, label: 'Analytics', to: '/executive/analytics', permissions: ['analytics:read'] },
          { icon: FileText, label: 'Reports', to: '/executive/reports', permissions: ['reports:read'] },
          { icon: Bell, label: 'System Alerts', to: '/executive/alerts', permissions: ['dashboard:read'] },
          { icon: Shield, label: 'Audit Logs', to: '/executive/audit', permissions: ['audit:read'] },
          { icon: Settings, label: 'Settings', to: '/executive/settings', permissions: ['dashboard:read'] },
        ],
      },
    ],
    admin: [
      {
        title: 'System Administration',
        permissions: ['system:manage'],
        items: [
          { icon: LayoutDashboard, label: 'Admin Dashboard', to: '/admin/dashboard', permissions: ['system:manage'] },
          { icon: Users, label: 'User Management', to: '/admin/users', permissions: ['system:manage'] },
          { icon: Shield, label: 'Role Management', to: '/admin/roles', permissions: ['system:manage'] },
          { icon: FileText, label: 'Audit Logs', to: '/admin/audit', permissions: ['system:manage'] },
          { icon: Settings, label: 'System Config', to: '/admin/config', permissions: ['system:manage'] },
        ],
      },
    ],
  };

  // Get navigation sections for user's roles
  const userNavSections: NavSection[] = [];
  if (user) {
    user.roles.forEach(role => {
      const sections = navigationSections[role];
      if (sections) {
        sections.forEach(section => {
          // Check if user has permission for this section
          if (hasAnyPermission(user.permissions, section.permissions)) {
            // Filter items based on permissions
            const allowedItems = section.items.filter(item =>
              hasAnyPermission(user.permissions, item.permissions)
            );
            if (allowedItems.length > 0) {
              userNavSections.push({
                ...section,
                items: allowedItems,
              });
            }
          }
        });
      }
    });
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex">
      {/* Sidebar */}
      <aside className={clsx(
        "fixed inset-y-0 left-0 z-50 w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center px-6 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[var(--color-secondary)] rounded-lg flex items-center justify-center text-white font-bold">
              N
            </div>
            <span className="text-xl font-bold text-[var(--color-text)]">NDISE</span>
          </div>
          <button
            className="ml-auto lg:hidden text-[var(--color-text)]"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-8rem)]">
          {userNavSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 px-4">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <SidebarItem
                    key={item.to}
                    {...item}
                    active={location.pathname === item.to}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--color-background)] transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-slate-600">
                    {user?.fullName.split(' ').map(n => n[0]).join('')}
                  </span>
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-[var(--color-text)]">{user?.fullName}</p>
                <p className="text-xs text-[var(--color-text-secondary)] capitalize">{user?.roles.join(', ')}</p>
              </div>
              <ChevronDown size={16} className={clsx(
                "text-[var(--color-text-secondary)] transition-transform",
                isProfileOpen && "rotate-180"
              )} />
            </button>

            {isProfileOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-lg overflow-hidden">
                <div className="p-3 border-b border-[var(--color-border)]">
                  <p className="text-xs text-[var(--color-text-secondary)]">Signed in as</p>
                  <p className="text-sm font-medium text-[var(--color-text)]">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center px-4">
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-[var(--color-text)]">
            <Menu size={24} />
          </button>
          <span className="ml-4 font-bold text-[var(--color-text)]">NDISE Portal</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
