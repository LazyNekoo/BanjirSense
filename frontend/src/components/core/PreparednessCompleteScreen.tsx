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

type AiRisk = {
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  hoursAhead?: number;
  riskScore?: number;
  summary?: string;
  tipsBM?: string[];
};

interface PreparednessCompleteScreenProps {
  onBackToHome: () => void;
  ai?: AiRisk | null;
}

export function PreparednessCompleteScreen({ onBackToHome, ai }: PreparednessCompleteScreenProps) {
  const geminiTip =
    ai?.tipsBM?.find((t) => typeof t === "string" && t.trim().length > 0) ??
    "Tip will appear after you refresh Home.";

  const aiText =
    ai?.summary ?? "AI summary will appear after you refresh Home.";

    const cleanGeminiTip = geminiTip
    ?.replace(/\(Location:[^)]+\)/gi, "") // remove (Location: ...)
    ?.replace(/\*\*/g, "")                // remove markdown bold if any
    ?.trim();

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-4 font-display text-dark-navy">
      <div className="w-[400px] max-w-[400px] h-[824px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-slate-200">
        <header className="flex-none px-6 pt-8 pb-4 bg-white z-30 border-b border-transparent">
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToHome}
              className="w-9 h-9 flex items-center justify-center bg-slate-50 rounded-full text-primary"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="font-bold text-lg tracking-tight text-primary">Routine Preparedness</h1>
            <button className="w-9 h-9 flex items-center justify-center text-slate-400" aria-label="More options">
              <MoreVertical size={18} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar px-8 flex flex-col items-center pt-12 pb-28 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 mt-6 shadow-[0_0_40px_rgba(34,197,94,0.2)] flex-none">
            <CheckCircle className="text-green-500" size={52} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-3 px-4 leading-tight">
            Your Household is Prepared!
          </h2>
          <p className="text-[15px] leading-relaxed text-slate-500 mb-6">
            All routine safety tasks have been completed. Your dependents are registered for priority rescue.
          </p>
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full mb-10">
            <ShieldCheck size={16} className="text-primary" />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">
              Preparation Score: 100%
            </span>
          </div>
          <div className="w-full space-y-4">
            <button
              onClick={onBackToHome}
              className="w-full py-4 bg-primary hover:bg-blue-900 text-white font-bold rounded-2xl shadow-xl shadow-blue-900/20 transition-all active:scale-[0.98]"
            >
              Back to Home Dashboard
            </button>
            <button className="w-full py-3 text-primary font-semibold text-sm hover:underline">
              Set Reminder for Next Routine Check
            </button>
          </div>

          <div className="mt-12 p-5 rounded-3xl bg-slate-50 border border-slate-100 w-full text-left">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={18} className="text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                AI Safety Verification
              </span>
            </div>
            <p className="text-[13px] leading-relaxed text-slate-700">
              <span className="font-bold text-primary">AI:</span> {aiText}
            </p>

            <div className="mt-3 pt-3 border-t border-slate-200">
              <p className="text-[13px] text-slate-700 leading-relaxed">
                  {cleanGeminiTip}
                </p>
            </div>
          </div>
        </main>

        <nav className="flex-none bg-white border-t border-slate-100 px-6 py-4 grid grid-cols-5 items-end z-40">
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
