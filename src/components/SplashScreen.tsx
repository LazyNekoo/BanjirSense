import React from "react";
import { Check, Code, Droplets } from "lucide-react";

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
    <div className="bg-slate-200 min-h-screen flex items-center justify-center p-0 md:p-6 font-display text-dark-navy">
      <div className="w-full max-w-[480px] bg-off-white h-screen md:h-[850px] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-slate-300">
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="mb-8">
            <div className="w-24 h-24 rounded-[2rem] bg-white border border-slate-100 flex items-center justify-center text-primary shadow-2xl shadow-blue-900/10">
              <Droplets className="h-14 w-14" aria-hidden="true" />
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight text-dark-navy">
              BanjirSense+
            </h1>
            <p className="text-[10px] font-bold text-primary uppercase tracking-ultra-wide">
              National Flood Intelligence
            </p>
          </div>
        </div>
        <div className="flex-none pb-16 px-8 flex flex-col items-center gap-6">
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
