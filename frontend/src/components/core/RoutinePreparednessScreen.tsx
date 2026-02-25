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

import { useMemo, useState, useEffect } from "react";

type AiRisk = {
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  hoursAhead?: number;
  riskScore?: number;
  summary?: string;
  tipsBM?: string[]; // we will reuse this for AI checklist + tip
};

interface RoutinePreparednessScreenProps {
  onBack: () => void;
  onSubmit: (scorePct: number) => void;
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
    
    // 1️⃣ Extract clean AI tasks
    const parsedTasks = useMemo(() => {
      return (
        ai?.tipsBM
          ?.filter((t) => typeof t === "string" && t.trim().length > 0)
          .map((t) => t.replace(/^- /, "").trim())
          .filter(Boolean) ?? []
      );
    }, [ai?.tipsBM]);

    // 2️⃣ Fallback titles
    const fallbackTitles = useMemo(
      () => [
        "Check local flood alerts",
        "Charge emergency devices",
        "Prepare important documents",
        "Clear nearby drains",
      ],
      []
    );

    // 3️⃣ Minimum scored tasks
    const minTasks = 3;

    // ✅ 4️⃣ Build tasks list (ONLY ONE useMemo here)
    const combinedTasks = useMemo(() => {
      let tasks: string[] = [];

      if (parsedTasks.length >= minTasks) {
        tasks = parsedTasks.slice(0, 4);
      } else {
        tasks = [
          ...parsedTasks,
          ...fallbackTitles.slice(0, minTasks - parsedTasks.length),
        ];
      }

      return tasks.slice(0, 5);
    }, [parsedTasks, fallbackTitles]);

    // ✅ 5️⃣ Convert to checklist items
    const checklistItems = useMemo(() => {
      return combinedTasks.map((title) => ({
        title,
        detail: "AI-generated for your current risk level.",
      }));
    }, [combinedTasks]);

  // ✅ Gemini tip: use the next item (5th) if exists, else use first non-empty
  const geminiTip =
    (ai?.tipsBM?.filter((t) => typeof t === "string" && t.trim().length > 0)[4] ??
      ai?.tipsBM?.find((t) => typeof t === "string" && t.trim().length > 0) ??
      "No Gemini tips available yet. Tap refresh on Home to fetch the latest guidance.") as string;

    // after minTasks + checklistItems is built
      const [checked, setChecked] = useState<Record<string, boolean>>(() =>
        Object.fromEntries(checklistItems.map((i) => [i.title, false])) //unchecked by default
      );

      useEffect(() => {
      setChecked(
        Object.fromEntries(
          checklistItems.map((i) => [i.title, false])
        )
      );
    }, [checklistItems]);

      const scoredTitles = useMemo(
        () => checklistItems.slice(0, minTasks).map((i) => i.title),
        [checklistItems, minTasks]
      );

      const completedCount = useMemo(() => {
        return scoredTitles.filter((title) => checked[title]).length;
      }, [checked, scoredTitles]);

      const scorePct = useMemo(() => {
        if (minTasks <= 0) return 0;
        return (completedCount / minTasks) * 100;
      }, [completedCount, minTasks]);

      const scoreText = `${scorePct.toFixed(0)}%`; // or toFixed(2) if you want 66.67%

    

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
                <input
                      type="checkbox"
                      className="custom-checkbox mt-0.5"
                      checked={!!checked[item.title]}
                      onChange={(e) =>
                        setChecked((prev) => ({ ...prev, [item.title]: e.target.checked }))
                      }
                    />

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
              onClick={() => onSubmit(scorePct)}
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