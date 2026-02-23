import { ArrowLeft, Home, Map, Megaphone, User } from 'lucide-react';

interface DependentProfileScreenProps {
  dependentName: string;
  relationship: string;
  triageTag: string;
  nricNumber: string;
  allergies: string;
  medicalHistory: string;
  bloodType: string;
  criticalMedications: string;
  onBack?: () => void;
  onEdit?: () => void;
  onNavigate?: (screen: string) => void;
}

const TRIAGE_CONFIG: { [key: string]: { label: string; color: string; icon: string } } = {
  elderly: { label: 'ELDERLY (60+)', color: 'bg-orange-50 text-orange-600 border-orange-100', icon: 'elderly' },
  child: { label: 'CHILD (<12)', color: 'bg-green-50 text-green-600 border-green-100', icon: 'child_care' },
  'oku-physical': { label: 'OKU (PHYSICAL)', color: 'bg-blue-50 text-primary border-blue-100', icon: 'accessibility_new' },
  'oku-neuro': { label: 'OKU (NEURO/SENSORY)', color: 'bg-purple-50 text-purple-600 border-purple-100', icon: 'hearing_disabled' },
};

export function DependentProfileScreen({
  dependentName,
  relationship,
  triageTag,
  nricNumber,
  allergies,
  medicalHistory,
  bloodType,
  criticalMedications,
  onBack,
  onEdit,
  onNavigate,
}: DependentProfileScreenProps) {
  const triageConfig = TRIAGE_CONFIG[triageTag] || { label: triageTag, color: 'bg-slate-50 text-slate-600 border-slate-100', icon: 'info' };

  // Mask NRIC number
  const maskedNric = nricNumber
    .replace(/(.{6})(.{2})(.{4})/, '**** -$2-$3')
    .replace(/\*/g, '*');

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-4 font-display text-dark-text">
      <div className="w-[400px] h-[824px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-slate-200">
        {/* Sticky Header */}
        <header className="flex-none pt-12 px-6 pb-4 bg-white sticky top-0 z-30 flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Dependent Profile</h1>
          <button
            onClick={onEdit}
            className="text-primary font-bold text-sm hover:text-blue-800 transition-colors"
          >
            Edit
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 space-y-6 no-scrollbar pb-32">
          {/* Identity Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center space-y-4 mt-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-blue-50 rounded-2xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-5xl">elderly</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-safe-green text-white rounded-full p-1.5 border-4 border-white">
                <span className="material-symbols-outlined text-sm">verified</span>
              </div>
            </div>

            {/* Name & Relationship */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{dependentName}</h2>
              <p className="text-sm font-medium text-slate-600 mt-0.5">{relationship}</p>
            </div>

            {/* Triage Badge */}
            <span className={`px-3 py-1.5 text-xs font-bold rounded-full border ${triageConfig.color}`}>
              {triageConfig.label}
            </span>
          </div>

          {/* NRIC Card */}
          <div className="bg-slate-50 rounded-3xl p-4 border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 border border-slate-100">
              <span className="material-symbols-outlined">badge</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">NRIC Number</p>
              <p className="text-sm font-mono font-bold text-slate-700 tracking-widest mt-0.5">{maskedNric}</p>
            </div>
          </div>

          {/* Medical Details Card - Red Bordered */}
          <div className="bg-slate-50 rounded-3xl overflow-hidden border border-red-100 shadow-sm">
            {/* Red Header */}
            <div className="bg-red-50/50 px-5 py-3 flex items-center gap-2 border-b border-red-100">
              <span className="material-symbols-outlined text-hazard-red text-lg">info</span>
              <span className="text-xs font-bold text-hazard-red uppercase tracking-wider">Medical Details</span>
            </div>

            {/* Medical Details Content */}
            <div className="px-5 py-5 space-y-4">
              {/* Allergies */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 shrink-0 rounded-lg bg-white flex items-center justify-center text-hazard-red border border-red-50">
                  <span className="material-symbols-outlined text-lg">medical_services</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Allergies</p>
                  <p className="text-sm font-medium text-slate-900 mt-1">{allergies}</p>
                </div>
              </div>

              {/* Medical History */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 shrink-0 rounded-lg bg-white flex items-center justify-center text-hazard-red border border-red-50">
                  <span className="material-symbols-outlined text-lg">history_edu</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Medical History</p>
                  <p className="text-sm font-medium text-slate-900 mt-1">{medicalHistory}</p>
                </div>
              </div>

              {/* Critical Medications */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 shrink-0 rounded-lg bg-white flex items-center justify-center text-hazard-red border border-red-50">
                  <span className="material-symbols-outlined text-lg">pill</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Critical Medications</p>
                  <p className="text-sm font-medium text-slate-900 mt-1">{criticalMedications}</p>
                </div>
              </div>

              {/* Blood Type */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 shrink-0 rounded-lg bg-white flex items-center justify-center text-hazard-red border border-red-50">
                  <span className="material-symbols-outlined text-lg">bloodtype</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Blood Type</p>
                  <p className="text-sm font-bold text-primary mt-1">{bloodType}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-sm">cloud_done</span>
            </div>
            <p className="text-xs font-medium text-primary/80 leading-relaxed">
              Profile synced with National Emergency Registry. Data is AES-256 encrypted.
            </p>
          </div>
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
      </div>
    </div>
  );
}
