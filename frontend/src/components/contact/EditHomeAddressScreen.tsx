import { useState } from 'react';
import {
  ArrowLeft,
  Home,
  Map,
  Megaphone,
  User,
} from 'lucide-react';

interface EditHomeAddressScreenProps {
  onBack?: () => void;
  onSave?: (address: string) => void;
  onNavigate?: (screen: string) => void;
  initialAddress?: string;
}

export function EditHomeAddressScreen({
  onBack,
  onSave,
  onNavigate,
  initialAddress = 'No. 24, Jalan Teluk Gadung 27/93, Seksyen 27, Shah Alam',
}: EditHomeAddressScreenProps) {
  const [address, setAddress] = useState(initialAddress);

  const handleSave = () => {
    onSave?.(address.trim());
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-4 font-display text-dark-text">
      <div className="w-[400px] h-[824px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-slate-200">
        <header className="absolute top-0 left-0 right-0 z-30 pt-12 px-6 pb-4 flex items-center gap-4 bg-white/90 backdrop-blur">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white/90 backdrop-blur shadow-sm rounded-full flex items-center justify-center text-slate-700"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Edit Address</h1>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
          <div
            className="h-[40%] min-h-[300px] w-full relative flex items-center justify-center overflow-hidden"
            style={{
              backgroundColor: '#e5e7eb',
              backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          >
            <div className="absolute inset-0 opacity-40">
              <div className="absolute top-1/4 left-1/3 w-32 h-4 bg-slate-300 rotate-12 rounded-full"></div>
              <div className="absolute top-1/2 left-0 w-full h-6 bg-slate-300 -rotate-6 rounded-full"></div>
              <div className="absolute bottom-1/4 right-1/4 w-40 h-5 bg-slate-300 rotate-12 rounded-full"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="bg-white px-3 py-1 rounded-lg shadow-lg text-[10px] font-bold text-primary mb-2 whitespace-nowrap border border-slate-100">
                Current Location
              </div>
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-5xl leading-none translate-y-[1px]">
                    location_on
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white -mt-8 rounded-t-[32px] z-10 px-6 pt-8 pb-32 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="address"
                  className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1"
                >
                  Residential Address
                </label>
                <div className="relative">
                  <textarea
                    id="address"
                    name="address"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-primary/20 min-h-[100px] resize-none"
                  />
                  <button
                    type="button"
                    className="absolute bottom-3 right-3 w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">my_location</span>
                  </button>
                </div>
              </div>

              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3">
                <span className="material-symbols-outlined text-primary text-xl">info</span>
                <p className="text-xs text-primary leading-relaxed font-medium">
                  Accurate location data is critical for <span className="font-bold">Vertex AI</span> flood risk prediction in your specific zone.
                </p>
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-primary py-4 rounded-2xl text-white font-bold text-base shadow-lg shadow-primary/30 active:scale-[0.98] transition-all"
              >
                UPDATE ADDRESS
              </button>
            </div>
          </div>
        </div>

        <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-4 grid grid-cols-5 items-end z-50">
          <button
            onClick={() => onNavigate?.('home')}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
          >
            <Home size={20} />
            <span className="text-[10px] font-medium">Home</span>
          </button>

          <button
            onClick={() => onNavigate?.('map')}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
          >
            <Map size={20} />
            <span className="text-[10px] font-medium">Map</span>
          </button>

          <div className="flex flex-col items-center gap-1 -mt-10">
            <button className="w-16 h-16 bg-primary rounded-full shadow-2xl flex items-center justify-center text-white ring-[6px] ring-white active:scale-95 transition-transform">
              <span className="text-lg font-black tracking-tighter">SOS</span>
            </button>
          </div>

          <button
            onClick={() => onNavigate?.('updates')}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
          >
            <Megaphone size={20} />
            <span className="text-[10px] font-medium">Updates</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-primary">
            <User size={20} />
            <span className="text-[10px] font-bold">Profile</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

export default EditHomeAddressScreen;
