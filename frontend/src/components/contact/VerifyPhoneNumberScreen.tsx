import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Home,
  Map,
  Megaphone,
  User,
} from 'lucide-react';

interface VerifyPhoneNumberScreenProps {
  onBack?: () => void;
  onConfirm?: (code: string) => void;
  onNavigate?: (screen: string) => void;
  phoneNumber?: string;
}

export function VerifyPhoneNumberScreen({
  onBack,
  onConfirm,
  onNavigate,
  phoneNumber = '+60 12-345 6789',
}: VerifyPhoneNumberScreenProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(45);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
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
      setResendTimer(45);
      // Trigger resend logic here
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-4 font-display text-dark-text">
      <div className="w-full md:w-[400px] max-w-[400px] h-screen md:h-[824px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-slate-200">
        {/* Header */}
        <header className="flex-none pt-12 px-6 pb-4 bg-white backdrop-blur-md sticky top-0 z-30 flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Verify Phone Number</h1>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
          <div className="space-y-8">
            {/* Instruction Text */}
            <div>
              <p className="text-slate-600 leading-relaxed">
                We've sent a 6-digit code to{' '}
                <span className="font-bold text-slate-900">{phoneNumber}</span>. Please
                enter it below to secure your profile.
              </p>
            </div>

            {/* OTP Input Grid */}
            <div className="grid grid-cols-6 gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  placeholder="•"
                  className="w-full aspect-square text-center text-2xl font-bold bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:ring-0 transition-all outline-none"
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleConfirm}
                className="w-full bg-safety-blue hover:bg-blue-900 text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"
              >
                Confirm &amp; Sync
              </button>

              <div className="text-center">
                <p className="text-sm text-slate-500">
                  Didn't receive a code?{' '}
                  {resendTimer > 0 ? (
                    <span className="text-primary font-semibold">
                      Resend in {resendTimer}s
                    </span>
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

export default VerifyPhoneNumberScreen;
