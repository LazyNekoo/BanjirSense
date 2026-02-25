import { useState } from "react";
import {
  Bell,
  Brain,
  Droplets,
  Home,
  Map,
  Megaphone,
  ShieldCheck,
  User,
} from "lucide-react";

import { useNavigation } from "../../lib/navigation";
import ShelterMap from "../maps/ShelterMap";
import type { AiRisk, JpsNearbyStation } from "../../types/banjirsense";
import HomeRiskMap from "../maps/HomeRiskMap";

interface HomeScreenProps {
  onViewDetailedAnalysis: () => void;
  onViewRoutineChecklist: () => void;
  onOpenNotifications: () => void;
  onOpenProfile?: () => void;
  onOpenSOS?: () => void;
  onNavigate?: (screen: string) => void;
  onOpenMap?: () => void;
  onOpenUpdates?: () => void;
  userLoc?: { lat: number; lng: number } | null;
  ai?: AiRisk | null;
  jps?: JpsNearbyStation | null;
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;

}


export function HomeScreen({
  onViewDetailedAnalysis,
  onViewRoutineChecklist,
  onOpenNotifications,
  onOpenProfile,
  onOpenSOS,
  onNavigate,
  onOpenMap,
  userLoc,
  ai,
  jps,
  isLoading,
  error,
  onRefresh,

}: HomeScreenProps) {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const navigation = useNavigation();

  const openMap = () => {
    if (onOpenMap) {
      onOpenMap();
      return;
    }
    if (onNavigate) {
      onNavigate("map");
      return;
    }
    if (navigation) {
      navigation.navigate("map");
      return;
    }
    setIsMapOpen(true);
  };

  //For Ai flood risk detection
    const riskLevel = ai?.riskLevel ?? "LOW";

  const riskTitle =
    riskLevel === "HIGH"
      ? "High Flood Risk Detected"
      : riskLevel === "MEDIUM"
        ? "Moderate Flood Risk Detected"
        : "Low Flood Risk Detected";

  const riskDesc =
    ai?.summary ??
    (riskLevel === "HIGH"
      ? "Immediate flood threat is possible. Stay alert and prepare to move."
      : riskLevel === "MEDIUM"
        ? "Some risk detected. Monitor conditions and be prepared."
        : "No immediate threat. Conditions are currently stable and safe.");


  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-4 font-display text-dark-navy">
      <div className="w-[400px] max-w-[400px] h-[824px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-slate-200">
        <header className="flex-none px-6 pt-8 pb-4 bg-white/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Droplets size={20} />
            </div>
            <h1 className="font-black text-lg tracking-tight text-slate-900">BanjirSense</h1>
          </div>
          <button
            type="button"
            onClick={onOpenNotifications}
            className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-primary border border-slate-100"
          >
            <Bell size={18} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar pb-28">
          <section className="relative w-full h-[65%] bg-slate-100 overflow-hidden">
            <HomeRiskMap userLoc={userLoc} />

           
            {/* keep your AI Risk pill */}
            <div className="absolute top-4 left-4 right-4 flex justify-center pointer-events-none">
              <div className="pointer-events-auto bg-white/95 backdrop-blur px-4 py-2 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-black text-primary uppercase tracking-widest">
                  {isLoading
                    ? "Loading live risk..."
                    : ai
                      ? `AI Risk • ${ai.riskLevel}`
                      : "AI Risk • Unavailable"}
                </span>
              </div>
            </div>
          </section>
          

          <section className="px-5 -mt-16 relative z-10">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-50 shadow-slate-900/5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                  <h2 className="text-2xl font-black text-primary leading-tight">
                      {riskTitle}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1 font-medium">
                      {riskDesc}
                    </p>
                  <section className="px-5 mt-4">
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                          Official JPS Station Nearby
                        </p>
                        {onRefresh && (
                          <button
                            onClick={onRefresh}
                            className="text-[11px] font-bold text-primary hover:underline"
                          >
                            Refresh
                          </button>
                        )}
                      </div>

                      {error && (
                        <p className="text-xs text-red-600 font-semibold">
                          {error}
                        </p>
                      )}

                      {!jps ? (
                        <p className="text-sm text-slate-500">
                          {isLoading ? "Finding nearest station..." : "No station data available."}
                        </p>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-sm font-bold text-slate-900">
                            {jps.stationName || jps.name || "Unnamed Station"}
                          </p>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className="px-2 py-1 rounded-full bg-slate-50 border border-slate-100 font-semibold">
                              Status: {jps.status ?? "N/A"}
                            </span>
                            <span className="px-2 py-1 rounded-full bg-slate-50 border border-slate-100 font-semibold">
                              Water: {jps.waterLevelM ?? "N/A"}
                            </span>
                            <span className="px-2 py-1 rounded-full bg-slate-50 border border-slate-100 font-semibold">
                                Rain 1h: {jps.rainfall?.last1hMm ?? "N/A"}
                              </span>
                              <span className="px-2 py-1 rounded-full bg-slate-50 border border-slate-100 font-semibold">
                                Rain Today: {jps.rainfall?.todayMm ?? "N/A"}
                              </span>
                            {typeof jps.distanceKm === "number" && (
                              <span className="px-2 py-1 rounded-full bg-slate-50 border border-slate-100 font-semibold">
                                {jps.distanceKm.toFixed(1)} km
                              </span>
                            )}
                          </div>
                          {jps.updatedAt && (
                            <p className="text-[11px] text-slate-400">
                              Updated: {jps.updatedAt}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={onViewDetailedAnalysis}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-primary text-primary rounded-xl font-bold text-sm hover:bg-primary/5 transition-colors"
                >
                  <Brain size={18} />
                  View Detailed Analysis
                </button>
                <div className="flex items-center gap-2 bg-slate-50 w-fit px-3 py-1.5 rounded-full border border-slate-100">
                  <Brain size={16} className="text-primary" />
                  <span className="text-[10px] uppercase tracking-wider font-bold text-primary">
                    Powered by AI Analytics
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="px-5 mt-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-primary">
                  <ShieldCheck size={18} />
                </div>
                <h3 className="font-black text-lg text-slate-900">AI Safety Awareness</h3>
              </div>
              <span className="text-[10px] font-bold text-primary bg-blue-50 px-2 py-1 rounded-md">
                INTELLIGENCE
              </span>
            </div>
            <button
              onClick={onViewRoutineChecklist}
              className="w-full mt-6 py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors"
            >
              View Routine Safety Checklist
            </button>
          </section>

          <section className="px-5 mt-10 mb-6">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center gap-2 text-trust-green">
                <ShieldCheck size={18} />
                <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">
                  Secure Government-Linked Encryption
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-white">
                  <Droplets size={16} />
                </div>
                <span className="font-black text-sm tracking-tight text-dark-navy">
                  BanjirSense
                </span>
              </div>
            </div>
          </section>
        </main>

        {isMapOpen && (
          <div className="fixed inset-0 z-[9999] bg-slate-100 flex items-center justify-center p-0 md:p-4">
            <div className="relative w-full max-w-[400px] h-screen md:h-[824px] md:rounded-[3rem] overflow-hidden shadow-2xl border border-slate-200">
              <ShelterMap
                  userLoc={userLoc ?? undefined} 
                  onNavigate={(screen) => {
                    if (screen === "home") {
                      setIsMapOpen(false);
                      return;
                    }
                    navigation?.navigate(screen);
                  }}
                />
            </div>
          </div>
        )}

        <nav className="flex-none bg-white border-t border-slate-100 px-6 py-4 grid grid-cols-5 items-end z-30">
          <button className="flex flex-col items-center gap-1 text-primary">
            <Home size={20} />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button onClick={openMap} className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
            <Map size={20} />
            <span className="text-[10px] font-medium">Map</span>
          </button>
          <div className="flex flex-col items-center gap-1 -mt-10">
            <button
              type="button"
              onClick={() => {
                if (onOpenSOS) {
                  onOpenSOS();
                }
              }}
              className="w-20 h-20 bg-primary rounded-full shadow-2xl shadow-blue-900/40 flex items-center justify-center text-white ring-[6px] ring-white active:scale-95 transition-transform"
            >
              <span className="text-2xl font-black tracking-tighter">SOS</span>
            </button>
          </div>
          <button
            onClick={() => {
              if (onNavigate) {
                onNavigate("updates");
                return;
              }
              if (navigation) {
                navigation.navigate("updates");
              }
            }}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
          >
            <Megaphone size={20} />
            <span className="text-[10px] font-medium">Updates</span>
          </button>
          <button
            onClick={() => {
              if (onOpenProfile) {
                onOpenProfile();
                return;
              }
              if (navigation) {
                navigation.navigate("profile");
              }
            }}
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
