import { ArrowLeft, Home, Map, Megaphone, User, HelpCircle, MessageSquare, Wifi, MapPin, Cloud } from 'lucide-react';

interface HelpSupportScreenProps {
  onBack?: () => void;
  onNavigate?: (screen: string) => void;
}

export function HelpSupportScreen({ onBack, onNavigate }: HelpSupportScreenProps) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-4 font-display text-dark-navy">
      <div className="w-[400px] max-w-[400px] h-[824px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-slate-200">
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 bg-white px-6 py-6 flex items-center shadow-sm border-b border-slate-100">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-slate-900 mr-10">Help & Support</h1>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 no-scrollbar pb-32">
          {/* Interaction Hub - 2 Column Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Emergency FAQ Card */}
            <button className="bg-blue-50 border border-blue-100 p-5 rounded-3xl flex flex-col items-center text-center group cursor-pointer hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary mb-3 shadow-sm group-hover:scale-110 transition-transform">
                <HelpCircle size={24} />
              </div>
              <h3 className="text-sm font-bold text-primary">Emergency FAQ</h3>
              <p className="text-[11px] text-blue-700 mt-1">Critical help</p>
            </button>

            {/* Live Chat Card */}
            <button className="bg-emerald-50 border border-emerald-100 p-5 rounded-3xl flex flex-col items-center text-center group cursor-pointer hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 mb-3 shadow-sm group-hover:scale-110 transition-transform">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-sm font-bold text-emerald-800">Live Chat</h3>
              <p className="text-[11px] text-emerald-700 mt-1">Talk to agents</p>
            </button>
          </div>

          {/* Technical Support Section */}
          <div>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-base font-bold text-slate-900">Technical Support</h3>
              <button className="text-xs font-medium text-primary hover:text-blue-800 transition-colors">
                View All
              </button>
            </div>
            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm divide-y divide-slate-50">
              {/* Sensor Not Syncing */}
              <button className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Wifi size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">Sensor Not Syncing</p>
                    <p className="text-[11px] text-slate-600">Troubleshoot connectivity</p>
                  </div>
                </div>
                <span className="text-slate-300 text-lg">›</span>
              </button>

              {/* Address Accuracy */}
              <button className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">Address Accuracy</p>
                    <p className="text-[11px] text-slate-600">Map & GPS calibration</p>
                  </div>
                </div>
                <span className="text-slate-300 text-lg">›</span>
              </button>

              {/* Offline Mode */}
              <button className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Cloud size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">Offline Mode</p>
                    <p className="text-[11px] text-slate-600">Using cached data</p>
                  </div>
                </div>
                <span className="text-slate-300 text-lg">›</span>
              </button>
            </div>
          </div>

          {/* Authority Contacts Section */}
          <div className="bg-primary rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🌐</span>
                <h3 className="text-base font-bold">Authority Contacts</h3>
              </div>
              <div className="space-y-3">
                {/* NADMA Malaysia */}
                <a
                  href="tel:+60123456789"
                  className="flex items-center justify-between bg-white/10 p-3 rounded-xl hover:bg-white/20 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                      Disaster Management
                    </span>
                    <span className="text-sm font-bold">NADMA Malaysia</span>
                  </div>
                  <span className="text-lg">📞</span>
                </a>

                {/* BOMBA Malaysia */}
                <a
                  href="tel:+60112222222"
                  className="flex items-center justify-between bg-white/10 p-3 rounded-xl hover:bg-white/20 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                      Rescue & Fire
                    </span>
                    <span className="text-sm font-bold">BOMBA Malaysia</span>
                  </div>
                  <span className="text-lg">📞</span>
                </a>

                {/* MET Malaysia */}
                <a
                  href="#"
                  className="flex items-center justify-between bg-white/10 p-3 rounded-xl hover:bg-white/20 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                      Weather Warnings
                    </span>
                    <span className="text-sm font-bold">MET Malaysia</span>
                  </div>
                  <span className="text-lg">🌐</span>
                </a>
              </div>
            </div>
            {/* Background Decoration */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full"></div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="flex-none bg-white border-t border-slate-100 px-6 py-4 grid grid-cols-5 items-end z-30">
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

          {/* SOS Button - Centered */}
          <div className="flex flex-col items-center gap-1 -mt-10">
            <button className="w-20 h-20 bg-primary rounded-full shadow-2xl shadow-blue-900/40 flex items-center justify-center text-white ring-[6px] ring-white active:scale-95 transition-transform font-black text-2xl tracking-tighter hover:bg-blue-900">
              SOS
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
