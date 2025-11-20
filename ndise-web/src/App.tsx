import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';

// Enrollment pages
import EnrollmentDashboard from './pages/enrollment/Dashboard';
import NewEnrollment from './pages/enrollment/NewEnrollment';
import EnrollmentQueue from './pages/enrollment/Queue';
import SearchCitizens from './pages/enrollment/Search';
import BatchOperations from './pages/enrollment/BatchOperations';
import IDCardPrinting from './pages/enrollment/IDCardPrinting';
import EnrollmentReports from './pages/enrollment/Reports';
import EnrollmentSettings from './pages/enrollment/Settings';

// Border Control pages
import BorderDashboard from './pages/border/Dashboard';
import LiveCrossings from './pages/border/LiveCrossings';
import WatchlistManagement from './pages/border/Watchlist';
import OverstayTracking from './pages/border/Overstay';
import VisaManagement from './pages/border/VisaManagement';
import BorderSearch from './pages/border/Search';
import BorderReports from './pages/border/Reports';
import BorderSettings from './pages/border/Settings';

// Police pages
import PoliceDashboard from './pages/police/Dashboard';
import PoliceSearch from './pages/police/Search';
import WantedPersons from './pages/police/WantedPersons';
import CaseManagement from './pages/police/CaseManagement';
import ETicketing from './pages/police/ETicketing';
import IncidentReports from './pages/police/IncidentReports';
import PoliceReports from './pages/police/Reports';
import PoliceSettings from './pages/police/Settings';

// Agency pages
import AgencyDashboard from './pages/agency/Dashboard';
import Verification from './pages/agency/Verification';
import BatchVerification from './pages/agency/BatchVerification';
import APIKeys from './pages/agency/APIKeys';
import APIDocumentation from './pages/agency/Documentation';
import AgencyReports from './pages/agency/Reports';
import AgencySettings from './pages/agency/Settings';

// Executive pages
import ExecutiveDashboard from './pages/executive/Dashboard';
import Analytics from './pages/executive/Analytics';
import ExecutiveReports from './pages/executive/Reports';
import SystemAlerts from './pages/executive/Alerts';
import AuditLogs from './pages/executive/AuditLogs';
import ExecutiveSettings from './pages/executive/Settings';

// NSA pages
import NSAOperationsCenter from './pages/nsa/OperationsCenter';
import NSASurveillance from './pages/nsa/Surveillance';
import NSATracking from './pages/nsa/Tracking';
import NSASignals from './pages/nsa/Signals';
import NSAReports from './pages/nsa/Reports';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/Users';
import RoleManagement from './pages/admin/Roles';
import AdminAuditLogs from './pages/admin/AuditLogs';
import SystemConfig from './pages/admin/SystemConfig';


import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

// Redirect component for root path
function RootRedirect() {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to user's primary dashboard based on their first role
  const primaryRole = user?.roles[0];
  const dashboardRoutes: Record<string, string> = {
    nsa: '/nsa/operations-center', // NSA goes to operations center (PRIMARY)
    executive: '/executive',
    enrollment: '/enrollment',
    border: '/border',
    police: '/police',
    agency: '/agency',
    admin: '/admin', // Admins go to admin dashboard
  };

  const redirectPath = primaryRole && dashboardRoutes[primaryRole] 
    ? dashboardRoutes[primaryRole] 
    : '/executive';

  return <Navigate to={redirectPath} replace />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<RootRedirect />} />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  
                  {/* NSA Operations Center (PRIMARY) */}
                  <Route path="/nsa">
                    <Route index element={<Navigate to="/nsa/operations-center" replace />} />
                    <Route 
                      path="operations-center" 
                      element={
                        <ProtectedRoute requiredPermissions={['nsa:read']}>
                          <NSAOperationsCenter />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="surveillance" 
                      element={
                        <ProtectedRoute requiredPermissions={['nsa:read']}>
                          <NSASurveillance />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="tracking" 
                      element={
                        <ProtectedRoute requiredPermissions={['nsa:read']}>
                          <NSATracking />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="signals" 
                      element={
                        <ProtectedRoute requiredPermissions={['nsa:read']}>
                          <NSASignals />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="reports" 
                      element={
                        <ProtectedRoute requiredPermissions={['nsa:read']}>
                          <NSAReports />
                        </ProtectedRoute>
                      } 
                    />
                  </Route>
                  
                  {/* Admin Dashboard */}
                  <Route path="/admin">
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route 
                      path="dashboard" 
                      element={
                        <ProtectedRoute requiredPermissions={['system:manage']}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="users" 
                      element={
                        <ProtectedRoute requiredPermissions={['system:manage']}>
                          <UserManagement />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="roles" 
                      element={
                        <ProtectedRoute requiredPermissions={['system:manage']}>
                          <RoleManagement />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="audit" 
                      element={
                        <ProtectedRoute requiredPermissions={['system:manage']}>
                          <AdminAuditLogs />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="config" 
                      element={
                        <ProtectedRoute requiredPermissions={['system:manage']}>
                          <SystemConfig />
                        </ProtectedRoute>
                      } 
                    />
                  </Route>
                  
                  {/* Enrollment Officer Dashboard */}
                  <Route path="/enrollment">
                    <Route index element={<Navigate to="/enrollment/dashboard" replace />} />
                    <Route 
                      path="dashboard" 
                      element={
                        <ProtectedRoute requiredPermissions={['enrollment:read']}>
                          <EnrollmentDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="new" 
                      element={
                        <ProtectedRoute requiredPermissions={['enrollment:write']}>
                          <NewEnrollment />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="queue" 
                      element={
                        <ProtectedRoute requiredPermissions={['enrollment:read']}>
                          <EnrollmentQueue />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="search" 
                      element={
                        <ProtectedRoute requiredPermissions={['enrollment:read']}>
                          <SearchCitizens />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="batch" 
                      element={
                        <ProtectedRoute requiredPermissions={['enrollment:write']}>
                          <BatchOperations />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="printing" 
                      element={
                        <ProtectedRoute requiredPermissions={['enrollment:read']}>
                          <IDCardPrinting />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="reports" 
                      element={
                        <ProtectedRoute requiredPermissions={['enrollment:read']}>
                          <EnrollmentReports />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="settings" 
                      element={
                        <ProtectedRoute requiredPermissions={['enrollment:read']}>
                          <EnrollmentSettings />
                        </ProtectedRoute>
                      } 
                    />
                  </Route>

                  {/* Border Control Dashboard */}
                  <Route path="/border">
                    <Route index element={<Navigate to="/border/dashboard" replace />} />
                    <Route 
                      path="dashboard" 
                      element={
                        <ProtectedRoute requiredPermissions={['border:read']}>
                          <BorderDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="live" 
                      element={
                        <ProtectedRoute requiredPermissions={['border:read']}>
                          <LiveCrossings />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="watchlist" 
                      element={
                        <ProtectedRoute requiredPermissions={['border:manage']}>
                          <WatchlistManagement />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="overstay" 
                      element={
                        <ProtectedRoute requiredPermissions={['border:read']}>
                          <OverstayTracking />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="visa" 
                      element={
                        <ProtectedRoute requiredPermissions={['border:write']}>
                          <VisaManagement />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="search" 
                      element={
                        <ProtectedRoute requiredPermissions={['border:read']}>
                          <BorderSearch />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="reports" 
                      element={
                        <ProtectedRoute requiredPermissions={['border:read']}>
                          <BorderReports />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="settings" 
                      element={
                        <ProtectedRoute requiredPermissions={['border:read']}>
                          <BorderSettings />
                        </ProtectedRoute>
                      } 
                    />
                  </Route>

                  {/* Police Portal */}
                  <Route path="/police">
                    <Route index element={<Navigate to="/police/dashboard" replace />} />
                    <Route 
                      path="dashboard" 
                      element={
                        <ProtectedRoute requiredPermissions={['police:read']}>
                          <PoliceDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="search" 
                      element={
                        <ProtectedRoute requiredPermissions={['police:read']}>
                          <PoliceSearch />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="wanted" 
                      element={
                        <ProtectedRoute requiredPermissions={['police:read']}>
                          <WantedPersons />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="cases" 
                      element={
                        <ProtectedRoute requiredPermissions={['police:write']}>
                          <CaseManagement />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="ticketing" 
                      element={
                        <ProtectedRoute requiredPermissions={['police:write']}>
                          <ETicketing />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="incidents" 
                      element={
                        <ProtectedRoute requiredPermissions={['police:write']}>
                          <IncidentReports />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="reports" 
                      element={
                        <ProtectedRoute requiredPermissions={['police:read']}>
                          <PoliceReports />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="settings" 
                      element={
                        <ProtectedRoute requiredPermissions={['police:read']}>
                          <PoliceSettings />
                        </ProtectedRoute>
                      } 
                    />
                  </Route>

                  {/* Agency Services */}
                  <Route path="/agency">
                    <Route index element={<Navigate to="/agency/dashboard" replace />} />
                    <Route 
                      path="dashboard" 
                      element={
                        <ProtectedRoute requiredPermissions={['agency:read']}>
                          <AgencyDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="verification" 
                      element={
                        <ProtectedRoute requiredPermissions={['agency:write']}>
                          <Verification />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="batch" 
                      element={
                        <ProtectedRoute requiredPermissions={['agency:write']}>
                          <BatchVerification />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="api-keys" 
                      element={
                        <ProtectedRoute requiredPermissions={['agency:read']}>
                          <APIKeys />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="documentation" 
                      element={
                        <ProtectedRoute requiredPermissions={['agency:read']}>
                          <APIDocumentation />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="reports" 
                      element={
                        <ProtectedRoute requiredPermissions={['agency:read']}>
                          <AgencyReports />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="settings" 
                      element={
                        <ProtectedRoute requiredPermissions={['agency:read']}>
                          <AgencySettings />
                        </ProtectedRoute>
                      } 
                    />
                  </Route>

                  {/* Executive Dashboard */}
                  <Route path="/executive">
                    <Route index element={<Navigate to="/executive/dashboard" replace />} />
                    <Route 
                      path="dashboard" 
                      element={
                        <ProtectedRoute requiredPermissions={['dashboard:read']}>
                          <ExecutiveDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="analytics" 
                      element={
                        <ProtectedRoute requiredPermissions={['analytics:read']}>
                          <Analytics />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="reports" 
                      element={
                        <ProtectedRoute requiredPermissions={['reports:read']}>
                          <ExecutiveReports />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="alerts" 
                      element={
                        <ProtectedRoute requiredPermissions={['dashboard:read']}>
                          <SystemAlerts />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="audit" 
                      element={
                        <ProtectedRoute requiredPermissions={['audit:read']}>
                          <AuditLogs />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="settings" 
                      element={
                        <ProtectedRoute requiredPermissions={['dashboard:read']}>
                          <ExecutiveSettings />
                        </ProtectedRoute>
                      } 
                    />
                  </Route>

                </Route>
              </Route>

              {/* Catch all - redirect to root */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
