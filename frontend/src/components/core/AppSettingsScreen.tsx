import { useState } from 'react';
import { ArrowLeft, Home, Map, Megaphone, User, Volume2, Shield, FileText } from 'lucide-react';

interface AppSettingsScreenProps {
  onBack?: () => void;
  onNavigate?: (screen: string) => void;
}

export function AppSettingsScreen({ onBack, onNavigate }: AppSettingsScreenProps) {
  const [criticalAlertsEnabled, setCriticalAlertsEnabled] = useState(true);
  const [weatherUpdatesEnabled, setWeatherUpdatesEnabled] = useState(true);
  const [systemSyncEnabled, setSystemSyncEnabled] = useState(false);

  const handleTestSOS = () => {
    // Play test SOS tone
    console.log('Testing SOS tone...');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-4 font-display text-dark-navy">
      <div className="w-[400px] max-w-[400px] h-[824px] bg-slate-50 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-slate-200">
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 bg-white px-6 py-6 flex items-center shadow-sm border-b border-slate-100">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-slate-900 mr-10">App Settings</h1>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 no-scrollbar pb-32">
          {/* Safety & Notifications Section */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Safety & Notifications</h2>
            <div className="space-y-5">
              {/* Critical Alerts Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-800">Critical Alerts</p>
                  <p className="text-[11px] text-slate-600 font-medium">High priority, bypasses Do Not Disturb</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={criticalAlertsEnabled}
                    onChange={(e) => setCriticalAlertsEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Weather Updates Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-800">Weather Updates</p>
                  <p className="text-[11px] text-slate-600 font-medium">Real-time local rainfall monitoring</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={weatherUpdatesEnabled}
                    onChange={(e) => setWeatherUpdatesEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* System Sync Reminders Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-800">System Sync Reminders</p>
                  <p className="text-[11px] text-slate-600 font-medium">Backup and device health checks</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemSyncEnabled}
                    onChange={(e) => setSystemSyncEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Test SOS Tone Button */}
              <button
                onClick={handleTestSOS}
                className="w-full mt-2 py-3 bg-slate-50 text-primary font-bold text-sm rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
              >
                <Volume2 size={18} />
                Test SOS Tone
              </button>
            </div>
          </div>

          {/* Data & Privacy Section */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Data & Privacy</h2>
            <div className="space-y-1">
              {/* Manage Encryption Keys */}
              <button className="w-full py-4 flex items-center justify-between group hover:bg-slate-50 transition-colors rounded-lg px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <Shield size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-800">Manage Encryption Keys</p>
                    <p className="text-[11px] text-slate-600">End-to-end device security</p>
                  </div>
                </div>
                <span className="text-slate-300 text-lg">›</span>
              </button>
              <div className="h-px bg-slate-50 w-full"></div>

              {/* Export Rescue Payload */}
              <button className="w-full py-4 flex items-center justify-between group hover:bg-slate-50 transition-colors rounded-lg px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-slate-200 transition-all">
                    <FileText size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-800">Export Rescue Payload (PDF)</p>
                    <p className="text-[11px] text-slate-600">Shareable medical & location data</p>
                  </div>
                </div>
                <span className="text-slate-300 text-lg">↓</span>
              </button>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center pt-4 pb-8">
            <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">BanjirSense+ v2.4.1</p>
            <p className="text-[10px] text-slate-400 mt-1 italic">Secured by National Emergency Network</p>
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
