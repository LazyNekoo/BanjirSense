import React, { useState } from "react";
import {
  Mail,
  Lock,
  LogIn,
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";

// Validation utilities
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isPasswordValid = (password: string): boolean => {
  return password.length >= 8;
};

interface LoginScreenProps {
  onGoogleLogin?: () => void;
  onLoginSubmit?: (email: string, password: string) => void | Promise<void>;
  onRegisterClick?: () => void;
  onForgotPassword?: () => void;
  isLoading?: boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  onGoogleLogin,
  onLoginSubmit,
  onRegisterClick,
  onForgotPassword,
  isLoading = false,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const isEmailValid = email === "" || validateEmail(email);
  const isPasswordValidStrict = isPasswordValid(password);
  const isFormValid =
    email !== "" &&
    isEmailValid &&
    password !== "" &&
    isPasswordValidStrict;

  const emailError =
    touched.email && email !== "" && !isEmailValid
      ? "Invalid format: @gmail.com required"
      : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (isFormValid && onLoginSubmit) {
      await onLoginSubmit(email, password);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center p-0 md:p-6 font-display text-dark-navy">
      <div className="w-full max-w-[390px] bg-white h-screen md:h-[844px] rounded-none md:rounded-[2.5rem] shadow-none md:shadow-2xl overflow-hidden flex flex-col relative border-0 md:border md:border-slate-200">
        {/* Header */}
        <header className="flex-none px-8 pt-12 pb-8 text-center bg-white">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-blue-100">
              <Shield className="h-8 w-8" aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-bold text-3xl tracking-tight text-dark-navy">
                BanjirSense
              </h1>
              <p className="text-[11px] font-bold text-primary uppercase tracking-[0.3em] mt-1">
                National Flood Intelligence
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-dark-navy">Welcome Back</h2>
            <p className="text-sm text-slate-500 max-w-[280px] mx-auto">
              Access real-time flood monitoring and emergency response services.
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar px-8 pb-10">
          <div className="space-y-6">
            {/* Google Login Button */}
            <button
              type="button"
              onClick={onGoogleLogin}
              className="w-full py-3.5 px-4 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                ></path>
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                ></path>
              </svg>
              <span className="text-sm font-semibold text-slate-700">
                Continue with Google
              </span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-2">
              <div className="h-[1px] flex-1 bg-slate-100"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                or login with email
              </span>
              <div className="h-[1px] flex-1 bg-slate-100"></div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" aria-hidden="true" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched({ ...touched, email: true })}
                    className={`w-full rounded-xl border bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium outline-none transition-all ${
                      emailError
                        ? "border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-400"
                        : "border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary"
                    }`}
                    required
                  />
                </div>
                {emailError && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" aria-hidden="true" />
                    <span className="text-xs text-red-600 font-medium">
                      {emailError}
                    </span>
                  </div>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" aria-hidden="true" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched({ ...touched, password: true })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-11 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 transition-all ${
                  isFormValid && !isLoading
                    ? "bg-primary text-white hover:bg-blue-800 active:scale-[0.98]"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                LOGIN
                <LogIn className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>

            {/* Registration Link */}
            <div className="text-center pt-2">
              <p className="text-sm text-slate-500">
                New to BanjirSense?{" "}
                <button
                  type="button"
                  onClick={onRegisterClick}
                  className="text-primary font-bold hover:underline ml-1"
                >
                  Register Now
                </button>
              </p>
            </div>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 pt-12 opacity-70">
            <Shield className="h-4 w-4 text-trust-green" aria-hidden="true" />
            <span className="text-[11px] font-medium text-slate-500 tracking-wide uppercase">
              Secure Government-Linked Encryption
            </span>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex-none px-8 py-6 bg-white border-t border-slate-50">
          <p className="text-center text-[10px] text-slate-400 leading-relaxed max-w-[320px] mx-auto">
            BanjirSense is a trusted platform for flood disaster management.
            By logging in, you agree to our{" "}
            <a href="#" className="underline">
              Terms of Use
            </a>{" "}
            and{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>
            .
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LoginScreen;
