import { useState } from 'react';
import {
  ArrowLeft,
  Home,
  Map,
  Megaphone,
  User,
} from 'lucide-react';

interface AddDependentMedicalScreenProps {
  onBack?: () => void;
  onNext?: (data: {
    allergies: string;
    criticalMedications: string;
    medicalHistory: string;
    bloodType: string;
  }) => void;
  onNavigate?: (screen: string) => void;
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export function AddDependentMedicalScreen({
  onBack,
  onNext,
  onNavigate,
}: AddDependentMedicalScreenProps) {
  const [allergies, setAllergies] = useState('');
  const [criticalMedications, setCriticalMedications] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!allergies.trim()) {
      newErrors.allergies = 'Allergies information is required (enter "None" if applicable)';
    }
    if (!medicalHistory.trim()) {
      newErrors.medicalHistory = 'Medical history is required (enter "None" if applicable)';
    }
    if (!bloodType) {
      newErrors.bloodType = 'Blood type must be selected';
    }
    if (!criticalMedications.trim()) {
      newErrors.criticalMedications = 'Critical medications are required (enter "None" if applicable)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext?.({
        allergies: allergies.trim(),
        criticalMedications: criticalMedications.trim(),
        medicalHistory: medicalHistory.trim(),
        bloodType,
      });
    }
  };

  const isFormValid = allergies.trim() && medicalHistory.trim() && bloodType && criticalMedications.trim();

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
            <h1 className="text-xl font-bold text-slate-900">Medical History</h1>
          </div>
          
          {/* Progress bar - 95% */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[95%] transition-all duration-300"></div>
            </div>
            <span className="text-xs font-semibold text-slate-600">95%</span>
          </div>
          
          <p className="text-xs text-slate-500 mt-3 font-medium">Step 3 of 3: Health Background</p>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 space-y-6 no-scrollbar pb-32">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3 mt-2">
            <span className="material-symbols-outlined text-hazard-red flex-none">info</span>
            <div>
              <p className="text-xs font-bold text-hazard-red uppercase tracking-wider">Important</p>
              <p className="text-xs text-red-700 leading-tight mt-0.5">
                Required: This information helps prevent secondary emergencies during evacuation and rescue operations.
              </p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Allergies */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 ml-1">Allergies</label>
              <textarea
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g., Penicillin, Peanuts, Shellfish, Latex (or 'None')"
                rows={2}
                className={`w-full bg-slate-50 border rounded-2xl text-sm p-4 focus:ring-primary focus:border-primary placeholder:text-slate-300 transition-all ${
                  errors.allergies ? 'border-hazard-red focus:ring-hazard-red' : 'border-slate-200'
                }`}
              />
              {errors.allergies && (
                <p className="text-xs text-hazard-red ml-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.allergies}
                </p>
              )}
            </div>

            {/* Medical History */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 ml-1">Medical History</label>
              <textarea
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                placeholder="e.g., Diabetes, Hypertension, Heart condition (or 'None')"
                rows={2}
                className={`w-full bg-slate-50 border rounded-2xl text-sm p-4 focus:ring-primary focus:border-primary placeholder:text-slate-300 transition-all ${
                  errors.medicalHistory ? 'border-hazard-red focus:ring-hazard-red' : 'border-slate-200'
                }`}
              />
              {errors.medicalHistory && (
                <p className="text-xs text-hazard-red ml-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.medicalHistory}
                </p>
              )}
            </div>

            {/* Blood Type */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700 ml-1">Blood Type *</label>
              <div className="grid grid-cols-4 gap-2">
                {BLOOD_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setBloodType(type)}
                    className={`py-2.5 px-2 rounded-lg font-bold text-xs transition-all ${
                      bloodType === type
                        ? 'bg-primary text-white border-2 border-primary'
                        : 'bg-slate-50 text-slate-700 border-2 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {errors.bloodType && (
                <p className="text-xs text-hazard-red ml-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.bloodType}
                </p>
              )}
            </div>

            {/* Critical Medications */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 ml-1">Critical Medications</label>
              <textarea
                value={criticalMedications}
                onChange={(e) => setCriticalMedications(e.target.value)}
                placeholder="e.g., Insulin (daily), Warfarin (blood thinner) (or 'None')"
                rows={2}
                className={`w-full bg-slate-50 border rounded-2xl text-sm p-4 focus:ring-primary focus:border-primary placeholder:text-slate-300 transition-all ${
                  errors.criticalMedications ? 'border-hazard-red focus:ring-hazard-red' : 'border-slate-200'
                }`}
              />
              {errors.criticalMedications && (
                <p className="text-xs text-hazard-red ml-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.criticalMedications}
                </p>
              )}
            </div>

            {/* Encryption Info */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3">
              <span className="material-symbols-outlined text-slate-600 flex-none">lock</span>
              <div>
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">End-to-End Encrypted</p>
                <p className="text-xs text-slate-600 leading-tight mt-0.5">
                  This data is encrypted locally and synced securely with Malaysia's National Emergency Registry (Firebase).
                </p>
              </div>
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
            Review &amp; Register
          </button>
        </div>
      </div>
    </div>
  );
}
