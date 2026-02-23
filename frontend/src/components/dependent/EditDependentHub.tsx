import { useState } from 'react';
import { ArrowLeft, Home, Map, Megaphone, User } from 'lucide-react';

interface EditDependentHubProps {
  dependentName: string;
  relationship: string;
  nricNumber: string;
  triageTag: string;
  allergies: string;
  medicalHistory: string;
  bloodType: string;
  criticalMedications: string;
  onBack?: () => void;
  onSave?: (data: {
    dependentName: string;
    relationship: string;
    nricNumber: string;
    triageTag: string;
    allergies: string;
    medicalHistory: string;
    bloodType: string;
    criticalMedications: string;
  }) => void;
  onNavigate?: (screen: string) => void;
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const TRIAGE_OPTIONS = [
  { id: 'elderly', label: 'Elderly (60+)', icon: 'elderly' },
  { id: 'child', label: 'Child (<12)', icon: 'child_care' },
  { id: 'oku-physical', label: 'OKU (Physical)', icon: 'accessibility_new' },
  { id: 'oku-neuro', label: 'OKU (Neuro/Sensory)', icon: 'hearing_disabled' },
];

const RELATIONSHIPS = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'child', label: 'Child' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'grandparent', label: 'Grandparent' },
  { value: 'other', label: 'Other Family' },
];

export function EditDependentHub({
  dependentName: initialName,
  relationship: initialRelationship,
  nricNumber: initialNric,
  triageTag: initialTriage,
  allergies: initialAllergies,
  medicalHistory: initialHistory,
  bloodType: initialBloodType,
  criticalMedications: initialMedications,
  onBack,
  onSave,
  onNavigate,
}: EditDependentHubProps) {
  const [activeTab, setActiveTab] = useState<'identity' | 'triage' | 'medical'>('identity');
  const [dependentName, setDependentName] = useState(initialName);
  const [relationship, setRelationship] = useState(initialRelationship);
  const [nricNumber, setNricNumber] = useState(initialNric);
  const [triageTag, setTriageTag] = useState(initialTriage);
  const [allergies, setAllergies] = useState(initialAllergies);
  const [medicalHistory, setMedicalHistory] = useState(initialHistory);
  const [bloodType, setBloodType] = useState(initialBloodType);
  const [criticalMedications, setCriticalMedications] = useState(initialMedications);

  const handleSave = () => {
    onSave?.({
      dependentName,
      relationship,
      nricNumber,
      triageTag,
      allergies,
      medicalHistory,
      bloodType,
      criticalMedications,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-4 font-display text-dark-text">
      <div className="w-[400px] h-[824px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-slate-200">
        {/* Header with Tabs */}
        <header className="flex-none bg-white sticky top-0 z-30">
          {/* Top Header */}
          <div className="pt-12 px-6 pb-4 flex items-center gap-4 border-b border-slate-100">
            <button
              onClick={onBack}
              className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-slate-900">Edit Dependent</h1>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-100 px-6">
            <button
              onClick={() => setActiveTab('identity')}
              className={`flex-1 py-3 text-sm font-bold transition-colors border-b-2 ${
                activeTab === 'identity'
                  ? 'text-primary border-primary'
                  : 'text-slate-400 border-transparent hover:text-slate-600'
              }`}
            >
              Identity
            </button>
            <button
              onClick={() => setActiveTab('triage')}
              className={`flex-1 py-3 text-sm font-bold transition-colors border-b-2 ${
                activeTab === 'triage'
                  ? 'text-primary border-primary'
                  : 'text-slate-400 border-transparent hover:text-slate-600'
              }`}
            >
              Triage
            </button>
            <button
              onClick={() => setActiveTab('medical')}
              className={`flex-1 py-3 text-sm font-bold transition-colors border-b-2 ${
                activeTab === 'medical'
                  ? 'text-primary border-primary'
                  : 'text-slate-400 border-transparent hover:text-slate-600'
              }`}
            >
              Medical
            </button>
          </div>
        </header>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-6 no-scrollbar pb-48">
          {/* Identity Tab */}
          {activeTab === 'identity' && (
            <div className="py-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                <input
                  type="text"
                  value={dependentName}
                  onChange={(e) => setDependentName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:ring-primary focus:border-primary placeholder:text-slate-300 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">NRIC Number</label>
                <input
                  type="text"
                  value={nricNumber}
                  onChange={(e) => setNricNumber(e.target.value)}
                  placeholder="XXXXXX-XX-XXXX"
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:ring-primary focus:border-primary placeholder:text-slate-300 transition-all font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Relationship</label>
                <div className="relative">
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium appearance-none focus:ring-primary focus:border-primary transition-all cursor-pointer"
                  >
                    {RELATIONSHIPS.map((rel) => (
                      <option key={rel.value} value={rel.value}>
                        {rel.label}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <span className="material-symbols-outlined">expand_more</span>
                  </span>
                </div>
              </div>

              <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 flex gap-3 mt-6">
                <span className="material-symbols-outlined text-primary flex-none mt-0.5">info</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Accurate identity information ensures that search and rescue teams can verify household members during evacuation procedures.
                </p>
              </div>
            </div>
          )}

          {/* Triage Tab */}
          {activeTab === 'triage' && (
            <div className="py-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-1">Rescue Prioritization</h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Select triage tags that apply to this dependent. This helps rescue teams allocate specific equipment and priority.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {TRIAGE_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setTriageTag(option.id)}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 h-24 ${
                      triageTag === option.id
                        ? 'bg-primary border-primary text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-2xl ${triageTag === option.id ? 'text-white' : 'text-slate-400'}`}>
                      {option.icon}
                    </span>
                    <span className="text-xs font-bold text-center leading-tight">{option.label}</span>
                    {triageTag === option.id && (
                      <span className="material-symbols-outlined text-white absolute top-2 right-2">check_circle</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Medical Tab */}
          {activeTab === 'medical' && (
            <div className="py-6 space-y-5">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Blood Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {BLOOD_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setBloodType(type)}
                      className={`py-3 px-2 rounded-xl font-bold text-xs transition-all ${
                        bloodType === type
                          ? 'bg-primary text-white border-2 border-primary'
                          : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Known Allergies</label>
                <textarea
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g., Penicillin, Peanuts, Latex..."
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-medium focus:ring-primary focus:border-primary placeholder:text-slate-300 transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Medical History</label>
                <textarea
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  placeholder="Include chronic conditions, past surgeries, or relevant health notes..."
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-medium focus:ring-primary focus:border-primary placeholder:text-slate-300 transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Critical Medications</label>
                <textarea
                  value={criticalMedications}
                  onChange={(e) => setCriticalMedications(e.target.value)}
                  placeholder="e.g., Insulin (daily), Warfarin (blood thinner)..."
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-medium focus:ring-primary focus:border-primary placeholder:text-slate-300 transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-center gap-2 py-4 opacity-60">
                <span className="material-symbols-outlined text-base text-safe-green">verified_user</span>
                <p className="text-xs font-medium text-slate-500 text-center">
                  Sensitive medical data is AES-256 encrypted.<br />
                  Only authorized first responders can access this.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="absolute bottom-28 left-6 right-6 py-4 px-6 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-blue-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 z-20"
        >
          <span className="material-symbols-outlined text-lg">sync</span>
          SAVE &amp; SYNC CHANGES
        </button>

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
