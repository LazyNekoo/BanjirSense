import { ArrowLeft, CheckCircle, MapPin, Home, Map, Megaphone, User, Sparkles, Info } from "lucide-react";

export interface ReportDetailsData {
  id?: string;
  imageUrl?: string | null;
  title: string;
  category: string;
  timestamp: string;
  location: string;
  gps?: string;
  aiAnalysis: string;
  confidenceScore?: number;
  floodDepthEstimate?: string;
  isVerified?: boolean;
}

interface ReportDetailsProps {
  report: ReportDetailsData;
  onBack?: () => void;
  onNavigate?: (screen: string) => void;
  onOpenSOS?: () => void;
}

const FLOOD_LEVEL_COLORS: Record<string, string> = {
  "Flood Level - High": "bg-red-500",
  "Flood Level - Medium": "bg-orange-400",
  "Flood Level - Low": "bg-yellow-400",
  "Blocked Road": "bg-orange-500",
  "Fallen Tree": "bg-amber-500",
  "Infrastructure Damage": "bg-red-600",
  Landslide: "bg-red-700",
};

export function ReportDetails({
  report,
  onBack,
  onNavigate,
  onOpenSOS,
}: ReportDetailsProps) {
  const dotColor = FLOOD_LEVEL_COLORS[report.category] ?? "bg-red-500";
  const confidence = report.confidenceScore ?? 94;
  const depth = report.floodDepthEstimate ?? "approx. 0.5m";

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-4 font-display">
    <div className="w-[400px] h-[824px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-slate-200">
      {/* Header */}
      <header className="pt-12 pb-4 px-6 flex items-center bg-white flex-none z-10 shadow-sm">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-800" />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg text-slate-900 pr-10">Report Details</h1>
      </header>

      {/* Status Bar */}
      <div className="bg-green-50 py-2 px-6 flex items-center justify-center gap-2 border-y border-green-100 flex-none">
        <span className="text-green-500 text-[10px] leading-none">●</span>
        <span className="text-green-600 font-bold text-xs uppercase tracking-wider">Status: Live &amp; Verified</span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-32" style={{ scrollbarWidth: "none" }}>
        <div className="p-4 space-y-4">
          {/* Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-sm aspect-video bg-slate-200">
            {report.imageUrl ? (
              <img
                src={report.imageUrl}
                alt="Report evidence"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100">
                <MapPin size={40} className="text-slate-300" />
              </div>
            )}
            {/* AI Verified Badge */}
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <CheckCircle size={14} className="text-green-500" />
              <span className="text-[10px] font-bold text-slate-800">Vision API Verified</span>
            </div>
          </div>

          {/* AI Verification Analysis */}
          <div className="bg-blue-50/50 rounded-3xl p-5 border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-[#1e3a8a]" />
              <h3 className="font-bold text-[#1e3a8a] text-sm uppercase tracking-wide">AI Verification Analysis</h3>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed mb-4">{report.aiAnalysis}</p>

            {/* Confidence & Depth row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl p-3 border border-blue-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Confidence Score</p>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-black text-[#1e3a8a]">{confidence}%</span>
                </div>
                {/* Mini bar */}
                <div className="mt-1.5 h-1 bg-blue-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1e3a8a] rounded-full" style={{ width: `${confidence}%` }} />
                </div>
              </div>
              <div className="bg-white rounded-2xl p-3 border border-blue-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Flood Depth Est.</p>
                <span className="text-lg font-black text-[#1e3a8a]">{depth}</span>
                <p className="text-[9px] text-slate-400 mt-0.5">via Vision API</p>
              </div>
            </div>
          </div>

          {/* Report Metadata */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Title</label>
              <p className="font-bold text-slate-900 text-lg">{report.title}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</label>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor}`} />
                  <p className="font-bold text-slate-900 text-sm">{report.category}</p>
                </div>
              </div>
              <div className="space-y-1 text-right">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timestamp</label>
                <p className="text-xs font-medium text-slate-600">{report.timestamp}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50 space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</label>
              <div className="flex items-start gap-2">
                <MapPin size={18} className="text-[#1e3a8a] mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">{report.location}</p>
                  {report.gps && (
                    <p className="text-xs text-slate-500 font-mono">{report.gps}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Info footer */}
          <div className="px-3 py-4 flex items-center gap-3 bg-slate-50 rounded-3xl">
            <Info size={16} className="text-slate-400 shrink-0" />
            <p className="text-xs text-slate-500 leading-tight">
              This report has been verified by Vision AI and cross-referenced with JPS sensor data. It is now visible to NADMA coordinators.
            </p>
          </div>
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
