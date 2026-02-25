import { Home, Map, Megaphone, User } from "lucide-react";

interface ReportSuccessProps {
  onBackToDashboard?: () => void;
  onViewReport?: () => void;
  onNavigate?: (screen: string) => void;
  onOpenSOS?: () => void;
  /** Location name used in the sub-text, e.g. "Shah Alam" */
  locationName?: string;
}

export function ReportSuccess({
  onBackToDashboard,
  onViewReport,
  onNavigate,
  onOpenSOS,
  locationName = "Shah Alam",
}: ReportSuccessProps) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-4 font-display">
    <div className="w-[400px] h-[824px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-slate-200">
      {/* Main content — centred */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center bg-white z-10">
        {/* Animated checkmark graphic */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-14 h-14 text-green-500 animate-bounce"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.59L5.41 12 6.83 10.58l3.17 3.17 6.35-6.35 1.42 1.42L10 16.59z" />
            </svg>
          </div>
          {/* Ping ring */}
          <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-20" />
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 mb-4">
          Report Successfully Shared!
        </h2>
        <p className="text-slate-500 leading-relaxed mb-3 max-w-xs">
          Your report is now live on the Tactical Map and Updates feed.
        </p>
        <p className="text-slate-500 leading-relaxed mb-12 max-w-xs">
          NADMA coordinators have been notified and are monitoring the situation in{" "}
          <span className="font-semibold text-slate-700">{locationName}</span>.
        </p>

        <div className="w-full space-y-4">
          {/* Primary CTA */}
          <button
            onClick={onBackToDashboard ?? (() => onNavigate?.("home"))}
            className="w-full py-4 bg-[#1e3a8a] text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all hover:bg-blue-900"
          >
            Back to Home Dashboard
          </button>

          {/* Secondary CTA */}
          <button
            onClick={onViewReport}
            className="w-full py-2 text-[#1e3a8a] font-semibold text-base hover:underline transition-all"
          >
            View My Report
          </button>
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="flex-none bg-white border-t border-slate-100 px-6 py-4 grid grid-cols-5 items-end z-30">
        <button
          onClick={() => onNavigate?.("home")}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
        >
          <Home size={20} />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button
          onClick={() => onNavigate?.("map")}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
        >
          <Map size={20} />
          <span className="text-[10px] font-medium">Map</span>
        </button>
        <div className="flex flex-col items-center gap-1 -mt-10">
          <button
            onClick={() => onOpenSOS?.()}
            className="w-20 h-20 bg-primary rounded-full shadow-2xl shadow-blue-900/40 flex items-center justify-center text-white ring-[6px] ring-white active:scale-95 transition-transform font-black text-2xl tracking-tighter hover:bg-blue-900"
          >
            SOS
          </button>
        </div>
        <button className="flex flex-col items-center gap-1 text-primary">
          <Megaphone size={20} />
          <span className="text-[10px] font-bold">Updates</span>
        </button>
        <button
          onClick={() => onNavigate?.("profile")}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
        >
          <User size={20} />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>
    </div>
    </div>
  );
}
