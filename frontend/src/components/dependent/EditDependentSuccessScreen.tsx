import React, { useEffect } from 'react';
import { Home, Map, Megaphone, User } from 'lucide-react';

interface EditDependentSuccessScreenProps {
  dependentName?: string;
  onBackClick: () => void;
}

export const EditDependentSuccessScreen: React.FC<EditDependentSuccessScreenProps> = ({
  dependentName = 'Rescue Payload',
  onBackClick,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onBackClick();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onBackClick]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-4 font-display text-dark-text">
      <div className="w-[400px] h-[824px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-slate-200">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        {/* Green Checkmark Circle */}
        <div className="w-24 h-24 bg-safe-green rounded-full flex items-center justify-center mb-8 shadow-lg shadow-green-100">
          <span className="material-symbols-outlined text-white text-6xl font-bold">
            check
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4 leading-tight">
          Dependent Profile<br />Updated!
        </h1>

        {/* Description */}
        <p className="text-slate-500 text-base leading-relaxed mb-12">
          The updated <span className="font-bold text-slate-700">"{dependentName}"</span> is now synced with the National Response Cloud.
        </p>

        {/* Back Button */}
        <button
          onClick={onBackClick}
          className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 hover:bg-blue-900 active:scale-95 transition-all"
        >
          Back to Profile Dashboard
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="flex-none bg-white border-t border-slate-100 px-6 py-4 grid grid-cols-5 items-end z-30">
        <button
          onClick={onBackClick}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
        >
          <Home size={20} />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        <button
          onClick={onBackClick}
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
          onClick={onBackClick}
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
};
