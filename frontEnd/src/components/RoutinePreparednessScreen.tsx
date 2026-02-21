import {
  ArrowLeft,
  CheckCircle,
  Home,
  Map,
  Megaphone,
  MoreVertical,
  ShieldCheck,
  User,
} from "lucide-react";

interface RoutinePreparednessScreenProps {
  onBack: () => void;
  onSubmit: () => void;
}

export function RoutinePreparednessScreen({
  onBack,
  onSubmit,
}: RoutinePreparednessScreenProps) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-4 font-display text-dark-navy">
      <div className="w-[400px] max-w-[400px] h-[824px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-slate-200">
        <header className="flex-none px-6 pt-8 pb-4 bg-primary text-white sticky top-0 z-30 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} />
              <h1 className="font-bold text-lg tracking-tight">Routine Preparedness</h1>
            </div>
            <button className="w-9 h-9 flex items-center justify-center" aria-label="More options">
              <MoreVertical size={18} />
            </button>
          </div>
          <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/20 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <CheckCircle size={18} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider opacity-90">
                Current Status
              </p>
              <p className="text-[13px] font-medium leading-tight">
                No immediate threat detected. Keep your household ready.
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar px-6 py-6 pb-28">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Safety Checklist</h2>
            <span className="text-xs font-bold text-primary bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase tracking-wide">
              4 Tasks
            </span>
          </div>

          <div className="space-y-4">
            {[
              {
                title: "Audit Dependent Profile",
                detail: "Review contact details and health needs for elderly or children.",
              },
              {
                title: "System Sync Check",
                detail: "Ensure all IoT sensors and home alarms are active and reporting.",
              },
              {
                title: "Neighborhood Awareness",
                detail: "Connect with neighbors to verify community contact trees.",
              },
              {
                title: "Maintenance Reporting",
                detail: "Log any observed blocked drains or infrastructure damage.",
              },
            ].map((item) => (
              <label
                key={item.title}
                className="flex items-start gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-primary/30 transition-all cursor-pointer group"
              >
                <input type="checkbox" defaultChecked className="custom-checkbox mt-0.5" />
                <div className="flex-1">
                  <p className="text-[15px] font-bold text-slate-900 group-hover:text-primary transition-colors">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{item.detail}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-primary transition-all">
                  <ShieldCheck size={18} />
                </div>
              </label>
            ))}
          </div>

          <div className="mt-8 px-2">
            <button
              onClick={onSubmit}
              className="w-full bg-primary hover:bg-blue-900 text-white py-5 rounded-2xl font-bold text-base shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              Submit &amp; Sync Preparedness
            </button>
          </div>

          <div className="mt-8 p-5 rounded-3xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={18} className="text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Gemini AI Insights
              </span>
            </div>
            <p className="text-[13px] leading-relaxed text-slate-700">
              Routine maintenance reduces flood impact by up to{" "}
              <span className="font-bold text-primary">30%</span>. Your current area status is:{" "}
              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold text-[11px] uppercase">
                Stable
              </span>.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-[11px] text-slate-500 italic text-center">
                AI analysis based on historical data and live sensor feeds.
              </p>
            </div>
          </div>
        </main>

        <nav className="flex-none bg-white border-t border-slate-100 px-6 py-4 grid grid-cols-5 items-end z-30">
          <button className="flex flex-col items-center gap-1 text-primary">
            <Home size={20} />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400">
            <Map size={20} />
            <span className="text-[10px] font-medium">Map</span>
          </button>
          <div className="flex flex-col items-center gap-1 -mt-10">
            <button className="w-20 h-20 bg-primary rounded-full shadow-2xl shadow-blue-900/40 flex items-center justify-center text-white ring-[6px] ring-white active:scale-95 transition-transform">
              <span className="text-2xl font-black tracking-tighter">SOS</span>
            </button>
          </div>
          <button className="flex flex-col items-center gap-1 text-slate-400">
            <Megaphone size={20} />
            <span className="text-[10px] font-medium">Updates</span>
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
