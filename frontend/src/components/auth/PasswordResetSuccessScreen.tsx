import React, { useState, useEffect } from 'react';

interface PasswordResetSuccessScreenProps {
  onContinue: () => void;
}

export const PasswordResetSuccessScreen: React.FC<PasswordResetSuccessScreenProps> = ({
  onContinue,
}) => {
  const [redirectTimer, setRedirectTimer] = useState(5);
  const [autoRedirecting, setAutoRedirecting] = useState(true);

  // Auto-redirect timer
  useEffect(() => {
    if (autoRedirecting && redirectTimer > 0) {
      const timer = setTimeout(() => setRedirectTimer(redirectTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (autoRedirecting && redirectTimer === 0) {
      onContinue();
    }
  }, [redirectTimer, autoRedirecting, onContinue]);

  const handleContinue = () => {
    setAutoRedirecting(false);
    onContinue();
  };

  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center p-0 md:p-4 font-display text-dark-navy">
      <div className="w-full max-w-[400px] bg-white h-screen md:h-[824px] rounded-none md:rounded-[3rem] shadow-none md:shadow-2xl overflow-hidden flex flex-col relative border-0 md:border md:border-slate-200">
        {/* Header */}
        <header className="flex-none px-8 pt-12 pb-4 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-blue-100">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-dark-navy">
                BanjirSense+
              </h1>
              <p className="text-[9px] font-bold text-primary uppercase tracking-[0.3em] mt-0.5">
                National Flood Intelligence
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-10 text-center">
          {/* Success Graphic */}
          <div className="relative mb-8">
            <div
              className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100"
              style={{ boxShadow: '0 0 40px rgba(16, 185, 129, 0.2)' }}
            >
              <svg className="w-12 h-12 text-trust-green" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-4 mb-10">
            <h2 className="text-2xl font-bold text-dark-navy leading-tight">
              Password Successfully Reset!
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Your account security has been updated. You can now log in with your new credentials to access the National Flood Intelligence dashboard.
            </p>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full py-4 bg-primary text-white rounded-3xl font-bold text-sm shadow-xl shadow-blue-900/20 hover:bg-blue-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mb-8 uppercase tracking-wide"
          >
            Continue to Login
          </button>

          {/* Auto-redirect Timer */}
          <div className="flex items-center gap-2 text-slate-400">
            <span className="material-icons-round text-sm animate-pulse">sync</span>
            <p className="text-xs font-medium italic">
              Auto-redirecting to login in {redirectTimer} second{redirectTimer !== 1 ? 's' : ''}...
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex-none px-8 py-8 bg-white border-t border-slate-50">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-2 opacity-70">
              <svg className="w-4 h-4 text-trust-green" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
              </svg>
              <span className="text-[10px] font-medium text-slate-500 tracking-wide uppercase">
                Secure Government-Linked Encryption
              </span>
            </div>
            <p className="text-center text-[10px] text-slate-400 leading-relaxed max-w-[320px]">
              Need help? Contact the National Emergency Support at{' '}
              <a href="#" className="underline hover:text-primary transition-colors">
                support@banjirsense.gov
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};
