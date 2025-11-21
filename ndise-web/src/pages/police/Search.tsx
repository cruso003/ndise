import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, User, AlertTriangle, ExternalLink, Shield, FileText, Download, CheckCircle } from 'lucide-react';
import ConsolidatedProfileView from '../../components/ConsolidatedProfileView';
import { consolidatePersonData } from '../../lib/apiIntegration';
import { addToWatchlist } from '../../services/watchlistService';
import { createAlert } from '../../services/alertService';
import { useToast } from '../../context/ToastContext';
import { generatePoliceReport } from '../../utils/pdfGenerator';

export default function Search() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchType, setSearchType] = useState<'national_id' | 'passport' | 'name'>('national_id');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'wanted' | 'case' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Simulate search delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // For demo, use consolidatePersonData with a known ID
      const result = await consolidatePersonData({ 
        nationalID: '1990010112345678',
        name: 'Demo User',
        dob: '1990-01-01'
      });
      setSelectedPerson(result);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddToWanted = async () => {
    if (!selectedPerson) return;

    setIsProcessing(true);
    setShowConfirmModal(false);

    try {
      // Add to unified watchlist
      addToWatchlist({
        nationalId: selectedPerson.nationalId,
        personName: selectedPerson.name || 'Unknown',
        reason: `Added to wanted list by Police Department. Active investigation.`,
        reasonCode: 'wanted_criminal',
        severity: 'high',
        addedBy: 'Police',
        addedByUser: 'Officer Marcus Johnson',
        actions: [
          {
            type: 'notify_agency',
            description: 'Person added to national wanted list - Arrest on sight',
            agencies: ['police', 'border', 'nsa'],
          },
          {
            type: 'notify_agency',
            description: 'All checkpoints notified - Active warrant issued',
            agencies: ['border'],
          },
        ],
      });

      // Create alert
      createAlert({
        type: 'watchlist',
        severity: 'high',
        title: 'WANTED: Person Added to National Watchlist',
        message: `${selectedPerson.name} has been added to the national wanted list by Police. Arrest on sight. Active warrant issued.`,
        targetAgencies: ['police', 'border', 'nsa'],
        createdBy: 'Police',
        createdByUser: 'Officer Marcus Johnson',
      });

      showToast(`${selectedPerson.name} added to national wanted list. All agencies notified.`, 'success');
    } catch (error) {
      showToast('Failed to add to wanted list. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateCase = async () => {
    if (!selectedPerson) return;

    setIsProcessing(true);
    setShowConfirmModal(false);

    try {
      // Simulate case creation
      const caseId = `CASE-${Date.now()}`;

      // Create alert for case creation
      createAlert({
        type: 'intelligence',
        severity: 'medium',
        title: 'New Investigation Case Created',
        message: `Case ${caseId} opened for ${selectedPerson.name}. Assigned to Officer Marcus Johnson.`,
        targetAgencies: ['police'],
        createdBy: 'Police',
        createdByUser: 'Officer Marcus Johnson',
      });

      showToast(`Case ${caseId} created successfully. Investigation opened.`, 'success');
    } catch (error) {
      showToast('Failed to create case. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrintReport = () => {
    if (!selectedPerson) return;

    try {
      showToast('Generating police report...', 'info');

      setTimeout(() => {
        generatePoliceReport(selectedPerson);
        showToast('Report generated successfully! Check your downloads.', 'success');
      }, 500);
    } catch (error) {
      showToast('Failed to generate report. Please try again.', 'error');
      console.error('PDF generation error:', error);
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
          {/* Action Buttons */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setConfirmAction('wanted');
                    setShowConfirmModal(true);
                  }}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
                >
                  <Shield className="w-4 h-4" />
                  {isProcessing && confirmAction === 'wanted' ? 'Processing...' : 'Add to Wanted List'}
                </button>
                <button
                  onClick={() => {
                    setConfirmAction('case');
                    setShowConfirmModal(true);
                  }}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 font-medium"
                >
                  <FileText className="w-4 h-4" />
                  {isProcessing && confirmAction === 'case' ? 'Processing...' : 'Create Case'}
                </button>
                <button
                  onClick={handlePrintReport}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
                >
                  <Download className="w-4 h-4" />
                  Print Report
                </button>
              </div>
              <button
                onClick={() => navigate(`/id/${selectedPerson.nationalId}`)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-medium transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View Full Profile Page
              </button>
            </div>
          </div>
          <button 
            onClick={() => setSelectedPerson(null)}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
          >
            ← Back to Search
          </button>
          <ConsolidatedProfileView profile={selectedPerson} />
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

      {/* Confirmation Modal */}
      {showConfirmModal && selectedPerson && confirmAction && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            {confirmAction === 'wanted' ? (
              <>
                {/* Add to Wanted List Confirmation */}
                <div className="bg-red-600 px-6 py-4 rounded-t-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Add to Wanted List</h3>
                      <p className="text-red-100 text-sm">Issue national arrest warrant</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-900 mb-1">You are adding to wanted list:</p>
                        <p className="text-lg font-bold text-red-800">{selectedPerson.name || 'Unknown Person'}</p>
                        <p className="text-sm text-red-700 mt-1">ID: {selectedPerson.nationalId}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle className="w-4 h-4 text-slate-500" />
                      <span>Person added to national wanted list</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle className="w-4 h-4 text-slate-500" />
                      <span>Alert broadcast to Police, Border, and NSA</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle className="w-4 h-4 text-slate-500" />
                      <span>All checkpoints notified - Arrest on sight</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle className="w-4 h-4 text-slate-500" />
                      <span>Active warrant issued immediately</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 italic">
                    This is a critical law enforcement action. Please ensure proper authorization.
                  </p>
                </div>
                <div className="bg-slate-50 px-6 py-4 rounded-b-xl flex items-center justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowConfirmModal(false);
                      setConfirmAction(null);
                    }}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddToWanted}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
                  >
                    Issue Warrant
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Create Case Confirmation */}
                <div className="bg-orange-600 px-6 py-4 rounded-t-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Create Investigation Case</h3>
                      <p className="text-orange-100 text-sm">Open new police case file</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-orange-900 mb-1">Creating case for:</p>
                        <p className="text-lg font-bold text-orange-800">{selectedPerson.name || 'Unknown Person'}</p>
                        <p className="text-sm text-orange-700 mt-1">ID: {selectedPerson.nationalId}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle className="w-4 h-4 text-slate-500" />
                      <span>New case file created in system</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle className="w-4 h-4 text-slate-500" />
                      <span>Case assigned to current officer</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle className="w-4 h-4 text-slate-500" />
                      <span>Linked to NDISE profile for updates</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle className="w-4 h-4 text-slate-500" />
                      <span>Investigation timeline started</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 px-6 py-4 rounded-b-xl flex items-center justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowConfirmModal(false);
                      setConfirmAction(null);
                    }}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateCase}
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
                  >
                    Create Case
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
