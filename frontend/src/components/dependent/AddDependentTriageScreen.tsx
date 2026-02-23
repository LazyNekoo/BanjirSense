import { useState } from 'react';
import {
  ArrowLeft,
  Home,
  Map,
  Megaphone,
  User,
} from 'lucide-react';

interface AddDependentTriageScreenProps {
  onBack?: () => void;
  onNext?: (data: { triageTag: string }) => void;
  onNavigate?: (screen: string) => void;
}

const TRIAGE_OPTIONS = [
  {
    id: 'elderly',
    label: 'Elderly (60+)',
    icon: 'elderly',
    description: 'Limited mobility or chronic conditions',
    color: 'bg-amber-50',
    borderColor: 'border-amber-200',
    selectedBg: 'bg-amber-600',
  },
  {
    id: 'child',
    label: 'Child (< 12 years)',
    icon: 'child_friendly',
    description: 'Requires adult supervision',
    color: 'bg-green-50',
    borderColor: 'border-green-200',
    selectedBg: 'bg-green-600',
  },
  {
    id: 'oku-physical',
    label: 'OKU (Physical)',
    icon: 'accessibility_new',
    description: 'Physical disability or mobility aid',
    color: 'bg-blue-50',
    borderColor: 'border-blue-200',
    selectedBg: 'bg-primary',
  },
  {
    id: 'oku-neuro',
    label: 'OKU (Neuro/Sensory)',
    icon: 'hearing_disabled',
    description: 'Cognitive, deaf, or blind',
    color: 'bg-purple-50',
    borderColor: 'border-purple-200',
    selectedBg: 'bg-purple-600',
  },
];

export function AddDependentTriageScreen({
  onBack,
  onNext,
  onNavigate,
}: AddDependentTriageScreenProps) {
  const [selectedTriage, setSelectedTriage] = useState('');

  const handleNext = () => {
    if (selectedTriage) {
      onNext?.({ triageTag: selectedTriage });
    }
  };

  const isFormValid = !!selectedTriage;

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
            <h1 className="text-xl font-bold text-slate-900">Vulnerability Triage</h1>
          </div>
          
          {/* Progress bar - 66% */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-2/3 transition-all duration-300"></div>
            </div>
            <span className="text-xs font-semibold text-slate-600">66%</span>
          </div>
          
          <p className="text-xs text-slate-500 mt-3 font-medium">Step 2 of 3: Rescue Priority</p>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 space-y-4 no-scrollbar pb-32 pt-6">
          <p className="text-sm text-slate-600 font-medium">
            Select one tag that best describes your dependent's vulnerability during a flood:
          </p>

          <div className="grid grid-cols-1 gap-3 mt-4">
            {TRIAGE_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedTriage(option.id)}
                className={`p-4 rounded-2xl border-2 transition-all text-left ${
                  selectedTriage === option.id
                    ? `${option.selectedBg} border-transparent text-white shadow-lg`
                    : `border-slate-200 bg-slate-50 hover:bg-slate-100`
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-none mt-0.5 ${selectedTriage === option.id ? 'text-white' : 'text-slate-400'}`}>
                    <span className="material-symbols-outlined text-2xl">{option.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className={`font-bold text-sm ${
                          selectedTriage === option.id
                            ? 'text-white'
                            : 'text-slate-900'
                        }`}>
                          {option.label}
                        </h3>
                        <p className={`text-xs mt-1 ${
                          selectedTriage === option.id
                            ? 'text-white/85'
                            : 'text-slate-600'
                        }`}>
                          {option.description}
                        </p>
                      </div>
                      {selectedTriage === option.id && (
                        <div className="flex-none mt-0.5">
                          <span className="material-symbols-outlined text-white">check_circle</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-6">
            <p className="text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-700">Why this matters: </span>
              Rescue teams use these tags to prioritize evacuation and resource allocation. Multiple tags can be added later.
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
            Next: Medical History
          </button>
        </div>
      </div>
    </div>
  );
}
