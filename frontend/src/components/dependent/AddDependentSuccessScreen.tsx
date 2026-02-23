import { useState, useEffect } from 'react';
import { Home, Map, Megaphone, User } from 'lucide-react';

interface AddDependentSuccessScreenProps {
  dependentName?: string;
  onReturn?: () => void;
  onAddAnother?: () => void;
  onNavigate?: (screen: string) => void;
}

export function AddDependentSuccessScreen({
  dependentName = "Your Dependent",
  onReturn,
  onAddAnother,
  onNavigate,
}: AddDependentSuccessScreenProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-4 font-display text-dark-text">
      <div className="w-[400px] h-[824px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-slate-200">
        {/* Header - Minimal */}
        <header className="flex-none pt-8 px-6 pb-6 bg-white sticky top-0 z-30">
          <h1 className="text-xl font-bold text-slate-900 text-center">Registration Complete</h1>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 flex flex-col items-center justify-center no-scrollbar pb-32">
          {/* Success Checkmark */}
          <div className="relative mb-8">
            {/* Animated checkmark circle background */}
            {!isLoading && (
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center animate-pulse">
                <span
                  className="text-5xl text-safe-green"
                  style={{
                    animation: 'bounce 0.6s ease-in-out',
                  }}
                >
                  <span className="material-symbols-outlined">check_circle</span>
                </span>
              </div>
            )}
            {isLoading && (
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-slate-300 border-t-primary rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Headline */}
          <h2 className="text-2xl font-bold text-slate-900 text-center mt-4">
            Dependent Securely Registered!
          </h2>

          {/* Description */}
          <p className="text-sm text-slate-600 text-center leading-relaxed mt-6 max-w-xs">
            <span className="font-semibold text-slate-900">{dependentName}</span>'s profile and triage tags are now synchronized with your household's Rescue Payload. Emergency services can now prioritize their safety.
          </p>

          {/* Info boxes */}
          <div className="space-y-3 mt-8 w-full max-w-xs">
            <div className="bg-green-50 border border-green-100 rounded-2xl p-3 flex items-start gap-2">
              <span className="material-symbols-outlined text-safe-green flex-none text-xl mt-0.5">
                verified
              </span>
              <div>
                <p className="text-xs font-bold text-safe-green">Encrypted Sync Complete</p>
                <p className="text-xs text-green-700 leading-tight mt-0.5">
                  SHA-256 hashed and securely stored in Firebase Registry.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 flex items-start gap-2">
              <span className="material-symbols-outlined text-primary flex-none text-xl mt-0.5">
                location_on
              </span>
              <div>
                <p className="text-xs font-bold text-primary">Location Sharing Active</p>
                <p className="text-xs text-blue-700 leading-tight mt-0.5">
                  Your dependent's triage tag will appear on rescue maps.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-28 left-6 right-6 flex flex-col gap-3">
          <button
            onClick={onReturn}
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
              isLoading
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-blue-800 active:scale-95'
            }`}
          >
            Return to Profile Dashboard
          </button>

          <button
            onClick={onAddAnother}
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
              isLoading
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-100 text-slate-900 hover:bg-slate-200 active:scale-95'
            }`}
          >
            Add Another Dependent
          </button>
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

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
