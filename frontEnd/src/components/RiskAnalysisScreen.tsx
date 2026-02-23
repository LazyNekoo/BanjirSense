import { Brain, Droplets, Home, Map, Megaphone, ShieldCheck, Sun, User, X } from "lucide-react";

type AiRisk = {
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  hoursAhead?: number;
  riskScore?: number;
  summary?: string;
};

type JpsNearbyStation = {
  name?: string;
  stationName?: string;
  status?: string;
  waterLevel?: number | string | null;
  rainfall?: number | string | null;
  updatedAt?: string | null;
  distanceKm?: number;
};

interface RiskAnalysisScreenProps {
  onClose: () => void;
  ai?: AiRisk | null;
  jps?: JpsNearbyStation | null;
}

export function RiskAnalysisScreen({ onClose, ai, jps }: RiskAnalysisScreenProps){

    const waterLevel =
    typeof (jps as any)?.waterLevel === "number"
      ? (jps as any).waterLevel
      : typeof (jps as any)?.waterLevelM === "number"
        ? (jps as any).waterLevelM
        : typeof (jps as any)?.waterLevel === "string"
          ? Number((jps as any).waterLevel)
          : null;

    // Clamp to a reasonable visual scale (0–10m)
    const maxM = 10;
    const levelClamped = waterLevel == null || Number.isNaN(waterLevel) ? 0 : Math.max(0, Math.min(maxM, waterLevel));
    const levelPct = Math.round((levelClamped / maxM) * 100);

    // 5 bars fill based on percentage
    const totalBars = 5;
    const filledBars = Math.round((levelPct / 100) * totalBars);

    // Rainfall (if available)
    const rain1h =
      (jps as any)?.rainfall?.last1hMm ?? (jps as any)?.rainfall1hMm ?? null;
    const rainToday =
      (jps as any)?.rainfall?.todayMm ?? (jps as any)?.rainfallTodayMm ?? null;

    // AI score %
    const aiScorePct =
      typeof ai?.riskScore === "number" ? Math.round(ai.riskScore * 100) : null;

    const riskLevel = ai?.riskLevel ?? "LOW";

    // Use AI score if exists, else fallback from level
    const score =
      typeof ai?.riskScore === "number"
        ? ai.riskScore
        : riskLevel === "HIGH"
          ? 0.85
          : riskLevel === "MEDIUM"
            ? 0.55
            : 0.2;

    const soilPct = Math.max(0, Math.min(100, Math.round(score * 100)));
    const drainageUsed = Math.max(0, Math.min(100, Math.round(score * 100)));

    const waterLevelText =
      jps?.waterLevel != null && jps.waterLevel !== ""
        ? `${jps.waterLevel}${typeof jps.waterLevel === "number" ? "m" : ""}`
        : "N/A";

    const insightText =
      ai?.summary ??
      `AI indicates ${riskLevel} flood risk in the next ${ai?.hoursAhead ?? 6} hours based on nearby conditions.`;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-4 font-display text-dark-navy">
      <div className="w-[400px] max-w-[400px] h-[824px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-slate-200">
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiT2BRHWVAkT2997eMVBBylQVOm92MZ5qCf06rhsB7RT6DeXEaQ-HLF23r3vhWRASaM8y0HKH602UwKUPQI04WxSqRQBWIohcdnvau4TE3lGo8xRJjAZYj0BZQpVSMdpf1s1QNyjUent5KPiteoUQo-yiNayMaITkGxHTiRre0zsLXjOyI4mkXJEfGOt1lSxoU5zN96-3jDUN5RSsC-BJGADE4M5t_T4wzzkx_qO5wfzsoAfpoadMUyvsa9smAUUFSMBp9lVi5LY3L"
            alt="Map background"
            className="w-full h-full object-cover brightness-[0.9] contrast-[0.9]"
          />
          <div className="absolute inset-0 map-overlay-polygon bg-primary/10 border-2 border-primary/20" />
        </div>

        <header className="absolute top-0 left-0 right-0 z-20 px-6 pt-8 pb-4 flex justify-between items-center">
          <div className="bg-white/90 backdrop-blur-md p-2 px-4 rounded-2xl border border-slate-200/50 flex items-center gap-3 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <ShieldCheck size={16} />
            </div>
            <h1 className="font-black text-sm tracking-tight text-slate-800">
              {riskLevel === "HIGH" ? "High Risk Area" : riskLevel === "MEDIUM" ? "Moderate Risk Area" : "Low Risk Area"}
            </h1>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-600 border border-slate-200/50 shadow-sm"
            aria-label="Close risk analysis"
          >
            <X size={18} />
          </button>
        </header>

        <div className="absolute inset-x-0 bottom-0 top-32 bg-white rounded-t-[2.5rem] z-30 flex flex-col border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-2" />
          <main className="flex-1 overflow-y-auto no-scrollbar px-6 pb-40">
            <div className="flex items-center justify-between mt-4 mb-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Risk Analysis</h2>
                <p className="text-primary font-bold text-sm flex items-center gap-1.5 mt-1 uppercase tracking-tight">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                  </span>
                  {riskLevel === "HIGH"
                      ? "High Risk Detected"
                      : riskLevel === "MEDIUM"
                        ? "Moderate Risk"
                        : "Environment Stable"}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <Sun className="text-amber-400" size={28} />
                <span className="text-xs font-bold text-slate-400">Clear Skies</span>
              </div>
            </div>

            <section className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Water Level (JPS)
                    </span>

                    <span className="text-xs font-bold text-white bg-primary px-2 py-0.5 rounded">
                      {waterLevel == null ? "N/A" : `${waterLevel.toFixed(2)}m`}
                    </span>
                  </div>

                  {/* Dynamic bars */}
                  <div className="h-14 flex items-end gap-1">
                    {Array.from({ length: totalBars }).map((_, i) => {
                      const active = i < filledBars;

                      // Make heights slightly increasing for nice visual
                      const heights = ["h-3", "h-4", "h-6", "h-8", "h-10"];
                      const heightClass = heights[i] ?? "h-4";

                      return (
                        <div
                          key={i}
                          className={`w-full rounded-sm transition-all duration-300 ${heightClass} ${
                            active ? "bg-primary" : "bg-primary/20"
                          }`}
                          title={active ? "Filled" : "Empty"}
                        />
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[10px] text-slate-400 font-medium">
                      Scale: 0–{maxM}m
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold">
                      {levelPct}% of scale
                    </p>
                  </div>
                </div>
                <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Rainfall (JPS)
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-500">Last 1h</span>
                        <span className="text-slate-900">{rain1h == null ? "N/A" : `${rain1h} mm`}</span>
                      </div>
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-500">Today</span>
                        <span className="text-slate-900">{rainToday == null ? "N/A" : `${rainToday} mm`}</span>
                      </div>
                    </div>
                  </div>
              </div>
              <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      AI Risk Score
                    </span>
                    <span className="text-xs font-black text-primary">
                      {aiScorePct == null ? "N/A" : `${aiScorePct}%`}
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-300"
                      style={{ width: `${aiScorePct ?? 0}%` }}
                    />
                  </div>

                  <p className="text-[10px] text-slate-400 mt-2 font-medium">
                    Estimated flood probability (next 6h) based on live JPS data.<br></br>Higher % = higher risk.
                  </p>
                </div>
            </section>

            <section className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Brain size={18} className="text-primary" />
                </div>
                <h3 className="font-black text-lg text-slate-800 tracking-tight">AI Insights</h3>
              </div>
              <div className="bg-blue-50 border border-blue-100 p-5 rounded-3xl relative overflow-hidden">
                <p className="text-sm leading-relaxed text-slate-600 font-medium">
                <span className="text-primary font-bold">AI Analysis:</span> {insightText}
              </p>
              </div>
            </section>

            <section className="mt-10 mb-6">
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center justify-center gap-2 text-trust-green">
                  <ShieldCheck size={18} />
                  <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">
                    Secure Government-Linked Encryption
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-white">
                    <Droplets size={14} />
                  </div>
                  <span className="font-black text-sm tracking-tight text-dark-navy">BanjirSense</span>
                </div>
              </div>
            </section>
          </main>

          <nav className="flex-none bg-white border-t border-slate-100 px-6 py-4 grid grid-cols-5 items-end">
            <button className="flex flex-col items-center gap-1 text-primary">
              <Home size={20} />
              <span className="text-[10px] font-bold">Home</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
              <Map size={20} />
              <span className="text-[10px] font-medium">Map</span>
            </button>
            <div className="flex flex-col items-center gap-1 -mt-10">
              <button className="w-20 h-20 bg-primary rounded-full shadow-xl shadow-blue-200 flex items-center justify-center text-white ring-[6px] ring-white">
                <span className="text-2xl font-black tracking-tighter leading-none">SOS</span>
              </button>
            </div>
            <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
              <Megaphone size={20} />
              <span className="text-[10px] font-medium">Updates</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
              <User size={20} />
              <span className="text-[10px] font-medium">Profile</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
