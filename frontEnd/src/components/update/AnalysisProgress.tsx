import { useEffect, useState } from "react";
import { Home, Map, Megaphone, User } from "lucide-react";

interface AnalysisProgressProps {
  onComplete?: () => void;
  onNavigate?: (screen: string) => void;
  onOpenSOS?: () => void;
  /**
   * Duration of the analysis phase in milliseconds.
   * Defaults to 4000ms.
   */
  durationMs?: number;
}

const STATUS_STEPS = [
  "Uploading image data...",
  "Verifying image metadata...",
  "Cross-referencing sensor data...",
  "Estimating flood depth...",
  "Finalising AI report...",
];

export function AnalysisProgress({
  onComplete,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onNavigate: _onNavigate,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onOpenSOS: _onOpenSOS,
  durationMs = 4000,
}: AnalysisProgressProps) {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = 50; // ms
    const steps = durationMs / interval;
    const increment = 100 / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        setTimeout(() => onComplete?.(), 400);
      }
      setProgress(current);
      // Advance status text proportionally
      setStatusIndex(Math.min(Math.floor((current / 100) * STATUS_STEPS.length), STATUS_STEPS.length - 1));
    }, interval);

    return () => clearInterval(timer);
  }, [durationMs, onComplete]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-4 font-display">
    <div className="w-[400px] h-[824px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-slate-200">
      {/* Blurred background - form skeleton */}
      <header className="pt-12 px-6 pb-4 bg-white flex items-center gap-4 flex-none z-10 opacity-20">
        <div className="w-10 h-10 rounded-full bg-slate-100" />
        <div className="h-5 w-48 bg-slate-200 rounded-lg" />
      </header>
      <div className="flex-1 overflow-hidden px-6 space-y-4 opacity-20 pointer-events-none">
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="aspect-square bg-slate-100 rounded-2xl" />
          ))}
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="h-12 bg-slate-100 rounded-xl" />
        ))}
        <div className="h-32 bg-slate-100 rounded-2xl" />
        <div className="h-12 bg-slate-100 rounded-xl" />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center px-10 text-center">
        {/* Pulsing AI Icon */}
        <div className="relative w-48 h-48 mb-10 flex items-center justify-center">
          {/* Outer ring */}
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
          {/* Spinning arc */}
          <div className="absolute inset-0 border-4 border-transparent border-t-[#1e3a8a] rounded-full animate-spin" style={{ animationDuration: "1.5s" }} />
          {/* Small orbit dots */}
          <div className="absolute top-3 right-12 w-2 h-2 bg-[#1e3a8a] rounded-full animate-pulse" />
          <div className="absolute bottom-5 left-8 w-2 h-2 bg-[#1e3a8a] rounded-full animate-pulse" style={{ animationDelay: "0.7s" }} />
          {/* Icon circle */}
          <div className="relative bg-blue-50 w-32 h-32 rounded-full flex items-center justify-center shadow-inner">
            <svg viewBox="0 0 24 24" className="w-16 h-16 text-[#1e3a8a] opacity-80" fill="currentColor">
              {/* psychology / brain icon via path */}
              <path d="M13 8.5c0-.83-.67-1.5-1.5-1.5S10 7.67 10 8.5v.26C8.22 9.3 7 10.52 7 12c0 1.1.61 2.08 1.56 2.65l-.05.35H8c-.55 0-1 .45-1 1s.45 1 1 1h.75l.28 1H8c-.55 0-1 .45-1 1s.45 1 1 1h1.41l.59 2h4l.59-2H16c.55 0 1-.45 1-1s-.45-1-1-1h-.97l.28-1H16c.55 0 1-.45 1-1s-.45-1-1-1h-.51l-.05-.35C16.39 14.08 17 13.1 17 12c0-1.48-1.22-2.7-3-3.24V8.5zm-1.5 1c.17 0 .5.08.5.5v.71l.47.12C13.6 11.12 15 11.47 15 12c0 .53-.78 1-1.5 1h-3c-.72 0-1.5-.47-1.5-1 0-.53 1.4-.88 2.53-1.17L12 10.71V10c0-.42.33-.5.5-.5z" />
            </svg>
            <div className="absolute top-4 right-4 w-2 h-2 bg-[#1e3a8a] rounded-full animate-pulse" />
            <div className="absolute bottom-6 left-2 w-2 h-2 bg-[#1e3a8a] rounded-full animate-pulse" style={{ animationDelay: "0.7s" }} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-3">Analyzing Your Report...</h2>
        <p className="text-slate-500 leading-relaxed max-w-xs mb-6">
          Gemini and Vision AI are verifying water levels and location data to ensure community accuracy.
        </p>

        {/* Dynamic status text */}
        <p className="text-xs font-semibold text-[#1e3a8a] mb-8 h-4 transition-all">
          {STATUS_STEPS[statusIndex]}
        </p>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1e3a8a] rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2 font-medium">{Math.round(progress)}%</p>
      </div>

      {/* Bottom Nav (dimmed) */}
      <nav className="flex-none bg-white border-t border-slate-100 px-6 py-4 grid grid-cols-5 items-end z-30 opacity-20 pointer-events-none">
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <Home size={20} />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <Map size={20} />
          <span className="text-[10px] font-medium">Map</span>
        </button>
        <div className="flex flex-col items-center gap-1 -mt-10">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white ring-[6px] ring-white font-black text-2xl tracking-tighter">
            SOS
          </div>
        </div>
        <button className="flex flex-col items-center gap-1 text-primary">
          <Megaphone size={20} />
          <span className="text-[10px] font-bold">Updates</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <User size={20} />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>
    </div>
    </div>
  );
}
