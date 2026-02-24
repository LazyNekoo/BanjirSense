import React, { useState } from 'react';
import { MapPin, Phone, UtensilsCrossed, Dog, Zap, Navigation } from 'lucide-react';

export interface ShelterInfo {
  id: string;
  name: string;
  location: string;
  distance: string;
  occupancyPercentage: number;
  status: 'operational' | 'at-capacity' | 'closed';
  photo?: string;
  latitude: number;
  longitude: number;
  amenities: {
    medical: boolean;
    food: boolean;
    petFriendly: boolean;
    power: boolean;
  };
  lastVerified?: string;
}

interface ShelterSelectionSheetProps {
  shelter: ShelterInfo | null;
  isOpen?: boolean;
  onClose?: () => void;
  onNavigate?: (type: 'google-maps' | 'waze', shelter: ShelterInfo) => void;
}

const ShelterSelectionSheet: React.FC<ShelterSelectionSheetProps> = ({
  shelter,
  isOpen = false,
  onClose,
  onNavigate,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!shelter) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return { bg: 'bg-green-500', text: 'OPERATIONAL' };
      case 'at-capacity':
        return { bg: 'bg-amber-500', text: 'AT CAPACITY' };
      case 'closed':
        return { bg: 'bg-red-500', text: 'CLOSED' };
      default:
        return { bg: 'bg-slate-500', text: 'UNKNOWN' };
    }
  };

  const statusStyle = getStatusColor(shelter.status);

  const handleGoogleMapsNavigation = () => {
    if (onNavigate) {
      onNavigate('google-maps', shelter);
    } else {
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${shelter.latitude},${shelter.longitude}&travelmode=driving`;
      window.open(mapsUrl, '_blank');
    }
  };

  const handleWazeNavigation = () => {
    if (onNavigate) {
      onNavigate('waze', shelter);
    } else {
      const wazeUrl = `https://www.waze.com/ul?ll=${shelter.latitude},${shelter.longitude}&navigate=yes`;
      window.open(wazeUrl, '_blank');
    }
  };

  return (
    <div
      className={`fixed inset-0 transition-all duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      {/* Sheet Container */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] shadow-2xl border-t border-slate-200 transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          height: isExpanded ? '90%' : '60%',
          maxHeight: '90vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle Indicator */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto h-full pb-20 px-6">
          {/* Header with Expand/Collapse */}
          <div className="flex items-center justify-between mb-6 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
            <h2 className="text-2xl font-black text-slate-900">Select Your Shelter</h2>
            <button className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
              {isExpanded ? '▼' : '▲'}
            </button>
          </div>

          {/* Hero Card with Shelter Photo and Location */}
          <div className="relative rounded-[28px] overflow-hidden h-52 mb-6 group shadow-xl border border-slate-100">
            {/* Background Image */}
            <div
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              style={{
                backgroundImage: shelter.photo
                  ? `url(${shelter.photo})`
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />

            {/* Location Pin Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-500 drop-shadow-lg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12c0 7 10 13 10 13s10-6 10-13c0-5.52-4.48-10-10-10zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
              </svg>
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-5">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`${statusStyle.bg} text-[10px] text-white font-bold px-2.5 py-1 rounded uppercase tracking-wider shadow-lg`}>
                      {statusStyle.text}
                    </span>
                  </div>
                  <h3 className="text-white text-xl font-bold leading-tight">{shelter.name}</h3>
                  <p className="text-white/80 text-xs flex items-center gap-1">
                    <MapPin size={14} />
                    {shelter.distance} away • {shelter.location}
                  </p>
                </div>

                {/* Occupancy Gauge */}
                <div className="relative flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full shadow-lg bg-slate-900/40 backdrop-blur-md flex items-center justify-center relative overflow-hidden border-2 border-white/20">
                    {/* SVG Ring - Conic Gradient Effect */}
                    <svg
                      className="absolute inset-0 w-full h-full"
                      viewBox="0 0 100 100"
                      style={{
                        transform: 'rotate(-90deg)',
                      }}
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="rgba(34, 197, 94, 0.2)"
                        strokeWidth="6"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="6"
                        strokeDasharray={`${(shelter.occupancyPercentage / 100) * (Math.PI * 90)} ${Math.PI * 90}`}
                        strokeLinecap="round"
                      />
                    </svg>

                    {/* Center Text */}
                    <div className="relative z-10 text-center">
                      <span className="text-[20px] font-black text-white block leading-none tracking-tight drop-shadow-lg">
                        {shelter.occupancyPercentage}%
                      </span>
                      <span className="text-[8px] text-white/80 uppercase font-black tracking-widest mt-0.5 drop-shadow">Full</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities Grid */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {/* Medical */}
            <div
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                shelter.amenities.medical
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-slate-50/50 border-slate-100 opacity-50'
              }`}
            >
              <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 11h-2v2h-2v-2h-2v-2h2v-2h2v2h2v2z" />
              </svg>
              <span className="text-[10px] font-bold text-slate-600">Medical</span>
            </div>

            {/* Food */}
            <div
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                shelter.amenities.food
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-slate-50/50 border-slate-100 opacity-50'
              }`}
            >
              <UtensilsCrossed className="w-6 h-6 text-primary" />
              <span className="text-[10px] font-bold text-slate-600">Food</span>
            </div>

            {/* Pet Safe */}
            <div
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                shelter.amenities.petFriendly
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-slate-50/50 border-slate-100 opacity-50'
              }`}
            >
              <Dog className="w-6 h-6 text-primary" />
              <span className="text-[10px] font-bold text-slate-600">Pet Safe</span>
            </div>

            {/* Power */}
            <div
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                shelter.amenities.power
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-slate-50/50 border-slate-100 opacity-50'
              }`}
            >
              <Zap className="w-6 h-6 text-primary" />
              <span className="text-[10px] font-bold text-slate-600">Power</span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={handleGoogleMapsNavigation}
              className="flex items-center justify-center gap-2 py-4 bg-white rounded-2xl text-[13px] font-bold text-slate-800 shadow-sm active:scale-95 transition-all border border-slate-200 hover:bg-slate-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0m7.29 12.5H13v-2h6.29c-.37 2.23-.87 3.5-1.5 4.5h2.5c1-1.35 1.5-3 1.5-5h0z"
                />
              </svg>
              Google Maps
            </button>

            <button
              onClick={handleWazeNavigation}
              className="flex items-center justify-center gap-2 py-4 bg-white rounded-2xl text-[13px] font-bold text-slate-800 shadow-sm active:scale-95 transition-all border border-slate-200 hover:bg-slate-50"
            >
              <Navigation size={18} />
              Waze
            </button>
          </div>

          {/* Verification Badge */}
          <p className="text-[10px] text-center font-bold text-slate-400 tracking-widest uppercase mb-4">
            {shelter.lastVerified ? `SHELTER DATA VERIFIED BY NADMA • ${shelter.lastVerified}` : 'SHELTER DATA VERIFIED BY NADMA'}
          </p>

          {/* Additional Details */}
          {isExpanded && (
            <div className="space-y-4 pt-4 border-t border-slate-100 mt-6">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone size={16} className="text-primary" />
                    <span>+60 3-1234-5678</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin size={16} className="text-primary" />
                    <span>{shelter.location}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-3">Capacity Status</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Current Occupancy</span>
                    <span className="font-bold text-slate-900">{shelter.occupancyPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        shelter.occupancyPercentage < 40
                          ? 'bg-green-500'
                          : shelter.occupancyPercentage < 70
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${shelter.occupancyPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShelterSelectionSheet;
