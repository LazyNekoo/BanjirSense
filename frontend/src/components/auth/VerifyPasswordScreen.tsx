import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, Circle, ArrowLeft, Lock, Eye, EyeOff, Droplets } from 'lucide-react';

interface VerifyPasswordScreenProps {
  onBack: () => void;
  onSuccess: (password: string) => void;
  email: string;
  isLoading?: boolean;
}

export const VerifyPasswordScreen: React.FC<VerifyPasswordScreenProps> = ({
  onBack,
  onSuccess,
  email,
  isLoading = false,
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Password validation
  const hasMinimumLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[@#$]/.test(password);
  const isPasswordValid = hasMinimumLength && hasNumber && hasSpecial;
  const isConfirmValid = confirmPassword.length > 0 && password === confirmPassword;

  const otpFilled = otp.every((digit) => digit !== '');
  const isFormValid = otpFilled && isPasswordValid && isConfirmValid;

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Format resend timer display (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Move to next input if value entered
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (canResend) {
      setResendTimer(45);
      setCanResend(false);
      // TODO: Call API to resend OTP
      console.log('Resending verification code to:', email);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ password: true, confirmPassword: true });

    if (isFormValid && !isLoading) {
      onSuccess(password);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center p-0 md:p-4 font-display text-dark-navy">
      <div className="w-full max-w-[400px] bg-white h-screen md:h-[824px] rounded-none md:rounded-[3rem] shadow-none md:shadow-2xl overflow-hidden flex flex-col relative border-0 md:border md:border-slate-200">
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
          <h2 className="text-2xl font-bold text-dark-navy">Verify & Reset Password</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Enter your verification code and create a strong new password.
          </p>
        </div>
      </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Section */}
            <div className="space-y-3">
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                Verification Code
              </label>
              <div className="grid grid-cols-6 gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpInputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    placeholder="-"
                    maxLength={1}
                    className="w-full h-14 text-center text-xl font-bold border border-slate-200 rounded-3xl bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  />
                ))}
              </div>
              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend}
                  className={`text-[14px] font-semibold transition-colors ${
                    canResend
                      ? 'text-primary hover:text-blue-700'
                      : 'text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {canResend ? 'Resend code' : `Resend code in ${formatTime(resendTimer)}`}
                </button>
              </div>
            </div>

            {/* Password Fields */}
            <div className="space-y-5">
              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">
                  New Password
                </label>
                <div className={`flex items-center gap-3 px-4 py-3.5 rounded-3xl border transition-all ${
                  'border-slate-200 bg-slate-50'
                } focus-within:ring-2 focus-within:ring-primary`}>
                  <Lock className="text-slate-400 flex-shrink-0" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched({ ...touched, password: true })}
                    placeholder="••••••••"
                    className="flex-1 bg-transparent text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <div className={`flex items-center gap-3 px-4 py-3.5 rounded-3xl border transition-all ${
                  'border-slate-200 bg-slate-50'
                } focus-within:ring-2 focus-within:ring-primary`}>
                  <Lock className="text-slate-400 flex-shrink-0" size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => setTouched({ ...touched, confirmPassword: true })}
                    placeholder="••••••••"
                    className="flex-1 bg-transparent text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {touched.confirmPassword && confirmPassword && !isConfirmValid && (
                  <p className="text-xs text-red-600">Passwords do not match</p>
                )}
              </div>

              {/* Security Requirements Card */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Security Requirements
                </h4>
                <div className="space-y-2.5">
                  {/* Minimum 8 characters */}
                  <div className="flex items-center gap-2.5 transition-colors duration-300">
                    {hasMinimumLength ? (
                      <CheckCircle className="text-trust-green flex-shrink-0" size={18} />
                    ) : (
                      <Circle className="text-slate-400 flex-shrink-0" size={18} />
                    )}
                    <span
                      className={`text-[14px] transition-colors ${
                        hasMinimumLength
                          ? 'text-trust-green font-semibold'
                          : 'text-slate-500'
                      }`}
                    >
                      Minimum 8 characters
                    </span>
                  </div>

                  {/* Number requirement */}
                  <div className="flex items-center gap-2.5 transition-colors duration-300">
                    {hasNumber ? (
                      <CheckCircle className="text-trust-green flex-shrink-0" size={18} />
                    ) : (
                      <Circle className="text-slate-400 flex-shrink-0" size={18} />
                    )}
                    <span
                      className={`text-[14px] transition-colors ${
                        hasNumber ? 'text-trust-green font-semibold' : 'text-slate-500'
                      }`}
                    >
                      Include at least one number (0-9)
                    </span>
                  </div>

                  {/* Special character requirement */}
                  <div className="flex items-center gap-2.5 transition-colors duration-300">
                    {hasSpecial ? (
                      <CheckCircle className="text-trust-green flex-shrink-0" size={18} />
                    ) : (
                      <Circle className="text-slate-400 flex-shrink-0" size={18} />
                    )}
                    <span
                      className={`text-[14px] transition-colors ${
                        hasSpecial ? 'text-trust-green font-semibold' : 'text-slate-500'
                      }`}
                    >
                      Include a special character (e.g., @, #, $)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full py-4 rounded-3xl font-bold text-sm transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg shadow-blue-900/10 h-14 mt-6 ${
                isFormValid && !isLoading
                  ? 'bg-primary text-white hover:bg-blue-800 active:scale-[0.98]'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Updating...' : 'Update Password & Login'}
            </button>
          </form>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 pt-10">
            <CheckCircle className="text-trust-green" size={24} />
            <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">
              Secure Government-Linked Encryption
            </span>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex-none w-full py-8 bg-white border-t border-slate-100">
          <div className="max-w-[480px] mx-auto px-6">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-white">
                  <Droplets size={20} />
                </div>
                <span className="font-bold text-lg tracking-tight text-dark-navy">
                  BanjirSense+
                </span>
              </div>
              <p className="text-center text-[12px] text-slate-400 leading-relaxed">
                National Flood Intelligence System
                <span className="mx-2">•</span>
                <a
                  href="#"
                  className="underline font-semibold text-slate-500 hover:text-primary transition-colors"
                >
                  Technical Support
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
