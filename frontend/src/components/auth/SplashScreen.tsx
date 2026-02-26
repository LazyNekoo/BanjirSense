import React from "react";
import { Check, Code, Shield } from "lucide-react";

type PoweredByBadgeProps = {
  label?: string;
  vendor?: string;
};

type SecurityFooterProps = {
  text?: string;
};

const PoweredByBadge: React.FC<PoweredByBadgeProps> = ({
  label = "Powered by",
  vendor = "Vertex AI",
}) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-full">
      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
        {label}
      </span>
      <div className="flex items-center gap-1">
        <Code className="h-4 w-4 text-slate-600" aria-hidden="true" />
        <span className="text-xs font-bold text-slate-700">{vendor}</span>
      </div>
    </div>
  );
};

const SecurityFooter: React.FC<SecurityFooterProps> = ({
  text = "Secure Government-Linked Encryption",
}) => {
  return (
    <div className="flex items-center gap-2 group">
      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-trust-green/10">
        <Check className="h-[14px] w-[14px] text-trust-green" aria-hidden="true" />
      </div>
      <span className="text-[11px] font-medium text-slate-500 tracking-wide uppercase">
        {text}
      </span>
    </div>
  );
};

const SplashScreen: React.FC = () => {
  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center p-0 md:p-4 font-display text-dark-navy">
      <div className="w-full max-w-[400px] bg-white h-screen md:h-[824px] rounded-none md:rounded-[3rem] shadow-none md:shadow-2xl overflow-hidden flex flex-col relative border-0 md:border md:border-slate-200">
        <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-8 text-center">
          <div className="mb-6 md:mb-8">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] bg-white border border-slate-100 flex items-center justify-center text-primary shadow-2xl shadow-blue-900/10">
              <Shield className="h-12 w-12 md:h-14 md:w-14" aria-hidden="true" />
            </div>
          </div>
          <div className="space-y-2 md:space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-dark-navy">
              BanjirSense
            </h1>
            <p className="text-[9px] md:text-[10px] font-bold text-primary uppercase tracking-ultra-wide">
              National Flood Intelligence
            </p>
          </div>
        </div>
        <div className="flex-none pb-12 md:pb-16 px-6 md:px-8 flex flex-col items-center gap-4 md:gap-6">
          <PoweredByBadge />
          <SecurityFooter />
        </div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
};

export default SplashScreen;
