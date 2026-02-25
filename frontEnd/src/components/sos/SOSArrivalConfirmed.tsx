import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock,
  Heart,
  Home,
  Map,
  MapPin,
  Megaphone,
  MessageCircle,
  Phone,
  Send,
  Share2,
  Stethoscope,
  User,
  UserCheck,
  UtensilsCrossed,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type SubScreen = "main" | "medicalPost" | "familyStatus" | "mealSchedule";
type LatLng = { lat: number; lng: number };

//User location
const toNum = (v: any) => {
  if (v === undefined || v === null || v === "") return null;
  const str = String(v).trim();
  const normalized =
    str.includes(",") && !str.includes(".")
      ? str.replace(",", ".")
      : str.replace(/,/g, "");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
};

const haversineKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  return R * (2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)));
};

type PpsLite = {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  victims: number;
  capacity?: number | null;
  occupancyPercentage: number;
};

interface SOSArrivalConfirmedProps {
  onReturnHome?: () => void;
  onNavigate?: (screen: string) => void;
  userLoc?: LatLng | null;
  shelterName?: string; // fallback
  checkinTime?: string;
}

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
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

// ─── Shared Navbar ────────────────────────────────────────────────────────────

function BottomNav({
  onHome,
  onNavigate,
}: {
  onHome: () => void;
  onNavigate?: (screen: string) => void;
}) {
  return (
    <nav className="flex-none bg-white border-t border-slate-100 px-6 py-4 grid grid-cols-5 items-end z-30">
      <button onClick={onHome} className="flex flex-col items-center gap-1 text-primary">
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
          onClick={() => onNavigate?.("sos")}
          className="w-20 h-20 bg-primary rounded-full shadow-2xl shadow-blue-900/40 flex items-center justify-center text-white ring-[6px] ring-white active:scale-95 transition-transform"
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
  );
}

// ─── Sub-screen: Medical Post ─────────────────────────────────────────────────

function MedicalPostScreen({
  onBack,
  onNavigate,
  shelterName,
}: {
  onBack: () => void;
  onNavigate?: (screen: string) => void;
  shelterName: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [need, setNeed] = useState("");

  const services = [
    {
      icon: <Heart size={16} className="text-red-500" />,
      bg: "bg-red-50",
      label: "First Aid & Wound Care",
      detail: "Bay 1 — open now",
    },
    {
      icon: <AlertCircle size={16} className="text-orange-500" />,
      bg: "bg-orange-50",
      label: "Medication Dispensary",
      detail: "Bay 2 — open now",
    },
    {
      icon: <UserCheck size={16} className="text-blue-500" />,
      bg: "bg-blue-50",
      label: "Triage Assessment",
      detail: "Queue: 3 ahead",
    },
    {
      icon: <Phone size={16} className="text-purple-500" />,
      bg: "bg-purple-50",
      label: "Mental Health Support",
      detail: "Bay 3 — available",
    },
  ];

  return (
    <>
      <header className="flex-none px-6 pt-12 pb-5 relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-5"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-semibold">Back</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-red-50 rounded-3xl flex items-center justify-center flex-none border border-red-100">
            <Stethoscope size={26} className="text-red-500" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 leading-tight">
              Medical Post
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{shelterName}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 space-y-4 pb-6 relative z-10">
        <div className="bg-green-50 border border-green-200 rounded-3xl p-4 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-none" />
          <div>
            <p className="text-sm font-bold text-green-800">Medical Post Open</p>
            <p className="text-xs text-green-600">Operating 24 hours · 6 medical staff on duty</p>
          </div>
        </div>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">
              Available Services
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {services.map((s) => (
              <div key={s.label} className="px-5 py-3.5 flex items-center gap-3">
                <div className={`w-8 h-8 ${s.bg} rounded-xl flex-none flex items-center justify-center`}>
                  {s.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">{s.label}</p>
                  <p className="text-xs text-slate-500">{s.detail}</p>
                </div>
                <ChevronRight size={16} className="text-slate-300 flex-none" />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-3 tracking-tight">
            Request Assistance
          </h3>
          {submitted ? (
            <div className="flex items-center gap-3 py-2">
              <CheckCircle2 size={20} className="text-green-500 flex-none" />
              <p className="text-sm font-semibold text-green-700">
                Request sent — medical staff notified.
              </p>
            </div>
          ) : (
            <>
              <textarea
                rows={2}
                value={need}
                onChange={(e) => setNeed(e.target.value)}
                placeholder="Describe your medical need or request medication refill..."
                className="w-full text-sm rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 text-slate-700 placeholder:text-slate-400 font-display transition-all mb-3"
              />
              <button
                type="button"
                onClick={() => {
                  if (need.trim()) setSubmitted(true);
                }}
                className="w-full bg-red-500 text-white text-sm font-bold py-3 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-40"
                disabled={!need.trim()}
              >
                <Send size={15} />
                Send Request
              </button>
            </>
          )}
        </section>

        <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-3 tracking-tight">
            Emergency Contacts
          </h3>
          <div className="space-y-3">
            {[
              { label: "Medical Post Hotline", number: "03-8888 0000" },
              { label: "Ambulance", number: "999" },
            ].map((c) => (
              <div key={c.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{c.label}</p>
                  <p className="text-xs text-slate-400">{c.number}</p>
                </div>
                <a
                  href={`tel:${c.number.replace(/\s/g, "")}`}
                  className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  <Phone size={16} />
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav onHome={onBack} onNavigate={onNavigate} />
    </>
  );
}

// ─── Sub-screen: Family Status ────────────────────────────────────────────────

function FamilyStatusScreen({
  onBack,
  onNavigate,
  shelterName,
}: {
  onBack: () => void;
  onNavigate?: (screen: string) => void;
  shelterName: string;
}) {
  const [sent, setSent] = useState(false);
  const [customMsg, setCustomMsg] = useState("");

  const contacts = [
    { name: "Ahmad Zafir (Father)", status: "Unknown", color: "text-slate-400", dot: "bg-slate-300" },
    { name: "Nurul Ain (Mother)", status: "Safe · Kampung Baru Shelter", color: "text-green-600", dot: "bg-green-500" },
    { name: "Haziq (Brother)", status: "Unknown", color: "text-slate-400", dot: "bg-slate-300" },
  ];

  const defaultMsg = `I am safe and have been evacuated to ${shelterName}. This message was sent via BanjirSense+.`;

  return (
    <>
      <header className="flex-none px-6 pt-12 pb-5 relative z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-5">
          <ArrowLeft size={18} />
          <span className="text-sm font-semibold">Back</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-green-50 rounded-3xl flex items-center justify-center flex-none border border-green-100">
            <Share2 size={26} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 leading-tight">Family Status</h1>
            <p className="text-xs text-slate-500 mt-0.5">Share your safety update</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 space-y-4 pb-6 relative z-10">
        <div className="bg-green-50 border border-green-200 rounded-3xl p-4 flex items-start gap-3">
          <CheckCircle2 size={20} className="text-green-500 flex-none mt-0.5" />
          <div>
            <p className="text-sm font-bold text-green-800">You are marked as Safe</p>
            <p className="text-xs text-green-600 mt-0.5">{shelterName} · Checked-in</p>
          </div>
        </div>

        <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-3 tracking-tight">Send Safety Update</h3>
          <p className="text-xs text-slate-500 mb-3">Customise your message or send the default.</p>
          <textarea
            rows={3}
            value={customMsg || defaultMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            className="w-full text-sm rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-400 text-slate-700 font-display transition-all mb-3"
          />
          {sent ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 size={16} />
              <span className="text-sm font-semibold">Message sent via WhatsApp!</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setSent(true)}
              className="w-full bg-[#25D366] text-white text-sm font-bold py-3 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <MessageCircle size={16} />
              Share via WhatsApp
            </button>
          )}
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">Family Contacts</h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">2 min ago</span>
          </div>
          <div className="divide-y divide-slate-100">
            {contacts.map((c) => (
              <div key={c.name} className="px-5 py-3.5 flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-none">
                  <User size={15} className="text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                    <p className={`text-xs font-medium ${c.color}`}>{c.status}</p>
                  </div>
                </div>
                <button type="button" className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
                  <Bell size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <button
          type="button"
          className="w-full bg-white border border-slate-200 text-slate-700 text-sm font-bold py-3.5 rounded-3xl flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-[0.98] transition-all shadow-sm"
        >
          <Bell size={16} className="text-primary" />
          Alert All Family Members
        </button>
      </main>

      <BottomNav onHome={onBack} onNavigate={onNavigate} />
    </>
  );
}

// ─── Sub-screen: Meal Schedule ────────────────────────────────────────────────

function MealScheduleScreen({
  onBack,
  onNavigate,
}: {
  onBack: () => void;
  onNavigate?: (screen: string) => void;
}) {
  const [dietaryFlag, setDietaryFlag] = useState(false);
  const [dietaryNote, setDietaryNote] = useState("");
  const [dietSubmitted, setDietSubmitted] = useState(false);

  const meals = [
    { time: "7:00 AM", label: "Breakfast", menu: "Nasi lemak, roti, teh tarik", done: true, next: false },
    { time: "12:30 PM", label: "Lunch", menu: "Rice, ayam masak merah, sayur", done: true, next: false },
    { time: "6:00 PM", label: "Dinner", menu: "Rice, ikan goreng, soup", done: false, next: true },
    { time: "9:00 PM", label: "Light Supper", menu: "Milo, Jacob's crackers", done: false, next: false },
  ];

  return (
    <>
      <header className="flex-none px-6 pt-12 pb-5 relative z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-5">
          <ArrowLeft size={18} />
          <span className="text-sm font-semibold">Back</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-50 rounded-3xl flex items-center justify-center flex-none border border-orange-100">
            <UtensilsCrossed size={26} className="text-orange-500" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 leading-tight">Meal Schedule</h1>
            <p className="text-xs text-slate-500 mt-0.5">Today · 25 Feb 2026</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 space-y-4 pb-6 relative z-10">
        <div className="bg-orange-50 border border-orange-200 rounded-3xl p-4 flex items-center gap-3">
          <Clock size={18} className="text-orange-500 flex-none" />
          <div>
            <p className="text-sm font-bold text-orange-800">Next distribution at 6:00 PM</p>
            <p className="text-xs text-orange-600">Distribution Point A · Ground Floor Hall</p>
          </div>
        </div>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">Today's Meals</h3>
          </div>
          <div className="px-5 pb-5 space-y-1">
            {meals.map((m, i) => (
              <div key={m.label} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full flex-none mt-1 ring-2 ${
                      m.done
                        ? "bg-green-400 ring-green-100"
                        : m.next
                        ? "bg-orange-400 ring-orange-100 animate-pulse"
                        : "bg-slate-200 ring-slate-100"
                    }`}
                  />
                  {i < meals.length - 1 && <div className="w-0.5 flex-1 bg-slate-100 mt-1 mb-1 min-h-[20px]" />}
                </div>
                <div className={`pb-4 flex-1 ${m.next ? "opacity-100" : m.done ? "opacity-60" : "opacity-80"}`}>
                  <div className="flex items-baseline justify-between">
                    <p className={`text-sm font-bold ${m.next ? "text-orange-600" : m.done ? "text-slate-500 line-through" : "text-slate-800"}`}>
                      {m.label}
                    </p>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        m.done
                          ? "bg-green-50 text-green-600"
                          : m.next
                          ? "bg-orange-50 text-orange-600"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {m.done ? "Done" : m.next ? "Next" : m.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{m.menu}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-3 tracking-tight">Distribution Points</h3>
          <div className="space-y-3">
            {[
              { point: "Point A", location: "Ground Floor Hall", capacity: "~200 pax" },
              { point: "Point B", location: "Level 2 Multipurpose Room", capacity: "~100 pax" },
            ].map((p) => (
              <div key={p.point} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-50 rounded-xl flex items-center justify-center flex-none">
                  <MapPin size={14} className="text-orange-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{p.point} — {p.location}</p>
                  <p className="text-xs text-slate-500">Capacity: {p.capacity}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">Dietary Requirements</h3>
            <button
              type="button"
              onClick={() => setDietaryFlag((f) => !f)}
              className={`w-11 h-6 rounded-full flex items-center transition-colors ${dietaryFlag ? "bg-primary" : "bg-slate-200"}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mx-0.5 ${dietaryFlag ? "translate-x-5" : ""}`} />
            </button>
          </div>
          {dietaryFlag ? (
            dietSubmitted ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 size={16} />
                <span className="text-sm font-semibold">Dietary need submitted to kitchen.</span>
              </div>
            ) : (
              <>
                <textarea
                  rows={2}
                  value={dietaryNote}
                  onChange={(e) => setDietaryNote(e.target.value)}
                  placeholder="e.g. diabetic, halal only, nut allergy..."
                  className="w-full text-sm rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 text-slate-700 placeholder:text-slate-400 font-display transition-all mb-3"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (dietaryNote.trim()) setDietSubmitted(true);
                  }}
                  disabled={!dietaryNote.trim()}
                  className="w-full bg-orange-500 text-white text-sm font-bold py-3 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-40"
                >
                  <Send size={15} />
                  Submit to Kitchen
                </button>
              </>
            )
          ) : (
            <p className="text-xs text-slate-500">Toggle on to notify kitchen staff of special dietary needs.</p>
          )}
        </section>
      </main>

      <BottomNav onHome={onBack} onNavigate={onNavigate} />
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SOSArrivalConfirmed({
  onReturnHome,
  onNavigate,
  userLoc,
  shelterName = "Sri Muda Hall (Shelter #14)",
  checkinTime = "12:55 PM",
}: SOSArrivalConfirmedProps) {
  const [subScreen, setSubScreen] = useState<SubScreen>("main");
  const [alertRating, setAlertRating] = useState(4);
  const [rescueRating, setRescueRating] = useState(5);
  const [hazardNote, setHazardNote] = useState("");
  const [nearestPps, setNearestPps] = useState<PpsLite | null>(null);
  const [loadingPps, setLoadingPps] = useState(false);

  // ✅ Fetch PPS list & pick nearest using userLoc
  useEffect(() => {
    let cancelled = false;

    const loadNearest = async () => {
      if (!userLoc) return;

      setLoadingPps(true);
      try {
        const base = (import.meta.env.VITE_API_BASE_URL as string) || "";
        const res = await fetch(`${base}/gov/jkm/pps`);
        const data = await res.json();

        const rawList = Array.isArray(data) ? data : (data.shelters ?? data.points ?? []);
        const cleaned: PpsLite[] = (rawList || [])
          .map((s: any) => {
            const latitude = toNum(s.latitude ?? s.lat);
            const longitude = toNum(s.longitude ?? s.lng);
            if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

            const victims = toNum(s.mangsa ?? s.victims) ?? 0;
            const capacity = toNum(s.kapasiti ?? s.capacity);

            const apiOcc = toNum(s.occupancyPercentage);
            const computedOcc = capacity && capacity > 0 ? (victims / capacity) * 100 : null;
            const occupancyPercentage = Math.max(0, Math.min(100, apiOcc ?? (computedOcc ?? 0)));

            return {
              id: String(s.id ?? `${s.name ?? "pps"}-${latitude}-${longitude}`),
              name: String(s.nama_pps ?? s.name ?? "PPS"),
              location: String([s.daerah, s.negeri].filter(Boolean).join(", ") || s.daerah || s.negeri || "Malaysia"),
              latitude: latitude!,
              longitude: longitude!,
              victims,
              capacity,
              occupancyPercentage,
            } as PpsLite;
          })
          .filter(Boolean) as PpsLite[];

        if (!cleaned.length) return;

        let best = cleaned[0];
        let bestD = Infinity;
        for (const s of cleaned) {
          const d = haversineKm(userLoc, { lat: s.latitude, lng: s.longitude });
          if (d < bestD) {
            bestD = d;
            best = s;
          }
        }

        if (!cancelled) setNearestPps(best);
      } catch (e) {
        console.warn("Nearest PPS load failed:", e);
      } finally {
        if (!cancelled) setLoadingPps(false);
      }
    };

    loadNearest();
    return () => {
      cancelled = true;
    };
  }, [userLoc]);

  // ✅ single source of truth for displayed shelter name
  const displayShelterName = nearestPps?.name ?? shelterName;
  const displayShelterLoc = nearestPps?.location ?? (loadingPps ? "Finding nearest shelter..." : "Malaysia");
  const displayDistanceKm =
    userLoc && nearestPps
      ? haversineKm(userLoc, { lat: nearestPps.latitude, lng: nearestPps.longitude }).toFixed(1)
      : null;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-4 font-display">
      <div className="w-full max-w-[400px] h-[824px] bg-[#f8fafc] rounded-none md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-white">
        {subScreen === "main" && (
          <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-green-50/70 to-transparent pointer-events-none z-0" />
        )}

        {subScreen === "medicalPost" && (
          <MedicalPostScreen
            onBack={() => setSubScreen("main")}
            onNavigate={onNavigate}
            shelterName={displayShelterName}
          />
        )}
        {subScreen === "familyStatus" && (
          <FamilyStatusScreen
            onBack={() => setSubScreen("main")}
            onNavigate={onNavigate}
            shelterName={displayShelterName}
          />
        )}
        {subScreen === "mealSchedule" && (
          <MealScheduleScreen onBack={() => setSubScreen("main")} onNavigate={onNavigate} />
        )}

        {subScreen === "main" && (
          <>
            <header className="flex-none px-6 pt-12 pb-5 flex flex-col items-center text-center relative z-10">
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

              <div className="mt-5 w-full bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex-none flex items-center justify-center">
                  <MapPin size={18} className="text-blue-600" />
                </div>

                <div className="text-left min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    Location
                  </p>

                  {/* ✅ Nearest PPS name */}
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {displayShelterName}
                  </p>

                  {/* ✅ Show area + distance */}
                  <p className="text-[10px] text-slate-400 font-medium truncate">
                    {displayShelterLoc}
                    {displayDistanceKm ? ` • ${displayDistanceKm} km` : ""}
                  </p>

                  <p className="text-[10px] text-slate-400 font-medium">
                    Checked-in: {checkinTime}
                  </p>
                </div>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto px-6 space-y-4 pb-6 relative z-10">
              <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-4 tracking-tight">
                  Help Us Improve Future Rescues
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">Alert Accuracy</span>
                    <StarRating value={alertRating} onChange={setAlertRating} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">Rescue Experience</span>
                    <StarRating value={rescueRating} onChange={setRescueRating} />
                  </div>

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

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setSubScreen("medicalPost")}
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

                <button
                  type="button"
                  onClick={() => setSubScreen("familyStatus")}
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

                <button
                  type="button"
                  onClick={() => setSubScreen("mealSchedule")}
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

              <button
                type="button"
                onClick={onReturnHome}
                className="w-full bg-primary text-white font-bold py-4 rounded-3xl shadow-lg shadow-blue-900/20 hover:bg-blue-800 active:scale-[0.98] transition-all mt-2"
              >
                Return to Home
              </button>
            </main>

            <BottomNav onHome={onReturnHome ?? (() => {})} onNavigate={onNavigate} />
          </>
        )}
      </div>
    </div>
  );
}