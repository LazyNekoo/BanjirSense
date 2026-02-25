import { useState } from "react";
import { Home, Map, Megaphone, User, Plus, CheckCircle, Sparkles, MapPin, ThumbsUp, MessageCircle, Newspaper, Layers } from "lucide-react";

interface UpdatesHubProps {
  onNavigate?: (screen: string) => void;
  onOpenSOS?: () => void;
  onAddReport?: () => void;
  onViewReport?: (reportId: string) => void;
}

const officialFeed = [
  {
    id: "off-1",
    source: "Official Bulletin • NADMA",
    time: "15 MINUTES AGO",
    type: "alert",
    levelLabel: "ALERT",
    levelColor: "text-red-500 bg-red-50",
    aiSummary:
      "Heavy rainfall warning issued for Shah Alam district. Water levels at Sungai Rasau are approaching danger marks. Residents in low-lying areas of Taman Sri Muda are advised to prepare for possible evacuation.",
  },
  {
    id: "off-2",
    source: "News Update • Bernama",
    time: "45 MINUTES AGO",
    type: "news",
    title: "River levels in Klang Valley reach alert marks",
    levelLabel: "OFFICIAL SOURCE",
    levelColor: "text-primary bg-blue-50",
    aiSummary:
      "Data from the Department of Irrigation and Drainage shows multiple river stations in Klang Valley exceeded alert levels following continuous rain. Authorities are monitoring the situation closely.",
  },
  {
    id: "off-3",
    source: "Flash Alert • BOMBA",
    time: "1 HOUR AGO",
    type: "alert",
    levelLabel: "WARNING",
    levelColor: "text-orange-600 bg-orange-50",
    aiSummary:
      "BOMBA units have been deployed to assist residents in flood-prone zones near Kuala Lumpur. Road closures reported on Jalan Kebun and surrounding streets.",
  },
];

const communityFeed = [
  {
    id: "com-1",
    authorInitials: "AS",
    authorName: "Ahmad S.",
    authorBg: "bg-slate-100 text-slate-700",
    time: "8 MINUTES AGO",
    badge: { label: "Vision API Verified", color: "bg-green-50 text-green-700 border-green-100" },
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC85CVoPbJehQfRzxeIuVo_z__FaCP6mLIaRl5iC-Cqn7UaoP_sfJ9_XKlwcvPxPuqX91VXyP1qMi9F8S354bWJzODxIZGiKCdBloKo_GRc-FZT33WxHayFZsEF4u3-fQTrl5kX8KxfCca7PLk4zLsHwJh-NQTQeIPyol1ozif1eqg7Cnt56yD9rY38kq3nyYW3CU0epv6JCWR9VkylEjmsFprMeVICwrHZWo9koyC9qurQr_6kLquW21yNjTQ049RKnD511HEwzQwk",
    aiSummary: "Image analysis confirms high water levels (approx. 0.5m) reaching residential gates. Situation matches local sensor data for rising flood risk.",
    likes: 12,
    comments: 4,
  },
  {
    id: "com-2",
    authorInitials: "SH",
    authorName: "Siti H.",
    authorBg: "bg-pink-50 text-pink-700",
    time: "22 MINUTES AGO",
    badge: { label: "AI Verified", color: "bg-blue-50 text-blue-700 border-blue-100" },
    image: null,
    aiSummary: "Road flooding of approximately 0.3m depth reported near Taman Bahagia. Consistent with upstream sensor readings showing elevated flow rates.",
    likes: 8,
    comments: 2,
  },
  {
    id: "com-3",
    authorInitials: "RK",
    authorName: "Raj K.",
    authorBg: "bg-amber-50 text-amber-700",
    time: "35 MINUTES AGO",
    badge: { label: "Vision API Verified", color: "bg-green-50 text-green-700 border-green-100" },
    image: null,
    aiSummary: "Fallen tree blocking main road at Jalan Kenanga confirmed via image metadata. No flood water visible but access is obstructed.",
    likes: 5,
    comments: 1,
  },
];

export function UpdatesHub({
  onNavigate,
  onOpenSOS,
  onAddReport,
  onViewReport,
}: UpdatesHubProps) {
  const [activeTab, setActiveTab] = useState<"official" | "community">("official");

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-4 font-display">
    <div className="w-[400px] h-[824px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-slate-200">
      {/* Header */}
      <header className="pt-12 px-6 pb-4 bg-white flex-none">
        <h1 className="text-lg font-black tracking-tight text-slate-900">Live Updates</h1>
        <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
          <MapPin size={13} className="shrink-0" />
          Taman Sri Muda, Shah Alam
        </p>
      </header>

      {/* Tab Switcher */}
      <div className="px-6 mb-4 flex-none">
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab("official")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "official"
                ? "bg-[#1e3a8a] text-white shadow-sm"
                : "text-slate-500 hover:text-[#1e3a8a]"
            }`}
          >
            Official (NADMA/BOMBA)
          </button>
          <button
            onClick={() => setActiveTab("community")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "community"
                ? "bg-[#1e3a8a] text-white shadow-sm"
                : "text-slate-500 hover:text-[#1e3a8a]"
            }`}
          >
            Community Reports
          </button>
        </div>
      </div>

      {/* Scrollable Feed */}
      <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-36" style={{ scrollbarWidth: "none" }}>
        {activeTab === "official" &&
          officialFeed.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-blue-100 rounded-3xl p-5 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50 pointer-events-none" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-[#1e3a8a] shrink-0">
                  {item.type === "news" ? (
                    <Newspaper size={18} />
                  ) : (
                    <Megaphone size={18} />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{item.source}</h3>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{item.time}</p>
                </div>
              </div>
              {item.title && (
                <h4 className="text-base font-bold text-slate-800 mb-3 leading-snug">{item.title}</h4>
              )}
              <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-[#1e3a8a]" />
                  <span className="text-[10px] font-bold text-[#1e3a8a] uppercase tracking-wider">AI Summary</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">{item.aiSummary}</p>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide ${item.levelColor}`}>
                  {item.type === "alert" ? "LEVEL: " : ""}{item.levelLabel}
                </span>
                <button className="text-xs font-bold text-[#1e3a8a] flex items-center gap-1 hover:underline">
                  Read Full Report
                  <Layers size={12} />
                </button>
              </div>
            </div>
          ))}

        {activeTab === "community" &&
          communityFeed.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border ${item.authorBg}`}>
                    {item.authorInitials}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{item.authorName}</h3>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{item.time}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[9px] font-bold uppercase tracking-tight ${item.badge.color}`}>
                  <CheckCircle size={11} />
                  {item.badge.label}
                </div>
              </div>
              {item.image && (
                <div className="w-full h-48 rounded-2xl overflow-hidden mb-4">
                  <img
                    src={item.image}
                    alt="Flood report"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-[#1e3a8a]" />
                  <span className="text-[10px] font-bold text-[#1e3a8a] uppercase tracking-wider">AI Summary</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">{item.aiSummary}</p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors">
                    <ThumbsUp size={14} />
                    <span className="text-[11px] font-bold">{item.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors">
                    <MessageCircle size={14} />
                    <span className="text-[11px] font-bold">{item.comments}</span>
                  </button>
                </div>
                <button
                  onClick={() => onViewReport?.(item.id)}
                  className="text-xs font-bold text-[#1e3a8a] flex items-center gap-1 hover:underline"
                >
                  View Location
                  <MapPin size={11} />
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* FAB - Add Report */}
      <button
        onClick={onAddReport}
        className="absolute bottom-28 right-6 px-5 h-12 bg-[#1e3a8a] text-white rounded-full shadow-xl flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 z-40"
      >
        <Plus size={18} />
        <span className="text-sm font-bold tracking-wide">Add Report</span>
      </button>

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
