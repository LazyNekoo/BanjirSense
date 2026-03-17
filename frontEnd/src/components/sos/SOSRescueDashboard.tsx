import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Droplets,
  Heart,
  Home,
  Map,
  Megaphone,
  Radio,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react';

// Vision Result
type VisionResult = {
  verified: boolean;
  topLabel?: string;     
  labels?: string[];        
  objects?: string[];       
  text?: string;             
  summary?: string;
  hazards?: string[];
  waterDepthEstimateM?: number | null;
  confidence?: number | null;
};

interface DashboardDependent {
  id: string;
  fullName: string;
  relationship: string;
  triageTag: string;
}

interface SOSRescueDashboardProps {
  onConfirmArrival?: () => void;
  onNavigate?: (screen: string) => void;
  teamName?: string;
  etaMins?: number;
  distanceKm?: number;
  waterDepth?: number | null;
  hazardAlert?: string;
  medicalNeeds?: string | null;
  dependents?: DashboardDependent[];
  vision?: VisionResult | null;
}

function deriveVisionSOS(vision?: VisionResult | null) {
  const joined = [
  vision?.topLabel,
  ...(vision?.labels || []),
  ...(vision?.objects || []),
  vision?.text,
  vision?.summary,
]
  .filter(Boolean)
  .join(" ");

  const labelLower = joined.toLowerCase();

  const hazards: string[] = [];

  // Rule A: flood/water-related
  if (/(water|flood|river|puddle|rain|storm|drain|overflow|mud)/i.test(labelLower)) {
    hazards.push("Flood water detected");
  }

  // Rule B: obstacle/access-related
  if (/(stairs|road|bridge|car|vehicle|tree|debris|blocked|collapse|pole)/i.test(labelLower)) {
    hazards.push("Obstacle / access blocked");
  }

  // Rule C: danger signals
  if (/(current|wave|fast|deep|swirl)/i.test(labelLower)) {
    hazards.push("Fast current risk");
  }

  // If backend already provided hazards, merge them in
  if (vision?.hazards?.length) {
    vision.hazards.forEach((h) => {
      if (!hazards.includes(h)) hazards.push(h);
    });
  }

  // Build a nicer “Detected:” line
  let detectedLine = "";
  if (hazards.length > 0) {
    detectedLine = `Detected: ${hazards.join(" • ")}`;
  } else if (joined) {
    detectedLine = `Scene recognized: ${joined}`;
  } else {
    detectedLine = "No vision insight available.";
  }

  return {
    detectedLine,
    hazardChips: hazards,
  };
}

// triage tag → colour
const TRIAGE_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
  infant:   { bg: 'bg-blue-900/40',   text: 'text-blue-300',   border: 'border-blue-700/40',   label: 'Infant'    },
  toddler:  { bg: 'bg-blue-900/40',   text: 'text-blue-300',   border: 'border-blue-700/40',   label: 'Toddler'   },
  child:    { bg: 'bg-sky-900/40',    text: 'text-sky-300',    border: 'border-sky-700/40',    label: 'Child'     },
  elderly:  { bg: 'bg-amber-900/40',  text: 'text-amber-300',  border: 'border-amber-700/40',  label: 'Elderly'   },
  disabled: { bg: 'bg-purple-900/40', text: 'text-purple-300', border: 'border-purple-700/40', label: 'Disabled'  },
  medical:  { bg: 'bg-red-900/40',    text: 'text-red-300',    border: 'border-red-700/40',    label: 'Medical'   },
};
function triageStyle(tag: string) {
  return TRIAGE_STYLES[tag?.toLowerCase()] ?? { bg: 'bg-zinc-800', text: 'text-zinc-400', border: 'border-zinc-700', label: tag };
}

// ── Live Updates data ─────────────────────────────────────────────────────────
function getUpdates(isVisionVerified: boolean) {
  const base = [
    { id: 1, time: 'Now', text: 'Rescue team dispatched and en route', icon: <Radio className="w-3.5 h-3.5" />, accent: 'text-hazard-red' },
    { id: 2, time: '2 min ago', text: 'Your SOS signal received by command', icon: <CheckCircle2 className="w-3.5 h-3.5" />, accent: 'text-trust-green' },
  ];

  if (isVisionVerified) {
    base.push({
      id: 3,
      time: '5 min ago',
      text: 'Photo intel analyzed by Vision AI',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      accent: 'text-slate-400',
    });
  } else {
    base.push({
      id: 3,
      time: '5 min ago',
      text: 'No photo submitted (Vision skipped)',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      accent: 'text-slate-400',
    });
  }

  return base;
}

// ── Tactical Map ─────────────────────────────────────────────────────────────
function TacticalMap({ etaMins, distanceKm }: { etaMins: number; distanceKm: number }) {
  return (
    <div
      className="relative mx-5 rounded-3xl overflow-hidden bg-zinc-800 border border-zinc-700"
      style={{ height: '190px' }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, #52525b 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />
      {/* SVG path + markers */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 190" fill="none">
        <path d="M 300 48 Q 200 95 78 148" stroke="#ef4444" strokeWidth="2" strokeDasharray="8 6" strokeLinecap="round" opacity="0.7" />
        {/* User pulse rings */}
        <circle cx="78" cy="148" r="20" fill="#ef4444" opacity="0.08" />
        <circle cx="78" cy="148" r="12" fill="#ef4444" opacity="0.15" />
        <circle cx="78" cy="148" r="7"  fill="#ef4444" />
        <circle cx="78" cy="148" r="3.5" fill="white" />
        {/* Team pulse rings */}
        <circle cx="300" cy="48" r="20" fill="#ef4444" opacity="0.08" />
        <circle cx="300" cy="48" r="12" fill="#ef4444" opacity="0.15" />
        <circle cx="300" cy="48" r="9"  fill="#ef4444" />
        <path d="M296 48 L300 43 L304 48 L302 51 L298 51 Z" fill="white" opacity="0.95" />
      </svg>
      {/* ETA pill */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-zinc-700">
          <span className="w-2 h-2 rounded-full bg-hazard-red animate-pulse" />
          <span className="text-xs font-black text-white tracking-tight">
            {etaMins} MIN{etaMins !== 1 ? 'S' : ''} • {distanceKm.toFixed(1)} KM
          </span>
        </div>
      </div>
      {/* Labels */}
      <div className="absolute" style={{ left: '10px', bottom: '24px' }}>
        <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-wider bg-black/60 px-1.5 py-0.5 rounded">You</span>
      </div>
      <div className="absolute" style={{ right: '10px', top: '10px' }}>
        <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-wider bg-black/60 px-1.5 py-0.5 rounded">Team</span>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function SOSRescueDashboard({
  onConfirmArrival,
  onNavigate,
  teamName = 'B-12',
  etaMins = 6,
  distanceKm = 0.5,
  waterDepth = null,
  hazardAlert = 'Moving current detected near north entrance',
  medicalNeeds = null,
  dependents = [],
  vision = null,
}: SOSRescueDashboardProps) {
  // total people = user + dependents
  const totalOccupants = 1 + dependents.length;
  const [eta, setEta] = useState(etaMins);
  const isVisionVerified = Boolean(vision?.verified);
  const derived = deriveVisionSOS(vision);

  useEffect(() => {
    if (eta <= 0) return;
    const id = setInterval(() => setEta((n) => Math.max(0, n - 1)), 60_000);
    return () => clearInterval(id);
  }, [eta]);

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-0 md:p-4 font-display">
      <div className="w-[400px] max-w-[400px] h-[824px] bg-zinc-900 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-zinc-700">

        {/* ── Header ── */}
        <header className="flex-none px-6 pt-8 pb-4 bg-zinc-900/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between border-b border-zinc-700">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-hazard-red flex items-center justify-center text-white shadow-lg shadow-red-900/50">
              <Droplets size={20} />
            </div>
            <div>
              <h1 className="font-black text-base tracking-tight text-white leading-none">
                Team {teamName}: En Route
              </h1>
              <p className="text-[11px] text-zinc-500 font-medium mt-0.5">Rescue in progress</p>
            </div>
          </div>
          {/* ETA badge */}
          <div className="flex flex-col items-center bg-hazard-red/10 border border-hazard-red/30 rounded-xl px-3 py-1.5">
            <span className="text-xl font-black text-hazard-red leading-none">{eta}</span>
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">mins</span>
          </div>
        </header>

        {/* ── Scrollable Body ── */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-6">

          {/* Live status pill */}
          <div className="flex justify-center pt-4 pb-3">
            <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 px-4 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-hazard-red animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                SOS Active — Stay Calm &amp; Visible
              </span>
            </div>
          </div>

          {/* Map */}
          <TacticalMap etaMins={eta} distanceKm={distanceKm} />

          {/* Situation Report */}
          <section className="px-5 mt-5">
            <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-3">
              Situation Report
            </p>
            <div className="bg-zinc-800 rounded-3xl border border-zinc-700 divide-y divide-zinc-700 overflow-hidden">
              {/* Water depth */}
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-700 flex items-center justify-center text-hazard-red border border-zinc-600">
                    <Droplets size={16} />
                  </div>
                  <span className="text-sm font-bold text-white">Station Water Level (JPS)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-white">
                    {typeof waterDepth === "number" ? `${waterDepth.toFixed(2)}m` : "N/A"}
                  </span>
                  <span className="text-[9px] font-bold text-safe-green bg-safe-green/10 border border-safe-green/20 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                    Verified
                  </span>
                </div>
              </div>
              {/* Occupants */}
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-700 flex items-center justify-center text-zinc-400 border border-zinc-600">
                    <Users size={16} />
                  </div>
                  <span className="text-sm font-bold text-white">Occupants</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-white">{totalOccupants}</span>
                  <span className="text-[9px] font-bold text-zinc-300 bg-zinc-700 border border-zinc-600 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                    Confirmed
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Vision */}
          <section className="px-5 mt-4">
            <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-3">
              Vision Layer
            </p>

            <div className="bg-zinc-800 rounded-3xl border border-zinc-700 overflow-hidden">
              {/* Status row */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-700">
                <span className="text-sm font-bold text-white">Photo Validation</span>

                {vision?.verified ? (
                  <span className="text-[9px] font-bold text-trust-green bg-trust-green/10 border border-trust-green/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Vision Verified
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-zinc-300 bg-zinc-700 border border-zinc-600 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Not Provided
                  </span>
                )}
              </div>

              {/* Summary */}
              <div className="px-5 py-4">
                <p className="text-sm text-zinc-200 font-medium leading-snug">
                  {isVisionVerified
                    ? (vision?.summary || derived.detectedLine)
                    : "No photo submitted. Vision validation unavailable."}
                </p>

                {/* Hazards chips (use derived) */}
                {isVisionVerified && derived.hazardChips.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {derived.hazardChips.map((h, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-bold px-2 py-1 rounded-full bg-hazard-red/10 border border-hazard-red/30 text-zinc-200 uppercase tracking-wider"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                )}

                {/* Estimated depth (Vision) */}
                {isVisionVerified && typeof vision?.waterDepthEstimateM === "number" && (
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      Estimated Local Depth (Vision)
                    </span>
                    <span className="text-sm font-black text-white">
                      ~{vision.waterDepthEstimateM.toFixed(2)}m
                    </span>
                  </div>
                )}

                {/* Confidence */}
                {isVisionVerified && typeof vision?.confidence === "number" && (
                  <p className="mt-2 text-[11px] text-zinc-400 font-semibold">
                    Confidence: {(vision.confidence * 100).toFixed(0)}%
                  </p>
                )}
              </div>
            </div>
          </section>
          

          {/* Dependents at same location */}
          {dependents.length > 0 && (
            <section className="px-5 mt-4">
              <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-3">
                People at Your Location
              </p>
              <div className="bg-zinc-800 rounded-3xl border border-zinc-700 divide-y divide-zinc-700 overflow-hidden">
                {dependents.map((dep) => {
                  const ts = triageStyle(dep.triageTag);
                  return (
                    <div key={dep.id} className="flex items-center gap-3 px-5 py-3.5">
                      <div className="w-8 h-8 rounded-lg bg-zinc-700 border border-zinc-600 flex items-center justify-center text-zinc-400 flex-none">
                        <User size={15} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white leading-none">{dep.fullName}</p>
                        <p className="text-[11px] text-zinc-500 font-medium mt-0.5">{dep.relationship}</p>
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border ${ts.bg} ${ts.text} ${ts.border}`}>
                        {ts.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Hazard alert */}
          {hazardAlert && (
            <section className="px-5 mt-4">
              <div className="bg-amber-950/40 border border-amber-800/50 rounded-3xl p-5 flex gap-3">
                <div className="flex-none w-8 h-8 rounded-lg bg-amber-900/40 border border-amber-700/50 flex items-center justify-center text-amber-400">
                  <AlertTriangle size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-amber-400 uppercase tracking-wider mb-1">Hazard Alert</p>
                  <p className="text-sm text-amber-200/80 font-medium leading-snug">{hazardAlert}</p>
                </div>
              </div>
            </section>
          )}

          {/* Medical needs */}
          {medicalNeeds && (
            <section className="px-5 mt-4">
              <div className="bg-red-950/40 border border-red-800/50 rounded-3xl p-5 flex gap-3">
                <div className="flex-none w-8 h-8 rounded-lg bg-red-900/40 border border-red-700/50 flex items-center justify-center text-hazard-red">
                  <Heart size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-hazard-red uppercase tracking-wider mb-1">Medical Needs Flagged</p>
                  <p className="text-sm text-red-200/80 font-medium leading-snug">{medicalNeeds}</p>
                </div>
              </div>
            </section>
          )}

          {/* Live Updates */}
          <section className="px-5 mt-5">
            <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-3">
              Live Responder Updates
            </p>
            <div className="bg-zinc-800 rounded-3xl border border-zinc-700 divide-y divide-zinc-700 overflow-hidden">
              {getUpdates(isVisionVerified).map((u) => (
                <div key={u.id} className="flex items-start gap-3 px-5 py-3.5">
                  <div className={`flex-none mt-0.5 ${u.accent}`}>{u.icon}</div>
                  <p className="flex-1 text-sm font-semibold text-zinc-200 leading-snug">{u.text}</p>
                  <span className="flex-none text-[10px] text-zinc-600 font-medium pt-0.5">{u.time}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Confirm CTA */}
          <section className="px-5 mt-6">
            <button
              onClick={onConfirmArrival}
              className="w-full py-4 bg-hazard-red text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-red-600 active:bg-red-700 transition-colors"
              style={{ boxShadow: '0 0 30px 6px rgba(239,68,68,.2)' }}
            >
              <CheckCircle2 size={18} />
              Confirm Safe Arrival
              <ChevronRight size={16} className="opacity-70" />
            </button>
          </section>

          {/* Footer */}
          <section className="px-5 mt-6 mb-2 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-zinc-600" />
              <span className="text-[10px] font-black text-zinc-600 tracking-widest uppercase">
                Secure Government-Linked Encryption
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-hazard-red flex items-center justify-center text-white">
                <Droplets size={14} />
              </div>
              <span className="font-black text-sm tracking-tight text-white">BanjirSense</span>
            </div>
          </section>

        </main>

        {/* ── Navbar — HomeScreen structure, dark colors ── */}
        <nav className="flex-none bg-zinc-800 border-t border-zinc-700 px-6 py-4 grid grid-cols-5 items-end z-30">
          <button
            onClick={() => onNavigate?.('home')}
            className="flex flex-col items-center gap-1 text-zinc-500 hover:text-white transition-colors"
          >
            <Home size={20} />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button
            onClick={() => onNavigate?.('map')}
            className="flex flex-col items-center gap-1 text-zinc-500 hover:text-white transition-colors"
          >
            <Map size={20} />
            <span className="text-[10px] font-medium">Map</span>
          </button>
          <div className="flex flex-col items-center gap-1 -mt-10">
            <button
              type="button"
              onClick={() => onNavigate?.('sos')}
              className="w-20 h-20 bg-hazard-red rounded-full shadow-2xl shadow-red-900/60 flex items-center justify-center text-white ring-[6px] ring-zinc-900 active:scale-95 transition-transform"
            >
              <span className="text-2xl font-black tracking-tighter">SOS</span>
            </button>
          </div>
          <button
            onClick={() => onNavigate?.('updates')}
            className="flex flex-col items-center gap-1 text-zinc-500 hover:text-white transition-colors"
          >
            <Megaphone size={20} />
            <span className="text-[10px] font-medium">Updates</span>
          </button>
          <button
            onClick={() => onNavigate?.('profile')}
            className="flex flex-col items-center gap-1 text-zinc-500 hover:text-white transition-colors"
          >
            <User size={20} />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </nav>

      </div>
    </div>
  );
}
