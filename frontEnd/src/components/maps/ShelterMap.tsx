import React, { useRef, useState } from 'react';
import {
  Home,
  Map,
  Megaphone,
  User,
  Search,
  Shield,
  HeartPulse,
  Navigation,
} from 'lucide-react';
import { useNavigation } from '../../lib/navigation';

interface ShelterMapProps {
  currentLocation?: { lat: number; lng: number };
  safeZoneStatus?: {
    area: string;
    riskLevel: 'low' | 'medium' | 'high';
  };
  onNavigate?: (screen: string) => void;
}

const ShelterMap: React.FC<ShelterMapProps> = ({
  currentLocation,
  safeZoneStatus = { area: 'Shah Alam', riskLevel: 'low' },
  onNavigate,
}) => {
  const navigation = useNavigation();
  const minSheet = 0.14;
  const maxSheet = 0.48;
  const [sheetHeight, setSheetHeight] = useState(0.4);
  const isSheetOpen = sheetHeight > minSheet + 0.02;
  const dragStateRef = useRef({ isDragging: false, startY: 0, startHeight: 0 });

  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

  const handleSheetToggle = () => {
    setSheetHeight((current) => (current > (minSheet + maxSheet) / 2 ? minSheet : maxSheet));
  };

  const handleSheetPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    dragStateRef.current = {
      isDragging: true,
      startY: event.clientY,
      startHeight: sheetHeight,
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!dragStateRef.current.isDragging) return;
      const delta = moveEvent.clientY - dragStateRef.current.startY;
      const next = dragStateRef.current.startHeight - delta / window.innerHeight;
      setSheetHeight(clamp(next, minSheet, maxSheet));
    };

    const handlePointerUp = () => {
      dragStateRef.current.isDragging = false;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleNavigate = (screen: string) => {
    if (onNavigate) {
      onNavigate(screen);
      return;
    }
    navigation?.navigate(screen);
  };
  const getStatusLabel = (level: string) => {
    switch (level) {
      case 'high':
        return 'Critical Conditions';
      case 'medium':
        return 'Conditions Watch';
      case 'low':
      default:
        return 'Environment Stable';
    }
  };

  return (
    <div className="w-[400px] h-[824px] bg-slate-100 font-display text-dark-text relative overflow-hidden flex flex-col">
      <div
        id="google-map-container"
        className="absolute inset-0 w-full h-full bg-[#e5e7eb]"
        style={{
          backgroundImage:
            'url(https://lh3.googleusercontent.com/aida-public/AB6AXuDiT2BRHWVAkT2997eMVBBylQVOm92MZ5qCf06rhsB7RT6DeXEaQ-HLF23r3vhWRASaM8y0HKH602UwKUPQI04WxSqRQBWIohcdnvau4TE3lGo8xRJjAZYj0BZQpVSMdpf1s1QNyjUent5KPiteoUQo-yiNayMaITkGxHTiRre0zsLXjOyI4mkXJEfGOt1lSxoU5zN96-3jDUN5RSsC-BJGADE4M5t_T4wzzkx_qO5wfzsoAfpoadMUyvsa9smAUUFSMBp9lVi5LY3L)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/10 opacity-60 grayscale-[0.3]" />

        {currentLocation && (
          <div className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2" style={{ left: '52%', top: '48%' }}>
            <div className="relative flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-500/30 rounded-full absolute animate-pulse" />
              <div className="w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg" />
            </div>
          </div>
        )}

        <div className="absolute top-[32%] left-[25%] flex flex-col items-center">
          <div className="bg-white/90 backdrop-blur px-2 py-0.5 rounded shadow-sm border border-slate-100 mb-1">
            <p className="text-[9px] font-bold text-slate-800">Dewan MBSA</p>
          </div>
          <div className="w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center border border-slate-100">
            <Home size={14} className="text-primary" />
          </div>
        </div>
        <div className="absolute top-[45%] left-[18%] flex flex-col items-center">
          <div className="bg-white/90 backdrop-blur px-2 py-0.5 rounded shadow-sm border border-slate-100 mb-1">
            <p className="text-[9px] font-bold text-slate-800">SK Taman Sri Muda</p>
          </div>
          <div className="w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center border border-slate-100">
            <Home size={14} className="text-primary" />
          </div>
        </div>
        <div className="absolute top-[22%] left-[65%] flex flex-col items-center">
          <div className="bg-white/90 backdrop-blur px-2 py-0.5 rounded shadow-sm border border-slate-100 mb-1">
            <p className="text-[9px] font-bold text-slate-800">Sri Muda Hall</p>
          </div>
          <div className="w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center border border-slate-100">
            <Home size={14} className="text-primary" />
          </div>
        </div>

        <div className="absolute top-[18%] left-[35%] flex flex-col items-center">
          <div className="w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center border border-slate-100">
            <HeartPulse size={14} className="text-red-500" />
          </div>
        </div>
        <div className="absolute top-[55%] left-[60%] flex flex-col items-center">
          <div className="w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center border border-slate-100">
            <HeartPulse size={14} className="text-red-500" />
          </div>
        </div>
        <div className="absolute top-[38%] left-[78%] flex flex-col items-center">
          <div className="w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center border border-slate-100">
            <Shield size={14} className="text-blue-700" />
          </div>
        </div>
        <div className="absolute top-[12%] left-[12%] flex flex-col items-center">
          <div className="w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center border border-slate-100">
            <Shield size={14} className="text-blue-700" />
          </div>
        </div>
      </div>

      <div className="absolute top-4 left-4 right-4 z-20 space-y-3">
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-100 flex items-center px-4 py-3 gap-3">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search for shelters or safe routes"
              className="bg-transparent border-none text-sm placeholder:text-slate-400 focus:ring-0 w-full p-0"
            />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {['Shelters', 'High Ground', 'Medical Centers'].map((label) => (
            <button
              key={label}
              className="flex-shrink-0 bg-white px-4 py-1.5 rounded-full shadow-sm border border-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto relative z-30">
        <div className="bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] border-t border-slate-100">
          <button
            onClick={handleSheetToggle}
            onPointerDown={handleSheetPointerDown}
            className="w-full flex items-center justify-center py-3 touch-none"
            aria-expanded={isSheetOpen}
          >
            <span className="w-12 h-1.5 bg-slate-200 rounded-full" />
          </button>
          <div
            className={`overflow-hidden px-6 transition-[height] duration-200 ${
              isSheetOpen ? 'pb-32' : 'pb-0'
            }`}
            style={{
              height: `${sheetHeight * 100}vh`,
              paddingBottom: isSheetOpen ? 'calc(8rem + env(safe-area-inset-bottom))' : '0',
            }}
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
                <Shield size={28} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900 leading-tight">{getStatusLabel(safeZoneStatus.riskLevel)}</h2>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-600">0.0mm/h</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Tactical View • Verified by <span className="font-bold text-primary">Vision API</span>
                </p>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Nearby Shelter Capacities</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-[13px] font-semibold text-slate-700">
                    Dewan MBSA: <span className="text-green-600 font-bold ml-1">10% Capacity</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-[13px] font-semibold text-slate-700">
                    SK Taman Sri Muda: <span className="text-green-600 font-bold ml-1">20% Capacity</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <p className="text-[13px] font-semibold text-slate-700">
                    Sri Muda Hall: <span className="text-amber-600 font-bold ml-1">45% Capacity</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex">
              <button className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-900/10 hover:bg-blue-900 transition-colors">
                <Navigation size={18} />
                Get Directions to Nearest Safe Zone
              </button>
            </div>
          </div>
        </div>
      </div>

      <nav className="absolute bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 px-6 py-4 grid grid-cols-5 items-end">
        <button
          onClick={() => handleNavigate('home')}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
        >
          <Home size={20} />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button
          onClick={() => handleNavigate('map')}
          className="flex flex-col items-center gap-1 text-primary"
        >
          <Map size={20} />
          <span className="text-[10px] font-bold">Map</span>
        </button>
        <div className="flex flex-col items-center gap-1 -mt-10">
          <button className="w-20 h-20 bg-primary rounded-full shadow-2xl shadow-blue-900/40 flex items-center justify-center text-white ring-[6px] ring-white active:scale-95 transition-transform">
            <span className="text-2xl font-black tracking-tighter">SOS</span>
          </button>
        </div>
        <button
          onClick={() => handleNavigate('updates')}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
        >
          <Megaphone size={20} />
          <span className="text-[10px] font-medium">Updates</span>
        </button>
        <button
          onClick={() => handleNavigate('profile')}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
        >
          <User size={20} />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default ShelterMap;
