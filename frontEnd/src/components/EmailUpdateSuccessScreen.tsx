import { useEffect } from 'react';
import {
  Home,
  Map,
  Megaphone,
  User,
} from 'lucide-react';

interface EmailUpdateSuccessScreenProps {
  onNavigate?: (screen: string) => void;
  onRedirectComplete?: () => void;
  redirectDelay?: number;
}

export function EmailUpdateSuccessScreen({
  onNavigate,
  onRedirectComplete,
  redirectDelay = 3000,
}: EmailUpdateSuccessScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRedirectComplete?.();
    }, redirectDelay);

    return () => clearTimeout(timer);
  }, [onRedirectComplete, redirectDelay]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-4 font-display text-dark-text">
      <div className="w-[400px] h-[824px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-slate-200">
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="mb-8 relative">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-safe-green text-6xl">check_circle</span>
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-green-100 animate-ping opacity-25"></div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-4">Email Address Updated!</h1>
          <p className="text-slate-600 leading-relaxed mb-12 max-w-xs">
            Your official contact email has been successfully verified and updated in the National Response Cloud.
          </p>

          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-slate-400">Redirecting to Profile...</span>
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

export default EmailUpdateSuccessScreen;
