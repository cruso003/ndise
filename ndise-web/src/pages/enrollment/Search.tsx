import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Alert } from '../../components/ui';
import DataTable from '../../components/DataTable';
import ConsolidatedProfileView from '../../components/ConsolidatedProfileView';
import { useToast } from '../../context/ToastContext';
import { consolidatePersonData } from '../../lib/apiIntegration';
import type { ColumnDef } from '@tanstack/react-table';
import type { ConsolidatedProfile } from '../../lib/apiIntegration';
import { Search as SearchIcon, Filter, X, Eye, Download } from 'lucide-react';

interface CitizenRecord {
  id: string;
  fullName: string;
  dateOfBirth: string;
  idNumber: string;
  phone: string;
  county: string;
  status: 'active' | 'inactive' | 'suspended';
  enrollmentDate: string;
}

export default function SearchCitizens() {
  const { showToast } = useToast();
  const [showFilters, setShowFilters] = useState(false);
  const [_selectedCitizen, setSelectedCitizen] = useState<string | null>(null);
  const [consolidatedProfile, setConsolidatedProfile] = useState<ConsolidatedProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    idNumber: '',
    phone: '',
    county: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  });

  // Mock data
  const citizenData: CitizenRecord[] = [
    {
      id: '1',
      fullName: 'John Doe',
      dateOfBirth: '1990-05-15',
      idNumber: 'LBR-2024-001234',
      phone: '+231 777 123 456',
      county: 'Montserrado',
      status: 'active',
      enrollmentDate: '2024-01-15',
    },
    {
      id: '2',
      fullName: 'Mary Johnson',
      dateOfBirth: '1985-08-22',
      idNumber: 'LBR-2024-001235',
      phone: '+231 777 234 567',
      county: 'Margibi',
      status: 'active',
      enrollmentDate: '2024-02-20',
    },
    {
      id: '3',
      fullName: 'David Williams',
      dateOfBirth: '1992-03-10',
      idNumber: 'LBR-2024-001236',
      phone: '+231 777 345 678',
      county: 'Bong',
      status: 'suspended',
      enrollmentDate: '2024-03-10',
    },
  ];

  const columns: ColumnDef<CitizenRecord>[] = [
    {
      accessorKey: 'idNumber',
      header: 'ID Number',
      cell: ({ row }) => (
        <span className="font-mono text-sm font-semibold">{row.original.idNumber}</span>
      ),
    },
    {
      accessorKey: 'fullName',
      header: 'Full Name',
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-[var(--color-text)]">{row.original.fullName}</div>
          <div className="text-xs text-[var(--color-text-secondary)]">DOB: {row.original.dateOfBirth}</div>
        </div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
    },
    {
      accessorKey: 'county',
      header: 'County',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const variants = {
          active: 'success' as const,
          inactive: 'default' as const,
          suspended: 'error' as const,
        };
        return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
      },
    },
    {
      accessorKey: 'enrollmentDate',
      header: 'Enrolled',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleView(row.original)}
            className="p-1 hover:bg-[var(--color-background)] rounded"
            title="View Consolidated Profile"
          >
            <Eye size={16} className="text-[var(--color-text-secondary)]" />
          </button>
          <button
            onClick={() => handleDownload(row.original.id)}
            className="p-1 hover:bg-[var(--color-background)] rounded"
            title="Download Record"
          >
            <Download size={16} className="text-[var(--color-text-secondary)]" />
          </button>
        </div>
      ),
    },
  ];

  const handleView = async (citizen: CitizenRecord) => {
    setLoading(true);
    setSelectedCitizen(citizen.id);
    
    try {
      // Consolidate data from all government systems
      const profile = await consolidatePersonData({
        name: citizen.fullName,
        dob: citizen.dateOfBirth,
        phone: citizen.phone,
        nationalID: citizen.idNumber,
      });
      
      setConsolidatedProfile(profile);
      showToast(`Loaded consolidated profile for ${citizen.fullName}`, 'success');
    } catch (error) {
      showToast('Failed to load consolidated profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (id: string) => {
    showToast(`Downloading record ${id}`, 'success');
  };

  const handleSearch = () => {
    showToast('Searching with filters...', 'info');
  };

  const handleClearFilters = () => {
    setFilters({
      name: '',
      idNumber: '',
      phone: '',
      county: '',
      status: '',
      dateFrom: '',
      dateTo: '',
    });
    showToast('Filters cleared', 'info');
  };

  const handleAcceptRecommendation = (recommendation: any) => {
    showToast(`Applied AI recommendation for ${recommendation.field}`, 'success');
  };

  const handleResolveConflict = (_conflict: any, _chosenValue: any) => {
    showToast(`Resolved conflict for ${_conflict.field}`, 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Search Citizens</h1>
        <p className="text-[var(--color-text-secondary)]">
          Search and lookup existing citizen records with identity consolidation
        </p>
      </div>

      {/* Quick Search */}
      <Card padding="md">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={20} />
              <input
                type="text"
                placeholder="Quick search by name, ID number, or phone..."
                className="w-full pl-10 pr-4 py-3 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
            </div>
          </div>
          <Button variant="primary" onClick={handleSearch}>
            <SearchIcon size={20} />
            Search
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
        </div>
      </Card>

      {/* Advanced Filters */}
      {showFilters && (
        <Card padding="md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Advanced Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                <X size={16} />
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={filters.name}
                  onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                  className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  ID Number
                </label>
                <input
                  type="text"
                  value={filters.idNumber}
                  onChange={(e) => setFilters({ ...filters, idNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  placeholder="LBR-YYYY-XXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={filters.phone}
                  onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  placeholder="+231 XXX XXX XXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  County
                </label>
                <select
                  value={filters.county}
                  onChange={(e) => setFilters({ ...filters, county: e.target.value })}
                  className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                >
                  <option value="">All Counties</option>
                  <option value="montserrado">Montserrado</option>
                  <option value="margibi">Margibi</option>
                  <option value="bong">Bong</option>
                  <option value="nimba">Nimba</option>
                  <option value="grand-bassa">Grand Bassa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Enrollment Date Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    className="flex-1 px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  />
                  <span className="flex items-center text-[var(--color-text-secondary)]">to</span>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                    className="flex-1 px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
              <Button variant="primary" onClick={handleSearch}>
                <SearchIcon size={16} />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consolidated Profile View */}
      {loading && (
        <Alert variant="info" title="Loading">
          Consolidating data from all government systems...
        </Alert>
      )}

      {consolidatedProfile && !loading && (
        <ConsolidatedProfileView
          profile={consolidatedProfile}
          onAcceptRecommendation={handleAcceptRecommendation}
          onResolveConflict={handleResolveConflict}
        />
      )}

      {/* Results Table */}
      <Card padding="md">
        <CardHeader>
          <CardTitle>Search Results ({citizenData.length} records)</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={citizenData}
            columns={columns}
            searchable={false}
            exportable
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}
