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
  tipsBM?: string[]; // we will reuse this for AI checklist + tip
};

interface RoutinePreparednessScreenProps {
  onBack: () => void;
  onSubmit: () => void;
  ai?: AiRisk | null;
  userLoc?: { lat: number; lng: number } | null;
}

export function RoutinePreparednessScreen({
  onBack,
  onSubmit,
  ai,
  userLoc,
}: RoutinePreparednessScreenProps) {
  const riskLevel = ai?.riskLevel ?? "LOW";

  // ✅ nicer location label
  const locationName =
  userLoc
    ? `${userLoc.lat.toFixed(3)}, ${userLoc.lng.toFixed(3)} (Your Current Location)`
    : "Near you";

  // ✅ AI checklist tasks: use first 4 strings from tipsBM (if any)
  const aiTasks =
    ai?.tipsBM?.filter((t) => typeof t === "string" && t.trim().length > 0).slice(0, 4) ??
    [];

  // ✅ fallback fixed tasks if AI tasks missing
  const fallbackTasks = [
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
  ];

  // ✅ this is what UI will render
  const checklistItems =
    aiTasks.length > 0
      ? aiTasks.map((t) => ({
          title: t.trim(),
          detail: "AI-generated for your current risk level.",
        }))
      : fallbackTasks;

  // ✅ Gemini tip: use the next item (5th) if exists, else use first non-empty
  const geminiTip =
    (ai?.tipsBM?.filter((t) => typeof t === "string" && t.trim().length > 0)[4] ??
      ai?.tipsBM?.find((t) => typeof t === "string" && t.trim().length > 0) ??
      "No Gemini tips available yet. Tap refresh on Home to fetch the latest guidance.") as string;

  // ✅ status label + color
  const statusLabel = riskLevel === "HIGH" ? "High Risk" : riskLevel === "MEDIUM" ? "Moderate" : "Stable";

  const statusClass =
    riskLevel === "HIGH"
      ? "bg-red-100 text-red-700"
      : riskLevel === "MEDIUM"
        ? "bg-amber-100 text-amber-700"
        : "bg-green-100 text-green-700";

  // ✅ dynamic header status text
  const statusText =
    riskLevel === "HIGH"
      ? "High risk detected. Complete these tasks now."
      : riskLevel === "MEDIUM"
        ? "Some risk detected. Stay prepared and monitor updates."
        : "No immediate threat detected. Keep your household ready.";

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
              <p className="text-[13px] font-medium leading-tight">{statusText}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar px-6 py-6 pb-28">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Safety Checklist</h2>

            {/* ✅ dynamic task count */}
            <span className="text-xs font-bold text-primary bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase tracking-wide">
              {checklistItems.length} Tasks
            </span>
          </div>

          {/* ✅ AI-driven checklist */}
          <div className="space-y-4">
            {checklistItems.map((item) => (
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

          {/* ✅ Gemini tip card */}
          <div className="mt-8 p-5 rounded-3xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={18} className="text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Gemini AI Insights
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold">⚲</span>
                <span>{locationName}</span>
              </div>

              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${statusClass}`}>
                {statusLabel}
              </span>
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