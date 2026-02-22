import { useState } from 'react';
import {
  ArrowLeft,
  Home,
  Map,
  Megaphone,
  User,
} from 'lucide-react';

interface MedicalSpecialNeedsScreenProps {
  onBack?: () => void;
  onSave?: (data: { allergies: string; medicalHistory: string; bloodType: string }) => void;
  onNavigate?: (screen: string) => void;
  initialAllergies?: string;
  initialMedicalHistory?: string;
  initialBloodType?: string;
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export function MedicalSpecialNeedsScreen({
  onBack,
  onSave,
  onNavigate,
  initialAllergies = '',
  initialMedicalHistory = '',
  initialBloodType = '',
}: MedicalSpecialNeedsScreenProps) {
  const [allergies, setAllergies] = useState(initialAllergies);
  const [medicalHistory, setMedicalHistory] = useState(initialMedicalHistory);
  const [bloodType, setBloodType] = useState(initialBloodType);

  const handleSave = () => {
    onSave?.({
      allergies: allergies.trim(),
      medicalHistory: medicalHistory.trim(),
      bloodType,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-4 font-display text-dark-text">
      <div className="w-[400px] h-[824px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-slate-200">
        <header className="flex-none pt-12 px-6 pb-4 bg-white sticky top-0 z-30 flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Medical &amp; Special Needs</h1>
        </header>

        <div className="flex-1 overflow-y-auto px-6 space-y-6 no-scrollbar pb-10">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3 mt-2">
            <span className="material-symbols-outlined text-hazard-red">info</span>
            <div>
              <p className="text-xs font-bold text-hazard-red uppercase tracking-wider">Incomplete Profile</p>
              <p className="text-xs text-red-700 leading-tight mt-0.5">
                Your medical details are missing. Rescuers need this info to prioritize your safety during a flood.
              </p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 ml-1">Allergies</label>
              <textarea
                value={allergies}
                onChange={(event) => setAllergies(event.target.value)}
                placeholder="e.g., Penicillin, Peanuts"
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl text-sm p-4 focus:ring-primary focus:border-primary placeholder:text-slate-300 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 ml-1">Medical History</label>
              <textarea
                value={medicalHistory}
                onChange={(event) => setMedicalHistory(event.target.value)}
                placeholder="e.g., Asthma, Hypertension"
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl text-sm p-4 focus:ring-primary focus:border-primary placeholder:text-slate-300 transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700 ml-1">Blood Type</label>
              <div className="grid grid-cols-4 gap-2">
                {BLOOD_TYPES.map((type) => {
                  const isActive = bloodType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setBloodType(type)}
                      className={`py-3 border-2 rounded-xl text-sm font-bold transition-all ${
                        isActive
                          ? 'border-primary text-primary'
                          : 'border-slate-100 text-slate-600 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleSave}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-base shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all"
              >
                SAVE MEDICAL PROFILE
              </button>
            </div>
          </form>

          <div className="flex gap-3 px-2 pt-2">
            <span className="material-symbols-outlined text-slate-400 text-lg">lock</span>
            <p className="text-[11px] text-light-text leading-relaxed">
              This information is encrypted and only accessible by emergency responders during an active alert.
            </p>
          </div>
        </div>

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

          <div className="flex flex-col items-center gap-1 -mt-10">
            <button className="w-16 h-16 bg-primary rounded-full shadow-2xl flex items-center justify-center text-white ring-[6px] ring-white active:scale-95 transition-transform">
              <span className="text-lg font-black tracking-tighter">SOS</span>
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

export default MedicalSpecialNeedsScreen;
