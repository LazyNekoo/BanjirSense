import {
  Bell,
  Brain,
  CloudRain,
  Droplet,
  Droplets,
  Home,
  Map,
  Megaphone,
  Package,
  ShieldCheck,
  User,
} from "lucide-react";

interface HomeScreenProps {
  onViewDetailedAnalysis: () => void;
  onViewRoutineChecklist: () => void;
  onOpenNotifications: () => void;
}

export function HomeScreen({
  onViewDetailedAnalysis,
  onViewRoutineChecklist,
  onOpenNotifications,
}: HomeScreenProps) {
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
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiT2BRHWVAkT2997eMVBBylQVOm92MZ5qCf06rhsB7RT6DeXEaQ-HLF23r3vhWRASaM8y0HKH602UwKUPQI04WxSqRQBWIohcdnvau4TE3lGo8xRJjAZYj0BZQpVSMdpf1s1QNyjUent5KPiteoUQo-yiNayMaITkGxHTiRre0zsLXjOyI4mkXJEfGOt1lSxoU5zN96-3jDUN5RSsC-BJGADE4M5t_T4wzzkx_qO5wfzsoAfpoadMUyvsa9smAUUFSMBp9lVi5LY3L"
              alt="Map view"
              className="w-full h-full object-cover grayscale-[0.4]"
            />
            <div className="absolute inset-0 map-overlay-polygon bg-primary/20 border-2 border-primary/40" />
            <div className="absolute top-4 left-4 right-4 flex justify-center">
              <div className="bg-white/95 backdrop-blur px-4 py-2 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-black text-primary uppercase tracking-widest">
                  Safe Zone • Low Risk
                </span>
              </div>
            </div>
          </section>

          <section className="px-5 -mt-16 relative z-10">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-50 shadow-slate-900/5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                  <h2 className="text-2xl font-black text-primary leading-tight">
                    Low Flood Risk Detected
                  </h2>
                  <p className="text-sm text-slate-500 mt-1 font-medium">
                    No immediate threat. Conditions are currently stable and safe.
                  </p>
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
            <div className="space-y-4">
              <div className="bg-white border border-slate-100 p-4 rounded-2xl flex gap-4 hover:border-blue-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex-shrink-0 flex items-center justify-center text-primary border border-slate-100">
                  <CloudRain size={18} />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-slate-900">
                    Monitor daily weather reports.
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Stay updated with local forecasts to remain proactive.
                  </p>
                </div>
              </div>
              <div className="bg-white border border-slate-100 p-4 rounded-2xl flex gap-4 hover:border-blue-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex-shrink-0 flex items-center justify-center text-primary border border-slate-100">
                  <Droplet size={18} />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-slate-900">
                    Maintain home drainage systems.
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Clear gutters and drains while weather is clear.
                  </p>
                </div>
              </div>
              <div className="bg-white border border-slate-100 p-4 rounded-2xl flex gap-4 hover:border-blue-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex-shrink-0 flex items-center justify-center text-primary border border-slate-100">
                  <Package size={18} />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-slate-900">
                    Review emergency supply lists.
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Ensure your safety kit is stocked and ready.
                  </p>
                </div>
              </div>
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

        <nav className="flex-none bg-white border-t border-slate-100 px-6 py-4 grid grid-cols-5 items-end z-30">
          <button className="flex flex-col items-center gap-1 text-primary">
            <Home size={20} />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
            <Map size={20} />
            <span className="text-[10px] font-medium">Map</span>
          </button>
          <div className="flex flex-col items-center gap-1 -mt-10">
            <button className="w-20 h-20 bg-primary rounded-full shadow-2xl shadow-blue-900/40 flex items-center justify-center text-white ring-[6px] ring-white active:scale-95 transition-transform">
              <span className="text-2xl font-black tracking-tighter">SOS</span>
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
  );
}
