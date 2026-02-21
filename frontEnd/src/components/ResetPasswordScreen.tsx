import React, { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle, Droplets } from 'lucide-react';

interface ResetPasswordScreenProps {
  onBack: () => void;
  onSendCode: (email: string) => void;
  isLoading?: boolean;
}

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  onBack,
  onSendCode,
  isLoading = false,
}) => {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (emailValue: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
  };

  const isEmailValid = validateEmail(email);
  const isFormValid = email.trim() && isEmailValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (isFormValid) {
      setIsSubmitted(true);
      onSendCode(email);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center p-0 md:p-6 font-display text-dark-navy">
      <div className="w-full max-w-[390px] bg-white h-screen md:h-[844px] rounded-none md:rounded-[2.5rem] shadow-none md:shadow-2xl overflow-hidden flex flex-col relative border-0 md:border md:border-slate-200">
        {/* Header */}
        <header className="flex-none px-8 pt-8 pb-5 bg-white sticky top-0 z-30 border-b border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={onBack}
              className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors group"
              aria-label="Go back"
            >
              <ArrowLeft className="text-slate-400 group-hover:text-primary transition-colors" size={24} />
            </button>
            <div className="flex gap-1.5">
              <div className="h-1.5 w-8 bg-primary rounded-full transition-all duration-300"></div>
              <div className="h-1.5 w-2 bg-slate-200 rounded-full transition-all duration-300"></div>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-dark-navy">Reset Password</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Enter your email to receive a verification code.
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">
                Email Address
              </label>
              <div className={`flex items-center gap-3 px-4 py-3.5 rounded-3xl border transition-all ${
                touched && email && !isEmailValid
                  ? 'border-red-400 bg-red-50'
                  : 'border-slate-200 bg-slate-50'
              } focus-within:ring-2 ${
                touched && email && !isEmailValid
                  ? 'focus-within:ring-red-300'
                  : 'focus-within:ring-primary'
              }`}>
                <Mail className="text-slate-400 flex-shrink-0" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched(true)}
                  placeholder="name@example.com"
                  className="flex-1 bg-transparent text-sm outline-none"
                />
              </div>
              {touched && email && !isEmailValid && (
                <p className="text-xs text-red-600">Invalid email format</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading || isSubmitted}
              className={`w-full py-4 rounded-3xl font-bold text-sm transition-all flex items-center justify-center gap-2 uppercase tracking-wide shadow-xl shadow-blue-900/20 ${
                isFormValid && !isLoading && !isSubmitted
                  ? 'bg-primary text-white hover:bg-blue-800 active:scale-[0.98]'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Sending...' : 'Send Verification Code'}
            </button>

            {/* Back to Login Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={onBack}
                className="text-sm font-bold text-primary hover:text-blue-800 transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                <ArrowLeft size={18} />
                Back to Login
              </button>
            </div>
          </form>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 pt-16 opacity-80">
            <CheckCircle className="text-trust-green" size={24} />
            <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">
              Secure Government-Linked Encryption
            </span>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex-none px-8 py-8 bg-white border-t border-slate-100">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-white">
                <Droplets size={16} />
              </div>
              <span className="font-bold text-sm tracking-tight text-dark-navy">
                BanjirSense+
              </span>
            </div>
            <p className="text-center text-[10px] text-slate-400 leading-relaxed max-w-[280px]">
              Part of the National Flood Intelligence ecosystem.
              Need help?{' '}
              <a href="#" className="underline font-medium text-slate-500 hover:text-primary transition-colors">
                Contact Support
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};
