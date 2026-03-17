import { useState } from 'react';
import {
  ArrowLeft,
  Home,
  Map,
  Megaphone,
  User,
  AlertCircle,
} from 'lucide-react';

interface AddDependentIdentityScreenProps {
  onBack?: () => void;
  onNext?: (data: { fullName: string; relationship: string; nricNumber: string }) => void;
  onNavigate?: (screen: string) => void;
}

const RELATIONSHIPS = [
  { value: 'child', label: 'Child' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'grandparent', label: 'Grandparent' },
  { value: 'other', label: 'Other Family' },
];

// Malaysian NRIC/MyKid validation
const validateICNumber = (ic: string): { valid: boolean; error?: string } => {
  // Remove hyphens and spaces
  const cleaned = ic.replace(/[-\s]/g, '');
  
  // Check length (12 digits for NRIC or MyKid)
  if (cleaned.length !== 12) {
    return { valid: false, error: 'IC/MyKid number must be 12 digits' };
  }
  
  // Check if all characters are digits
  if (!/^\d{12}$/.test(cleaned)) {
    return { valid: false, error: 'IC/MyKid number must contain only digits' };
  }
  
  // Validate date portion (YYMMDD)
  const month = parseInt(cleaned.substring(2, 4), 10);
  const day = parseInt(cleaned.substring(4, 6), 10);
  
  if (month < 1 || month > 12) {
    return { valid: false, error: 'Invalid month in IC number' };
  }
  
  if (day < 1 || day > 31) {
    return { valid: false, error: 'Invalid day in IC number' };
  }
  
  // Validate place of birth code (should be 01-99, typically 01-16 for Malaysia)
  const pob = parseInt(cleaned.substring(6, 8), 10);
  if (pob < 1 || pob > 99) {
    return { valid: false, error: 'Invalid place of birth code' };
  }
  
  return { valid: true };
};

export function AddDependentIdentityScreen({
  onBack,
  onNext,
  onNavigate,
}: AddDependentIdentityScreenProps) {
  const [fullName, setFullName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [nricNumber, setNricNumber] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!relationship) {
      newErrors.relationship = 'Please select a relationship';
    }
    
    if (!nricNumber.trim()) {
      newErrors.nricNumber = 'NRIC/MyKid number is required';
    } else {
      const icValidation = validateICNumber(nricNumber);
      if (!icValidation.valid) {
        newErrors.nricNumber = icValidation.error || 'Invalid NRIC/MyKid number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext?.({
        fullName: fullName.trim(),
        relationship,
        nricNumber: nricNumber.trim(),
      });
    }
  };

  const isFormValid = fullName.trim() && relationship && nricNumber.trim();

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-4 font-display text-dark-text">
      <div className="w-[400px] h-[824px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-slate-200">
        {/* Header with progress indicator */}
        <header className="flex-none pt-12 px-6 pb-6 bg-white sticky top-0 z-30 border-b border-slate-200">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onBack}
              className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-slate-900">Add Dependent</h1>
          </div>
          
          {/* Progress bar - 33% */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-1/3 transition-all duration-300"></div>
            </div>
            <span className="text-xs font-semibold text-slate-600">33%</span>
          </div>
          
          <p className="text-xs text-slate-500 mt-3 font-medium">Step 1 of 3: Identity Information</p>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 space-y-6 no-scrollbar pb-32">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3 mt-2">
            <span className="material-symbols-outlined text-primary flex-none mt-0.5">info</span>
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-wider">Privacy Protected</p>
              <p className="text-xs text-blue-700 leading-tight mt-0.5">
                This information is only used by rescue teams to identify and prioritize your dependent during emergencies.
              </p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <span className="material-symbols-outlined text-lg">person</span>
                </span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., Ahmad bin Mohamed"
                  className={`w-full bg-slate-50 border rounded-2xl text-sm p-4 pl-12 focus:ring-primary focus:border-primary placeholder:text-slate-300 transition-all ${
                    errors.fullName ? 'border-hazard-red focus:ring-hazard-red' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-hazard-red ml-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Relationship */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 ml-1">Relationship</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <span className="material-symbols-outlined text-lg">family_restroom</span>
                </span>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className={`w-full bg-slate-50 border rounded-2xl text-sm p-4 pl-12 focus:ring-primary focus:border-primary appearance-none transition-all cursor-pointer ${
                    errors.relationship ? 'border-hazard-red focus:ring-hazard-red' : 'border-slate-200'
                  }`}
                >
                  <option value="">Select a relationship...</option>
                  {RELATIONSHIPS.map((rel) => (
                    <option key={rel.value} value={rel.value}>
                      {rel.label}
                    </option>
                  ))}
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <span className="material-symbols-outlined text-lg">expand_more</span>
                </span>
              </div>
              {errors.relationship && (
                <p className="text-xs text-hazard-red ml-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.relationship}
                </p>
              )}
            </div>

            {/* NRIC / MyKid Number */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 ml-1">NRIC / MyKid Number</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <span className="material-symbols-outlined text-lg">badge</span>
                </span>
                <input
                  type="text"
                  value={nricNumber}
                  onChange={(e) => setNricNumber(e.target.value)}
                  placeholder="e.g., 123456-10-1234"
                  className={`w-full bg-slate-50 border rounded-2xl text-sm p-4 pl-12 focus:ring-primary focus:border-primary placeholder:text-slate-300 transition-all font-mono ${
                    errors.nricNumber ? 'border-hazard-red focus:ring-hazard-red' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.nricNumber && (
                <p className="text-xs text-hazard-red ml-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.nricNumber}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Bottom Navigation */}
        <nav className="flex-none bg-white border-t border-slate-100 px-6 py-4 grid grid-cols-5 items-end z-30">
          <button
            onClick={() => onNavigate?.('home')}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
          >
            <Home size={20} />
            <span className="text-[10px] font-medium">Home</span>
          </button>

          <button
            onClick={() => onNavigate?.('map')}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
          >
            <Map size={20} />
            <span className="text-[10px] font-medium">Map</span>
          </button>

          {/* SOS Button - Centered */}
          <div className="flex flex-col items-center gap-1 -mt-10">
            <button className="w-20 h-20 bg-primary rounded-full shadow-2xl shadow-blue-900/40 flex items-center justify-center text-white ring-[6px] ring-white active:scale-95 transition-transform font-black text-2xl tracking-tighter hover:bg-blue-900">
              SOS
            </button>
          </div>

          <button
            onClick={() => onNavigate?.('updates')}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
          >
            <Megaphone size={20} />
            <span className="text-[10px] font-medium">Updates</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-primary">
            <User size={20} />
            <span className="text-[10px] font-bold">Profile</span>
          </button>
        </nav>

        {/* Action Button */}
        <div className="absolute bottom-28 left-6 right-6 h-12 flex items-center">
          <button
            onClick={handleNext}
            disabled={!isFormValid}
            className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${
              isFormValid
                ? 'bg-primary text-white hover:bg-blue-800 active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Next: Vulnerability Triage
          </button>
        </div>
      </div>
    </div>
  );
}
