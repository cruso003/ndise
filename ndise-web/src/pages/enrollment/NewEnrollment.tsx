import { useState } from 'react';
import { Card, CardContent, Button, Alert } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { ChevronRight, ChevronLeft, User, Fingerprint, FileText, CheckCircle } from 'lucide-react';

type Step = 'personal' | 'biometric' | 'documents' | 'review';

import { consolidatePersonData, type ConsolidatedProfile } from '../../lib/apiIntegration';
import ConsolidatedProfileView from '../../components/ConsolidatedProfileView';

export default function NewEnrollment() {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [isChecking, setIsChecking] = useState(false);
  const [duplicateProfile, setDuplicateProfile] = useState<ConsolidatedProfile | null>(null);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    placeOfBirth: '',
    nationality: 'Liberian',
    // Contact
    phone: '',
    email: '',
    address: '',
    county: '',
    district: '',
    // Biometric
    fingerprints: false,
    photo: false,
    signature: false,
    // Documents
    birthCertificate: false,
    proofOfAddress: false,
    parentId: false,
  });

  const steps: { id: Step; label: string; icon: any }[] = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'biometric', label: 'Biometric Capture', icon: Fingerprint },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'review', label: 'Review & Submit', icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const handleNext = async () => {
    if (currentStep === 'personal') {
      // Basic validation
      if (!formData.firstName || !formData.lastName || !formData.dateOfBirth) {
        showToast('Please fill in all required fields', 'error');
        return;
      }
      // Proceed to biometric step
      setCurrentStep('biometric');
      return;
    }

    if (currentStep === 'biometric' && !duplicateProfile) {
      // Validate biometrics
      if (!formData.fingerprints || !formData.photo) {
        showToast('Please capture fingerprints and photo', 'error');
        return;
      }

      setIsChecking(true);
      try {
        const profile = await consolidatePersonData({
          name: `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim(),
          dob: formData.dateOfBirth,
          phone: formData.phone,
          fingerprints: formData.fingerprints
        });

        // If we found existing NDISE record, show warning
        if (profile.ndise) {
          setDuplicateProfile(profile);
          showToast('Potential duplicate record found', 'info');
          setIsChecking(false);
          return;
        }
      } catch (error) {
        console.error('Error checking duplicates:', error);
      } finally {
        setIsChecking(false);
      }
    }

    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (duplicateProfile) {
      setDuplicateProfile(null);
      return;
    }
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  const handleSubmit = () => {
    showToast('Enrollment submitted successfully!', 'success');
    // Reset form
    setCurrentStep('personal');
    setFormData({
      firstName: '', middleName: '', lastName: '', dateOfBirth: '', gender: '',
      placeOfBirth: '', nationality: 'Liberian', phone: '', email: '',
      address: '', county: '', district: '', fingerprints: false, photo: false,
      signature: false, birthCertificate: false, proofOfAddress: false, parentId: false
    });
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">New Enrollment</h1>
        <p className="text-[var(--color-text-secondary)]">Register a new citizen in the national identity system</p>
      </div>

      {/* Progress Steps */}
      <Card padding="md">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = index < currentStepIndex;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      isActive
                        ? 'bg-[var(--color-primary)] text-white'
                        : isCompleted
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    <Icon size={24} />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isActive ? 'text-[var(--color-text)]' : 'text-slate-600'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-slate-200 mx-4 mt-[-2rem]" />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Form Content */}
      <Card padding="md">
        <CardContent>
          {currentStep === 'personal' && (
            <div className="space-y-6">
              <Alert variant="info" title="Required Information">
                All fields marked with * are required for enrollment.
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    value={formData.middleName}
                    onChange={(e) => updateField('middleName', e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    placeholder="Enter middle name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateField('dateOfBirth', e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => updateField('gender', e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Place of Birth *
                  </label>
                  <input
                    type="text"
                    value={formData.placeOfBirth}
                    onChange={(e) => updateField('placeOfBirth', e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    placeholder="City/Town"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    placeholder="+231 XXX XXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Residential Address *
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  rows={3}
                  placeholder="Enter full address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    County *
                  </label>
                  <select
                    value={formData.county}
                    onChange={(e) => updateField('county', e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  >
                    <option value="">Select county</option>
                    <option value="montserrado">Montserrado</option>
                    <option value="margibi">Margibi</option>
                    <option value="bong">Bong</option>
                    <option value="nimba">Nimba</option>
                    <option value="grand-bassa">Grand Bassa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    District *
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => updateField('district', e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    placeholder="Enter district"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 'biometric' && (
            <div className="space-y-6">
              <Alert variant="info" title="Biometric Capture">
                Ensure all biometric devices are connected and functioning properly.
              </Alert>

              {duplicateProfile && (
                <div className="mb-6 border-2 border-yellow-500 rounded-lg p-4 bg-yellow-50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-yellow-800">Potential Duplicate Found</h3>
                      <p className="text-yellow-700">A similar record already exists in the system.</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setDuplicateProfile(null)}>
                        Recapture
                      </Button>
                      <Button variant="primary" onClick={() => {
                        setDuplicateProfile(null);
                        setCurrentStep('documents');
                      }}>
                        Continue Anyway
                      </Button>
                    </div>
                  </div>
                  <ConsolidatedProfileView profile={duplicateProfile} />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card padding="md" className="text-center">
                  <Fingerprint size={48} className="mx-auto mb-4 text-[var(--color-primary)]" />
                  <h3 className="font-semibold text-[var(--color-text)] mb-2">Fingerprints</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                    Capture all 10 fingerprints
                  </p>
                  <Button
                    variant={formData.fingerprints ? 'primary' : 'outline'}
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      updateField('fingerprints', !formData.fingerprints);
                      showToast('Fingerprints captured', 'success');
                    }}
                  >
                    {formData.fingerprints ? '✓ Captured' : 'Capture Now'}
                  </Button>
                </Card>

                <Card padding="md" className="text-center">
                  <User size={48} className="mx-auto mb-4 text-[var(--color-primary)]" />
                  <h3 className="font-semibold text-[var(--color-text)] mb-2">Photograph</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                    Take passport-style photo
                  </p>
                  <Button
                    variant={formData.photo ? 'primary' : 'outline'}
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      updateField('photo', !formData.photo);
                      showToast('Photo captured', 'success');
                    }}
                  >
                    {formData.photo ? '✓ Captured' : 'Capture Now'}
                  </Button>
                </Card>

                <Card padding="md" className="text-center">
                  <FileText size={48} className="mx-auto mb-4 text-[var(--color-primary)]" />
                  <h3 className="font-semibold text-[var(--color-text)] mb-2">Signature</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                    Capture digital signature
                  </p>
                  <Button
                    variant={formData.signature ? 'primary' : 'outline'}
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      updateField('signature', !formData.signature);
                      showToast('Signature captured', 'success');
                    }}
                  >
                    {formData.signature ? '✓ Captured' : 'Capture Now'}
                  </Button>
                </Card>
              </div>

              {formData.fingerprints && formData.photo && formData.signature && (
                <Alert variant="success" title="Biometric Capture Complete">
                  All required biometric data has been successfully captured.
                </Alert>
              )}
            </div>
          )}

          {currentStep === 'documents' && (
            <div className="space-y-6">
              <Alert variant="info" title="Document Verification">
                Upload or scan required supporting documents.
              </Alert>

              <div className="space-y-4">
                <Card padding="md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-[var(--color-text)]">Birth Certificate</h3>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        Original or certified copy required
                      </p>
                    </div>
                    <Button
                      variant={formData.birthCertificate ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => {
                        updateField('birthCertificate', !formData.birthCertificate);
                        showToast('Birth certificate uploaded', 'success');
                      }}
                    >
                      {formData.birthCertificate ? '✓ Uploaded' : 'Upload'}
                    </Button>
                  </div>
                </Card>

                <Card padding="md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-[var(--color-text)]">Proof of Address</h3>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        Utility bill or rental agreement
                      </p>
                    </div>
                    <Button
                      variant={formData.proofOfAddress ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => {
                        updateField('proofOfAddress', !formData.proofOfAddress);
                        showToast('Proof of address uploaded', 'success');
                      }}
                    >
                      {formData.proofOfAddress ? '✓ Uploaded' : 'Upload'}
                    </Button>
                  </div>
                </Card>

                <Card padding="md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-[var(--color-text)]">Parent/Guardian ID</h3>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        Required for minors under 18
                      </p>
                    </div>
                    <Button
                      variant={formData.parentId ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => {
                        updateField('parentId', !formData.parentId);
                        showToast('Parent ID uploaded', 'success');
                      }}
                    >
                      {formData.parentId ? '✓ Uploaded' : 'Upload'}
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {currentStep === 'review' && (
            <div className="space-y-6">
              <Alert variant="warning" title="Review Before Submission">
                Please review all information carefully before submitting.
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card padding="md">
                  <h3 className="font-semibold text-[var(--color-text)] mb-4">Personal Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-secondary)]">Full Name:</span>
                      <span className="font-medium">{formData.firstName} {formData.middleName} {formData.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-secondary)]">Date of Birth:</span>
                      <span className="font-medium">{formData.dateOfBirth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-secondary)]">Gender:</span>
                      <span className="font-medium capitalize">{formData.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-secondary)]">Phone:</span>
                      <span className="font-medium">{formData.phone}</span>
                    </div>
                  </div>
                </Card>

                <Card padding="md">
                  <h3 className="font-semibold text-[var(--color-text)] mb-4">Biometric Status</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-secondary)]">Fingerprints:</span>
                      <span className={formData.fingerprints ? 'text-green-600' : 'text-red-600'}>
                        {formData.fingerprints ? '✓ Captured' : '✗ Missing'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-secondary)]">Photo:</span>
                      <span className={formData.photo ? 'text-green-600' : 'text-red-600'}>
                        {formData.photo ? '✓ Captured' : '✗ Missing'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-secondary)]">Signature:</span>
                      <span className={formData.signature ? 'text-green-600' : 'text-red-600'}>
                        {formData.signature ? '✓ Captured' : '✗ Missing'}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStepIndex === 0}
        >
          <ChevronLeft size={20} />
          Previous
        </Button>

        {currentStepIndex < steps.length - 1 ? (
          <Button variant="primary" onClick={handleNext} disabled={isChecking}>
            {isChecking ? 'Checking...' : 'Next'}
            {!isChecking && <ChevronRight size={20} />}
          </Button>
        ) : (
          <Button variant="primary" onClick={handleSubmit}>
            <CheckCircle size={20} />
            Submit Enrollment
          </Button>
        )}
      </div>
    </div>
  );
}
