import React, { useEffect, useRef, useState } from 'react';
import {
  Dog,
  HeartPulse,
  Home,
  Map,
  MapPin,
  Megaphone,
  Navigation,
  Search,
  Shield,
  User,
  UtensilsCrossed,
  Zap,
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
  const [sheetHeight, setSheetHeight] = useState(0.4);
  const [selectedChip, setSelectedChip] = useState<'shelter' | 'highground' | 'medical' | null>(null);
  const activePanel: 'environment' | 'shelter' = selectedChip === 'shelter' ? 'shelter' : 'environment';
  const isSheetOpen = sheetHeight > minSheet + 0.02;
  const dragStateRef = useRef({ isDragging: false, startY: 0, startHeight: 0 });
  const maxSheet = activePanel === 'shelter' ? 0.68 : 0.48;

  useEffect(() => {
    if (activePanel === 'shelter' && sheetHeight < 0.58) {
      setSheetHeight(0.58);
    }
  }, [activePanel, sheetHeight]);

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

  const getOccupancyColor = (percentage: number) => {
    if (percentage < 40) return '#22c55e';
    if (percentage < 70) return '#f59e0b';
    return '#ef4444';
  };

  const featuredShelter = {
    name: 'Dewan Sri Muda Hall',
    location: 'Shah Alam',
    distance: '1.2km',
    occupancyPercentage: 45,
    photo:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCviprd5_cGhNptBp-mb_A1iqUR472FBz5mYF-J2NduU3mE9qNcDDX8ffyNxVA4PAC29ry0-KIyA0meH6ZLxyw4_udGtseIQ2hVgVfByezP3VTNv8SYnfTH6AW8Q7Al14dSWyxOUxdX8yYvEx8tFSlLBwTgQ3k-_dBWZfDvJcVJiuR1XolB7G7kRDNnKp3YhqB7r0MbaiRHkcCRn8VsCy7-wcaFGBjvYcDsFFZuETPHvuC9yrunteNKfPvQs1IXMooJH9lqxPXkptjQ',
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
          {[
            { key: 'shelter', label: 'Shelters' },
            { key: 'highground', label: 'High Ground' },
            { key: 'medical', label: 'Medical Centers' },
          ].map((chip) => (
            <button
              key={chip.label}
              onClick={() =>
                setSelectedChip((current) =>
                  current === chip.key ? null : (chip.key as 'shelter' | 'highground' | 'medical')
                )
              }
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                selectedChip === chip.key
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white border border-slate-100 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {chip.label}
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
            {activePanel === 'shelter' ? (
              <div>
                <div className="text-center mb-5">
                  <h2 className="text-2xl font-black text-slate-900 leading-tight">Select Your Shelter</h2>
                  <p className="text-slate-500 text-[13px] font-medium mt-1">
                    Choose a verified evacuation center for priority rescue coordination.
                  </p>
                </div>

                <div className="relative rounded-[28px] overflow-hidden h-52 mb-6 group shadow-xl border border-slate-100">
                  <div
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    style={{
                      backgroundImage: `url(${featuredShelter.photo})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <MapPin size={36} className="text-red-500 drop-shadow-lg" />
                      <div className="w-2 h-1 bg-black/20 rounded-full blur-[2px]" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-5">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <span className="bg-green-500/90 text-[10px] text-white font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                          Operational
                        </span>
                        <h3 className="text-white text-xl font-bold leading-tight">{featuredShelter.name}</h3>
                        <p className="text-white/80 text-xs flex items-center gap-1">
                          <Navigation size={14} />
                          {featuredShelter.distance} away • {featuredShelter.location}
                        </p>
                      </div>
                      <div className="relative flex flex-col items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-slate-900/40 backdrop-blur-md flex items-center justify-center relative overflow-hidden">
                          <div
                            className="absolute inset-0"
                            style={{
                              background: `conic-gradient(${getOccupancyColor(45)} 0% 45%, rgba(241,245,249,0.2) 45% 100%)`,
                              WebkitMask: 'radial-gradient(transparent 62%, black 64%)',
                              mask: 'radial-gradient(transparent 62%, black 64%)',
                            }}
                          />
                          <div className="relative z-10 text-center">
                            <span className="text-[20px] font-black text-white block leading-none tracking-tight">45%</span>
                            <span className="text-[8px] text-white/80 uppercase font-black tracking-widest mt-0.5">Full</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-6">
                  <div className="flex flex-col items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <HeartPulse className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-bold text-slate-600">Medical</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <UtensilsCrossed className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-bold text-slate-600">Food</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <Dog className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-bold text-slate-600">Pet Safe</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <Zap className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-bold text-slate-600">Power</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button className="flex items-center justify-center gap-3 py-4 bg-white rounded-2xl text-[13px] font-bold text-slate-800 shadow-sm active:scale-95 transition-all border border-slate-200">
                    Google Maps
                  </button>
                  <button className="flex items-center justify-center gap-3 py-4 bg-white rounded-2xl text-[13px] font-bold text-slate-800 shadow-sm active:scale-95 transition-all border border-slate-200">
                    Waze
                  </button>
                </div>

                <p className="text-[10px] text-center font-bold text-slate-400 tracking-widest uppercase mb-2">
                  SHELTER DATA VERIFIED BY NADMA • 2M AGO
                </p>
              </div>
            ) : (
              <>
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
              </>
            )}
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
