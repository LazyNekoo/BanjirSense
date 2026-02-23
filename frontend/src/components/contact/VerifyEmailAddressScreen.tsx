import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Home,
  Map,
  Megaphone,
  User,
} from 'lucide-react';

interface VerifyEmailAddressScreenProps {
  onBack?: () => void;
  onConfirm?: (code: string) => void;
  onNavigate?: (screen: string) => void;
  email?: string;
}

export function VerifyEmailAddressScreen({
  onBack,
  onConfirm,
  onNavigate,
  email = 'amirul.hafiz@example.com',
}: VerifyEmailAddressScreenProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const next = [...code];
    next[index] = value;
    setCode(next);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirm = () => {
    const fullCode = code.join('');
    if (fullCode.length === 6) {
      onConfirm?.(fullCode);
    }
  };

  const handleResend = () => {
    if (resendTimer === 0) {
      setResendTimer(60);
    }
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
          <h1 className="text-xl font-bold text-slate-900">Verify Email Address</h1>
        </header>

        <div className="flex-1 overflow-y-auto px-6 pt-6 no-scrollbar">
          <div className="space-y-8">
            <div className="space-y-2 text-slate-600 leading-relaxed">
              <p>
                We've sent a verification link and code to{' '}
                <span className="font-semibold text-slate-900">{email}</span>.
              </p>
              <p>Please enter the 6-digit code below to verify your new email.</p>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => (inputRefs.current[index] = element)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(event) => handleInputChange(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  placeholder="-"
                  className="w-full aspect-square text-center text-2xl font-bold border-2 border-slate-200 rounded-2xl focus:border-primary focus:ring-0 outline-none transition-colors"
                />
              ))}
            </div>

            <div className="space-y-6 pt-4">
              <button
                onClick={handleConfirm}
                className="w-full bg-safety-blue hover:bg-blue-900 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-all"
              >
                VERIFY &amp; SYNC
              </button>

              <div className="text-center">
                <p className="text-sm text-slate-500">
                  Didn't receive an email?{' '}
                  {resendTimer > 0 ? (
                    <span className="text-primary font-semibold">Resend in {resendTimer}s</span>
                  ) : (
                    <button
                      onClick={handleResend}
                      className="text-primary font-semibold hover:underline"
                    >
                      Resend now
                    </button>
                  )}
                </p>
              </div>
            </div>
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

export default VerifyEmailAddressScreen;
