import { useEffect } from 'react';
import {
  CheckCircle2,
  Home,
  Map,
  Megaphone,
  User,
} from 'lucide-react';

interface PhoneUpdateSuccessScreenProps {
  onNavigate?: (screen: string) => void;
  onRedirectComplete?: () => void;
  redirectDelay?: number;
}

export function PhoneUpdateSuccessScreen({
  onNavigate,
  onRedirectComplete,
  redirectDelay = 3000,
}: PhoneUpdateSuccessScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRedirectComplete?.();
    }, redirectDelay);

    return () => clearTimeout(timer);
  }, [onRedirectComplete, redirectDelay]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-4 font-display text-dark-text">
      <div className="w-full md:w-[400px] max-w-[400px] h-screen md:h-[824px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-slate-200">
        {/* Main Content - Centered */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center bg-white">
          {/* Success Icon with Animation */}
          <div className="mb-8 relative">
            <div className="w-24 h-24 bg-safe-green/10 rounded-full flex items-center justify-center">
              <CheckCircle2 size={64} className="text-safe-green" strokeWidth={2} />
            </div>
            {/* Pulsing Ring Effect */}
            <div className="absolute inset-0 border-2 border-safe-green/20 rounded-full animate-ping opacity-25"></div>
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Phone Number Updated!
          </h1>
          <p className="text-slate-500 leading-relaxed max-w-[280px]">
            Your new contact details are now synced with your emergency profile and
            rescue payload.
          </p>

          {/* Loading Spinner */}
          <div className="mt-16 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-slate-200 border-t-primary rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-slate-400">
              Redirecting to Profile...
            </span>
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
            <button className="w-16 h-16 bg-primary rounded-full shadow-2xl shadow-blue-900/40 flex items-center justify-center text-white ring-[6px] ring-white active:scale-95 transition-transform font-black text-lg tracking-tighter hover:bg-blue-900">
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

export default PhoneUpdateSuccessScreen;
