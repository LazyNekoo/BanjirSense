import { useState, useRef } from "react";
import {
  ArrowLeft,
  Camera,
  Image,
  MapPin,
  Home,
  Map,
  Megaphone,
  User,
  Brain,
  ChevronDown,
  Info,
  CrosshairIcon,
} from "lucide-react";

interface SubmitReportProps {
  onBack?: () => void;
  onSubmit?: (data: ReportFormData) => void;
  onNavigate?: (screen: string) => void;
  onOpenSOS?: () => void;
}

export interface ReportFormData {
  title: string;
  location: string;
  description: string;
  category: string;
  anonymous: boolean;
  imageFile?: File | null;
}

export function SubmitReport({
  onBack,
  onSubmit,
  onNavigate,
  onOpenSOS,
}: SubmitReportProps) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Flood Level");
  const [anonymous, setAnonymous] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string);
      setIsAnalyzing(true);
      // Simulate Vision API analysis
      setTimeout(() => setIsAnalyzing(false), 2500);
    };
    reader.readAsDataURL(file);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation(
        `GPS: ${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E`
      );
    });
  };

  const handleSubmit = () => {
    onSubmit?.({
      title,
      location,
      description,
      category,
      anonymous,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-4 font-display">
    <div className="w-[400px] h-[824px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-slate-200">
      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Sticky Header */}
      <header className="pt-12 px-6 pb-4 bg-white flex items-center gap-4 flex-none z-10 shadow-sm">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-700" />
        </button>
        <h1 className="text-xl font-bold text-slate-900">Submit Community Report</h1>
      </header>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-6 pb-36 space-y-6" style={{ scrollbarWidth: "none" }}>
        {/* Capture Evidence */}
        <section className="pt-4">
          <h2 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">Capture Evidence</h2>
          <div className="grid grid-cols-3 gap-3">
            {/* Camera */}
            <button
              onClick={() => fileRef.current?.click()}
              className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1 hover:bg-slate-100 transition-colors group"
            >
              <Camera size={28} className="text-slate-400 group-hover:text-[#1e3a8a]" />
              <span className="text-[10px] font-bold text-slate-500">Camera</span>
            </button>

            {/* Gallery */}
            <button
              onClick={() => fileRef.current?.click()}
              className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1 hover:bg-slate-100 transition-colors group"
            >
              <Image size={28} className="text-slate-400 group-hover:text-[#1e3a8a]" />
              <span className="text-[10px] font-bold text-slate-500">Gallery</span>
            </button>

            {/* Preview / Vision API */}
            <div className="aspect-square bg-blue-50 border border-blue-100 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Captured" className="w-full h-full object-cover rounded-2xl" />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-blue-900/40 flex flex-col items-center justify-center rounded-2xl">
                      <Brain size={22} className="text-white animate-spin" style={{ animationDuration: "3s" }} />
                      <span className="text-[9px] font-bold text-white mt-1 text-center px-1">Analyzing...</span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-blue-600/5 animate-pulse rounded-2xl" />
                  <Brain size={24} className="text-[#1e3a8a] animate-spin" style={{ animationDuration: "3s" }} />
                  <span className="text-[9px] font-bold text-[#1e3a8a] mt-1 text-center px-1">Vision API Analyzing...</span>
                </>
              )}
            </div>
          </div>
        </section>

        {/* AI Info Banner */}
        <div className="flex items-start gap-3 bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <Info size={16} className="text-[#1e3a8a] mt-0.5 shrink-0" />
          <p className="text-xs text-[#1e3a8a] font-medium leading-relaxed">
            AI will verify your report against local sensor data to ensure community accuracy before publishing.
          </p>
        </div>

        {/* Report Title */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
            Report Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Rising water at Jalan Melati"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] placeholder:text-slate-400 outline-none transition"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
            Location
          </label>
          <div className="relative">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Detecting location..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm pr-12 focus:ring-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] placeholder:text-slate-400 outline-none transition"
            />
            <button
              onClick={handleDetectLocation}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[#1e3a8a] hover:bg-blue-100 rounded-lg transition-colors"
            >
              <CrosshairIcon size={18} />
            </button>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide more details about the incident (depth, speed of water, etc.)"
            rows={4}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] placeholder:text-slate-400 outline-none transition resize-none"
          />
        </div>

        {/* Report Category */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
            Report Category
          </label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm appearance-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none text-slate-700 transition"
            >
              <option>Flood Level</option>
              <option>Blocked Road</option>
              <option>Fallen Tree</option>
              <option>Infrastructure Damage</option>
              <option>Landslide</option>
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Submit Anonymously */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <User size={16} className="text-slate-400" />
            <span className="text-sm font-medium text-slate-600">Submit Anonymously</span>
          </div>
          <button
            onClick={() => setAnonymous(!anonymous)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
              anonymous ? "bg-[#1e3a8a]" : "bg-slate-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                anonymous ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Location note */}
        <div className="flex items-start gap-2 pb-2">
          <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-400">
            Your precise GPS location will be attached to this report to help coordinate relief efforts.
          </p>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-[#1e3a8a] text-white rounded-2xl font-bold text-base shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all hover:bg-blue-900"
        >
          Submit for AI Verification
        </button>
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
