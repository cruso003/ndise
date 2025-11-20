import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Unauthorized() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
          <ShieldAlert className="text-red-600" size={40} />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Access Denied</h1>
        
        <p className="text-slate-600 mb-2">
          You don't have permission to access this page.
        </p>
                {user && (
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              Your current role ({user.roles.join(', ')}) does not have permission to access this resource.
            </p>
          )}

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
        >
          <Home size={20} />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
