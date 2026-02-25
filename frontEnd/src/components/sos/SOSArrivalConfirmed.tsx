import { useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Home,
  Map,
  MapPin,
  Megaphone,
  Stethoscope,
  Share2,
  UtensilsCrossed,
  User,
} from "lucide-react";

interface SOSArrivalConfirmedProps {
  onReturnHome?: () => void;
  onNavigate?: (screen: string) => void;
  shelterName?: string;
  shelterNumber?: string;
  checkinTime?: string;
}

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none transition-transform active:scale-90"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill={(hovered || value) >= star ? "#facc15" : "none"}
            stroke={(hovered || value) >= star ? "#facc15" : "#cbd5e1"}
            strokeWidth="1.8"
          >
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export function SOSArrivalConfirmed({
  onReturnHome,
  onNavigate,
  shelterName = "Sri Muda Hall (Shelter #14)",
  checkinTime = "12:55 PM",
}: SOSArrivalConfirmedProps) {
  const [alertRating, setAlertRating] = useState(4);
  const [rescueRating, setRescueRating] = useState(5);
  const [hazardNote, setHazardNote] = useState("");

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-4 font-display">
      <div className="w-full max-w-[400px] h-[824px] bg-[#f8fafc] rounded-none md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-white">

        {/* Top green gradient */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-green-50/70 to-transparent pointer-events-none z-0" />

        {/* ── Header ─────────────────────────────────────────── */}
        <header className="flex-none px-6 pt-12 pb-5 flex flex-col items-center text-center relative z-10">
          {/* Glowing checkmark */}
          <div className="relative mb-5">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-green-200/60 bg-green-50"
              style={{ boxShadow: "0 0 40px 12px rgba(34,197,94,0.18)" }}
            >
              <CheckCircle2 size={48} className="text-green-500" strokeWidth={1.8} />
            </div>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-tight">
            Arrival Confirmed.
          </h1>
          <p className="text-green-500 font-bold text-lg mt-0.5">You are Safe.</p>

          {/* Location card */}
          <div className="mt-5 w-full bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex-none flex items-center justify-center">
              <MapPin size={18} className="text-blue-600" />
            </div>
            <div className="text-left min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                Location
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate">{shelterName}</p>
              <p className="text-[10px] text-slate-400 font-medium">
                Checked-in: {checkinTime}
              </p>
            </div>
          </div>
        </header>

        {/* ── Scrollable Body ────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto px-6 space-y-4 pb-6 relative z-10">

          {/* Feedback section */}
          <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4 tracking-tight">
              Help Us Improve Future Rescues
            </h3>

            <div className="space-y-4">
              {/* Alert Accuracy */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Alert Accuracy</span>
                <StarRating value={alertRating} onChange={setAlertRating} />
              </div>

              {/* Rescue Experience */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Rescue Experience</span>
                <StarRating value={rescueRating} onChange={setRescueRating} />
              </div>

              {/* Unreported hazards */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">
                  Unreported Hazards
                </label>
                <textarea
                  rows={2}
                  value={hazardNote}
                  onChange={(e) => setHazardNote(e.target.value)}
                  placeholder="Tell us about blocked paths..."
                  className="w-full text-sm rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 text-slate-700 placeholder:text-slate-400 font-display transition-all"
                />
              </div>
            </div>
          </section>

          {/* Resource quick-links */}
          <div className="space-y-3">
            {/* Medical Post */}
            <button
              type="button"
              onClick={() => onNavigate?.("medicalPost")}
              className="w-full bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center justify-between hover:bg-slate-50 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-2xl flex-none flex items-center justify-center">
                  <Stethoscope size={18} className="text-red-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800">Medical Post</p>
                  <p className="text-xs text-slate-500">First-aid &amp; support</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300 flex-none" />
            </button>

            {/* Family Status */}
            <button
              type="button"
              onClick={() => onNavigate?.("familyStatus")}
              className="w-full bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center justify-between hover:bg-slate-50 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-2xl flex-none flex items-center justify-center">
                  <Share2 size={18} className="text-green-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800">Family Status</p>
                  <p className="text-xs text-slate-500">Share safety via WhatsApp</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300 flex-none" />
            </button>

            {/* Meal Schedule */}
            <button
              type="button"
              onClick={() => onNavigate?.("mealSchedule")}
              className="w-full bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center justify-between hover:bg-slate-50 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-2xl flex-none flex items-center justify-center">
                  <UtensilsCrossed size={18} className="text-orange-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800">Meal Schedule</p>
                  <p className="text-xs text-slate-500">Next distribution at 6:00 PM</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300 flex-none" />
            </button>
          </div>

          {/* Primary CTA */}
          <button
            type="button"
            onClick={onReturnHome}
            className="w-full bg-primary text-white font-bold py-4 rounded-3xl shadow-lg shadow-blue-900/20 hover:bg-blue-800 active:scale-[0.98] transition-all mt-2"
          >
            Return to Home
          </button>
        </main>

        {/* ── Bottom Navbar ──────────────────────────────────── */}
        <nav className="flex-none bg-white border-t border-slate-100 px-6 py-4 grid grid-cols-5 items-end z-30">
          <button
            onClick={onReturnHome}
            className="flex flex-col items-center gap-1 text-primary"
          >
            <Home size={20} />
            <span className="text-[10px] font-bold">Home</span>
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
              type="button"
              className="w-20 h-20 bg-primary rounded-full shadow-2xl shadow-blue-900/40 flex items-center justify-center text-white ring-[6px] ring-white active:scale-95 transition-transform"
              onClick={() => onNavigate?.("sos")}
            >
              <span className="text-2xl font-black tracking-tighter">SOS</span>
            </button>
          </div>

          <button
            onClick={() => onNavigate?.("updates")}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
          >
            <Megaphone size={20} />
            <span className="text-[10px] font-medium">Updates</span>
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
