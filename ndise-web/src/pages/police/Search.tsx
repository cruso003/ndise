import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, User, AlertTriangle, ExternalLink } from 'lucide-react';
import ConsolidatedProfileView from '../../components/ConsolidatedProfileView';
import { consolidatePersonData } from '../../lib/apiIntegration';

export default function Search() {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState<'national_id' | 'passport' | 'name'>('national_id');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<any>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Simulate search delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo, use consolidatePersonData with a known ID
      const result = await consolidatePersonData('1990010112345678');
      setSelectedPerson(result);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Search & Verify</h1>
        <p className="text-slate-600 mt-1">Search citizen records and verify identities</p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Search By:</label>
            <div className="flex gap-4">
              <button
                onClick={() => setSearchType('national_id')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  searchType === 'national_id'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                National ID
              </button>
              <button
                onClick={() => setSearchType('passport')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  searchType === 'passport'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Passport
              </button>
              <button
                onClick={() => setSearchType('name')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  searchType === 'name'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Name
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {searchType === 'national_id' && 'National ID Number'}
              {searchType === 'passport' && 'Passport Number'}
              {searchType === 'name' && 'Full Name'}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={
                    searchType === 'national_id' ? 'e.g., 1990010112345678' :
                    searchType === 'passport' ? 'e.g., A12345678' :
                    'e.g., John Doe'
                  }
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Quick Search Examples */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Quick test:</span>
            <button
              onClick={() => {
                setSearchType('national_id');
                setSearchQuery('1990010112345678');
              }}
              className="text-blue-600 hover:underline"
            >
              1990010112345678
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {selectedPerson ? (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => navigate(`/id/${selectedPerson.nationalId}`)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Full Profile Page
            </button>
          </div>
          <ConsolidatedProfileView person={selectedPerson} onClose={() => setSelectedPerson(null)} />
        </div>
      ) : searchQuery && !isSearching && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No Results Found</h3>
          <p className="text-slate-600">
            No person found matching "{searchQuery}". Try a different search term.
          </p>
        </div>
      )}

      {!selectedPerson && !searchQuery && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-bold text-blue-900 mb-1">🤖 AI-Powered Search</h3>
              <p className="text-sm text-blue-800">
                Search retrieves consolidated profiles from all government agencies (15+). 
                Results include criminal records, warrants, ID verification, and AI risk scoring.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
