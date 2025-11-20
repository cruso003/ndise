import { useState } from 'react';
import { 
  Users, Shield, Settings, Activity, Plus, 
  Edit, Trash2, Lock, Unlock, Search, Filter
} from 'lucide-react';
import { StatCard } from '../../components/ui';

interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  roles: string[];
  department: string;
  status: 'active' | 'inactive' | 'locked';
  lastLogin: string;
  createdAt: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState<'users' | 'roles' | 'audit' | 'system'>('users');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock users
  const users: User[] = [
    {
      id: '1',
      username: 'nsa.analyst',
      fullName: 'Agent Sarah Mensah',
      email: 's.mensah@nsa.gov.lr',
      roles: ['nsa'],
      department: 'National Security Agency',
      status: 'active',
      lastLogin: '2 hours ago',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      username: 'exec.admin',
      fullName: 'Hon. James Karnley',
      email: 'j.karnley@moj.gov.lr',
      roles: ['executive'],
      department: 'Ministry of Justice',
      status: 'active',
      lastLogin: '5 hours ago',
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      username: 'border.officer',
      fullName: 'Officer Mary Toe',
      email: 'm.toe@immigration.gov.lr',
      roles: ['border'],
      department: 'Immigration Services',
      status: 'active',
      lastLogin: '1 hour ago',
      createdAt: '2024-02-01'
    },
    {
      id: '4',
      username: 'enroll.officer',
      fullName: 'Officer Thomas Kpan',
      email: 't.kpan@civilregistry.gov.lr',
      roles: ['enrollment'],
      department: 'Civil Registry',
      status: 'active',
      lastLogin: '30 minutes ago',
      createdAt: '2024-02-15'
    },
    {
      id: '5',
      username: 'police.officer',
      fullName: 'Detective Grace Kollie',
      email: 'g.kollie@lnp.gov.lr',
      roles: ['police'],
      department: 'Liberia National Police',
      status: 'active',
      lastLogin: '3 hours ago',
      createdAt: '2024-03-01'
    },
    {
      id: '6',
      username: 'agency.partner',
      fullName: 'Janet Williams',
      email: 'j.williams@ecobank.com',
      roles: ['agency'],
      department: 'Ecobank Liberia',
      status: 'active',
      lastLogin: '1 day ago',
      createdAt: '2024-04-01'
    },
    {
      id: '7',
      username: 'john.deactivated',
      fullName: 'John Smith',
      email: 'j.smith@example.com',
      roles: ['enrollment'],
      department: 'Civil Registry',
      status: 'inactive',
      lastLogin: '30 days ago',
      createdAt: '2023-06-01'
    }
  ];

  // Mock roles
  const roles: Role[] = [
    {
      id: 'nsa',
      name: 'NSA Analyst',
      description: 'National Security intelligence operations and threat monitoring',
      permissions: ['nsa:read', 'nsa:write', 'dashboard:read', 'analytics:read', 'ai:full'],
      userCount: 12
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'Strategic oversight and system-wide monitoring',
      permissions: ['dashboard:read', 'analytics:read', 'reports:read', 'audit:read'],
      userCount: 8
    },
    {
      id: 'border',
      name: 'Border Control Officer',
      description: 'Immigration and border crossing operations',
      permissions: ['border:read', 'border:write', 'dashboard:read', 'ai:risk_score'],
      userCount: 45
    },
    {
      id: 'enrollment',
      name: 'Enrollment Officer',
      description: 'Citizen registration and ID issuance',
      permissions: ['enrollment:read', 'enrollment:write', 'dashboard:read', 'ai:duplicate_detection'],
      userCount: 78
    },
    {
      id: 'police',
      name: 'Police Officer',
      description: 'Law enforcement and criminal investigations',
      permissions: ['police:read', 'police:write', 'dashboard:read', 'ai:network_analysis'],
      userCount: 34
    },
    {
      id: 'agency',
      name: 'Agency Partner',
      description: 'External partner API access (banks, telcos)',
      permissions: ['agency:read', 'api:verify'],
      userCount: 15
    },
    {
      id: 'admin',
      name: 'System Administrator',
      description: 'Full system access and user management',
      permissions: ['*:*'],
      userCount: 3
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'locked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      nsa: 'bg-red-100 text-red-800',
      executive: 'bg-purple-100 text-purple-800',
      border: 'bg-blue-100 text-blue-800',
      enrollment: 'bg-green-100 text-green-800',
      police: 'bg-orange-100 text-orange-800',
      agency: 'bg-cyan-100 text-cyan-800',
      admin: 'bg-slate-800 text-white'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">System Administration</h1>
        <p className="text-slate-600 mt-1">User management, roles, and system configuration</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={users.length.toString()}
          subtitle={`${users.filter(u => u.status === 'active').length} active`}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Roles Defined"
          value={roles.length.toString()}
          subtitle="System-wide"
          icon={Shield}
          color="purple"
        />
        <StatCard
          title="Active Sessions"
          value="45"
          subtitle="Currently logged in"
          icon={Activity}
          color="green"
        />
        <StatCard
          title="System Health"
          value="98%"
          subtitle="All services operational"
          icon={Settings}
          color="orange"
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <div className="flex gap-4 px-6">
            <button
              onClick={() => setSelectedTab('users')}
              className={`py-4 px-4 font-medium border-b-2 transition-colors ${
                selectedTab === 'users'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                User Management
              </div>
            </button>
            <button
              onClick={() => setSelectedTab('roles')}
              className={`py-4 px-4 font-medium border-b-2 transition-colors ${
                selectedTab === 'roles'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Roles & Permissions
              </div>
            </button>
            <button
              onClick={() => setSelectedTab('audit')}
              className={`py-4 px-4 font-medium border-b-2 transition-colors ${
                selectedTab === 'audit'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Audit Trail
              </div>
            </button>
            <button
              onClick={() => setSelectedTab('system')}
              className={`py-4 px-4 font-medium border-b-2 transition-colors ${
                selectedTab === 'system'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                System Config
              </div>
            </button>
          </div>
        </div>

        {/* User Management Tab */}
        {selectedTab === 'users' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                Add User
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">User</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Roles</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Department</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Last Login</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-slate-900">{user.fullName}</div>
                          <div className="text-sm text-slate-500">{user.email}</div>
                          <div className="text-xs text-slate-400">@{user.username}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1 flex-wrap">
                          {user.roles.map((role) => (
                            <span
                              key={role}
                              className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadgeColor(role)}`}
                            >
                              {role.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">{user.department}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">{user.lastLogin}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          {user.status === 'active' && (
                            <button className="p-1.5 text-orange-600 hover:bg-orange-50 rounded" title="Lock">
                              <Lock className="w-4 h-4" />
                            </button>
                          )}
                          {user.status === 'locked' && (
                            <button className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Unlock">
                              <Unlock className="w-4 h-4" />
                            </button>
                          )}
                          <button className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Roles & Permissions Tab */}
        {selectedTab === 'roles' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">System Roles</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                Create Role
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => (
                <div key={role.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-slate-900">{role.name}</h4>
                      <p className="text-sm text-slate-600 mt-1">{role.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadgeColor(role.id)}`}>
                      {role.userCount} users
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className="text-xs font-semibold text-slate-700 mb-2">Permissions:</div>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 4).map((perm, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                          {perm}
                        </span>
                      ))}
                      {role.permissions.length > 4 && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                          +{role.permissions.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 text-xs bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">
                      Edit Role
                    </button>
                    <button className="text-xs bg-slate-100 text-slate-700 px-3 py-2 rounded hover:bg-slate-200">
                      View Users
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other tabs placeholders */}
        {selectedTab === 'audit' && (
          <div className="p-6">
            <div className="text-center py-12 text-slate-500">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Audit trail showing all system activities</p>
              <p className="text-sm mt-2">User logins, data access, configuration changes</p>
            </div>
          </div>
        )}

        {selectedTab === 'system' && (
          <div className="p-6">
            <div className="text-center py-12 text-slate-500">
              <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>System configuration and settings</p>
              <p className="text-sm mt-2">Database, API keys, integrations, backups</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
