import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, AlertCircle } from 'lucide-react';

interface EmergencyMedicalScreenProps {
  onBack: () => void;
  onComplete: (data: EmergencyMedicalData) => void;
  isLoading?: boolean;
}

interface EmergencyMedicalData {
  hasDisability: boolean;
  hasYoungChildren: boolean;
  bloodType: string;
  allergies: string;
  medicalHistory: string;
}

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const EmergencyMedicalScreen: React.FC<EmergencyMedicalScreenProps> = ({
  onBack,
  onComplete,
  isLoading = false,
}) => {
  const [hasDisability, setHasDisability] = useState(false);
  const [hasYoungChildren, setHasYoungChildren] = useState(false);
  const [bloodType, setBloodType] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');

  const isFormValid = bloodType.trim() && (allergies.trim() || medicalHistory.trim());

  const handleCompleteClick = () => {
    if (isFormValid) {
      const formData: EmergencyMedicalData = {
        hasDisability,
        hasYoungChildren,
        bloodType,
        allergies,
        medicalHistory,
      };
      // Firebase integration point
      console.log('Completing registration with data:', formData);
      onComplete(formData);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-2 md:p-6">
      <div className="w-full max-w-[390px] h-screen md:h-[900px] md:max-h-[90vh] bg-white md:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative border border-slate-200">
      {/* Header */}
      <header className="flex-none px-6 pt-8 pb-5 bg-white sticky top-0 z-30 border-b border-slate-100">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors group"
            aria-label="Go back"
          >
            <ArrowLeft className="text-slate-400 group-hover:text-primary transition-colors" size={24} />
          </button>
          <div className="flex gap-1.5">
            <div className="h-1.5 w-2 bg-slate-200 rounded-full transition-all duration-300"></div>
            <div className="h-1.5 w-8 bg-primary rounded-full transition-all duration-300"></div>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-dark-navy">Emergency & Medical</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Critical information used by first responders during high-risk rescue operations.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 pb-10">
        <div className="space-y-6 pt-6">
          {/* Rescue Priority Status Section */}
          <section>
            <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider block mb-3">
              Rescue Priority Status
            </label>
            <div className="grid grid-cols-1 gap-3">
              {/* Person with Disability */}
              <label className="flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group"
                style={{
                  borderColor: hasDisability ? '#1e40af' : '#e2e8f0',
                  backgroundColor: hasDisability ? 'rgba(30, 64, 175, 0.05)' : '#f8fafc',
                }}
              >
                <div className="relative flex items-center flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={hasDisability}
                    onChange={(e) => setHasDisability(e.target.checked)}
                    className="w-6 h-6 rounded-lg border-slate-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-dark-navy group-hover:text-primary transition-colors">
                    Person with Disability (OKU)
                  </span>
                  <span className="text-[11px] text-slate-500 leading-tight">
                    Requires specialized medical or mobility assistance
                  </span>
                </div>
              </label>

              {/* Infants / Young Children */}
              <label className="flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group"
                style={{
                  borderColor: hasYoungChildren ? '#1e40af' : '#e2e8f0',
                  backgroundColor: hasYoungChildren ? 'rgba(30, 64, 175, 0.05)' : '#f8fafc',
                }}
              >
                <div className="relative flex items-center flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={hasYoungChildren}
                    onChange={(e) => setHasYoungChildren(e.target.checked)}
                    className="w-6 h-6 rounded-lg border-slate-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-dark-navy group-hover:text-primary transition-colors">
                    Infants / Young Children
                  </span>
                  <span className="text-[11px] text-slate-500 leading-tight">
                    Priority evacuation for households with children under 5
                  </span>
                </div>
              </label>
            </div>
          </section>

          {/* Medical & Special Needs Card */}
          <section className="bg-primary/5 rounded-3xl border border-primary/10 p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <svg className="text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              <h3 className="text-sm font-bold text-primary uppercase tracking-wide">Medical & Special Needs</h3>
            </div>

            <div className="space-y-4">
              {/* Blood Type Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Blood Type</label>
                <div className="relative">
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="w-full appearance-none rounded-xl border-slate-200 bg-white py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none border pr-10"
                  >
                    <option value="">Select Blood Type</option>
                    {bloodTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={20}
                  />
                </div>
              </div>

              {/* Allergies Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
                  Allergies (Medicines/Food)
                </label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="None or list allergies"
                  className="w-full rounded-xl border-slate-200 bg-white py-3 px-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none border placeholder:text-slate-300"
                />
              </div>

              {/* Medical History / Medication */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
                  Medical History / Medication
                </label>
                <textarea
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  placeholder="E.g. Asthma, Hypertension, on regular insulin"
                  className="w-full rounded-xl border-slate-200 bg-white py-3 px-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none border resize-none min-h-[80px] placeholder:text-slate-300"
                />
              </div>
            </div>
          </section>

          {/* Trust Disclosure Box */}
          <div className="bg-blue-50 rounded-2xl p-4 flex gap-3 items-start border border-blue-100">
            <AlertCircle className="text-primary mt-0.5 flex-shrink-0" size={20} />
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              This data is encrypted and only shared with verified SMART Team and rescue personnel during an active
              disaster declaration in your zone.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex-none px-6 py-6 bg-white border-t border-slate-100">
        <button
          onClick={handleCompleteClick}
          disabled={!isFormValid || isLoading}
          className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            isFormValid
              ? 'bg-primary text-white shadow-xl shadow-blue-900/20 hover:bg-blue-800 active:scale-[0.98]'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          COMPLETE REGISTRATION
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </button>
        <p className="text-center mt-4 text-[10px] text-slate-400">
          By registering, you consent to emergeFncy data sharing for life-saving purposes.
        </p>
      </footer>
      </div>
    </div>
  );
};
