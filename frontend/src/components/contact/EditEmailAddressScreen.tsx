import { useState } from 'react';
import {
  ArrowLeft,
  Home,
  Map,
  Megaphone,
  User,
} from 'lucide-react';

interface EditEmailAddressScreenProps {
  onBack?: () => void;
  onSave?: (email: string) => void;
  onNavigate?: (screen: string) => void;
  initialEmail?: string;
}

export function EditEmailAddressScreen({
  onBack,
  onSave,
  onNavigate,
  initialEmail = 'amirul.hafiz@example.com',
}: EditEmailAddressScreenProps) {
  const [email, setEmail] = useState(initialEmail);

  const handleSave = () => {
    onSave?.(email.trim());
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-4 font-display text-dark-text">
      <div className="w-[400px] h-[824px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-slate-200">
        <header className="flex-none pt-12 px-6 pb-4 bg-white sticky top-0 z-30 flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Edit Email Address</h1>
        </header>

        <div className="flex-1 overflow-y-auto px-6 pt-6 pb-10 no-scrollbar">
          <div className="space-y-6">
            <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm">
              <label
                htmlFor="email"
                className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2"
              >
                New Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-5 text-slate-900 font-medium focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                  <span className="material-symbols-outlined">email</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50/50 border border-blue-100/50 rounded-2xl p-4 flex gap-3">
              <span className="material-symbols-outlined text-primary">info</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                You will need to verify your new email address to receive official bulletins.
              </p>
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-primary hover:bg-blue-900 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-all"
            >
              SAVE CHANGES
            </button>
          </div>
        </div>

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

          <div className="flex flex-col items-center gap-1 -mt-10">
            <button className="w-16 h-16 bg-primary rounded-full shadow-2xl shadow-blue-900/40 flex items-center justify-center text-white ring-[6px] ring-white active:scale-95 transition-transform font-black text-lg tracking-tighter hover:bg-blue-900">
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

export default EditEmailAddressScreen;
