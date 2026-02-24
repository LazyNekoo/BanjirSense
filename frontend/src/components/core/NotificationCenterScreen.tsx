import { Droplets, Home, Map, Megaphone, User } from "lucide-react";

interface NotificationCenterScreenProps {
  onBack: () => void;
  onNavigate?: (screen: string) => void;
}

const urgentAlerts = [
  {
    id: "water-level",
    icon: "warning",
    title: "Water Level Alert: +0.5m in Klang",
    time: "2m ago",
    unread: true,
  },
  {
    id: "evacuation-update",
    icon: "error",
    title: "Evacuation Route Update: Shah Alam Sector B",
    time: "15m ago",
    unread: true,
  },
];

const generalUpdates = [
  {
    id: "safety-checklist",
    icon: "task_alt",
    title: "Safety Checklist Completed",
    time: "1h ago",
    isRead: false,
  },
  {
    id: "forecast-update",
    icon: "info",
    title: "New Weather Forecast Available",
    time: "3h ago",
    isRead: false,
  },
  {
    id: "location-services",
    icon: "location_on",
    title: "Location Services Optimized",
    time: "5h ago",
    isRead: true,
  },
];

export function NotificationCenterScreen({ onBack, onNavigate }: NotificationCenterScreenProps) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-4 font-display text-dark-navy">
      <div className="w-[400px] max-w-[400px] h-[824px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-slate-200">
        <header className="flex-none px-6 pt-8 pb-4 bg-white/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Droplets size={20} />
            </div>
            <h1 className="font-black text-lg tracking-tight text-slate-900">Notifications</h1>
          </div>
          <button
            type="button"
            className="text-primary font-bold text-sm hover:text-blue-900 transition-colors"
          >
            Mark all as read
          </button>
        </header>

        <div className="flex-1 bg-off-white rounded-t-[2.5rem] shadow-[0_-12px_30px_rgba(15,23,42,0.05)] overflow-hidden flex flex-col relative">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-2 shrink-0" />
          <main className="flex-1 overflow-y-auto no-scrollbar px-6 pb-32">
            <section className="mt-4">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-red-600/70 mb-3 px-1">
                Urgent Alerts
              </h2>
              <div className="space-y-3">
                {urgentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="bg-red-50 border border-red-100 p-4 rounded-3xl flex gap-4 relative"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                      <span className="material-symbols-outlined text-red-600 font-bold">
                        {alert.icon}
                      </span>
                    </div>
                    <div className="flex-1 pr-4">
                      <h3 className="font-bold text-sm text-slate-900 leading-tight">
                        {alert.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
                    </div>
                    {alert.unread && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 px-1">
                General Updates
              </h2>
              <div className="space-y-3">
                {generalUpdates.map((update) => (
                  <div
                    key={update.id}
                    className={`bg-white border border-slate-100 p-4 rounded-3xl flex gap-4 ${
                      update.isRead ? "opacity-70" : ""
                    }`}
                  >
                    <div className="w-10 h-10 rounded-2xl bg-soft-blue flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary font-bold">
                        {update.icon}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm text-slate-900 leading-tight">
                        {update.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">{update.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>

        <nav className="flex-none bg-white border-t border-slate-100 px-6 py-4 grid grid-cols-5 items-end z-30">
          <button
            type="button"
            onClick={onBack}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
          >
            <Home size={20} />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          <button onClick={() => onNavigate?.("map")} className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
            <Map size={20} />
            <span className="text-[10px] font-medium">Map</span>
          </button>
          <div className="flex flex-col items-center gap-1 -mt-10">
            <button className="w-20 h-20 bg-primary rounded-full shadow-2xl shadow-blue-900/40 flex items-center justify-center text-white ring-[6px] ring-white active:scale-95 transition-transform">
              <span className="text-2xl font-black tracking-tighter">SOS</span>
            </button>
          </div>
          <button className="flex flex-col items-center gap-1 text-primary">
            <Megaphone size={20} />
            <span className="text-[10px] font-bold">Updates</span>
          </button>
          <button onClick={() => onNavigate?.("profile")} className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
            <User size={20} />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
