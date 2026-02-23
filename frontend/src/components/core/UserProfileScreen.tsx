import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Home,
  Edit2,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
  AlertCircle,
  Check,
  Droplets,
  Baby,
  AlertTriangle,
  Accessibility,
  ShoppingBag,
  Map,
  Megaphone,
  User,
} from 'lucide-react';

type UserProfileData = {
  fullName?: string;
  icNumber?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  emergencyMedical?: {
    allergies?: string;
    medicalHistory?: string;
    bloodType?: string;
  };
};

interface Dependent {
  id: string;
  name: string;
  relationship: string;
  badges: string[];
  icon: string;
  color: string;
}

interface UserProfileScreenProps {

  profile?: UserProfileData; 
  dependents?: { id: string; fullName: string; relationship: string; triageTag: string }[];
  onEditEmailAddress?: () => void;
  onEditPhoneNumber?: () => void;
  onEditHomeAddress?: () => void;
  onEditMedicalProfile?: () => void;
  onAddDependent?: () => void;
  onEditDependent?: (dependentId: string) => void;
  onSettings?: () => void;
  onHelp?: () => void;
  onLogout?: () => void;
  onNavigate?: (screen: string) => void;
}

export function UserProfileScreen({
  profile,
  dependents: passedDependents,
  onEditEmailAddress,
  onEditPhoneNumber,
  onEditHomeAddress,
  onEditMedicalProfile,
  onAddDependent,
  onEditDependent,
  onSettings,
  onHelp,
  onLogout,
  onNavigate,
}: UserProfileScreenProps) {
  const getTriageColor = (triageTag: string): string => {
    const colors: { [key: string]: string } = {
      elderly: 'orange',
      child: 'green',
      'oku-physical': 'purple',
      'oku-neuro': 'purple',
    };
    return colors[triageTag] || 'blue';
  };

  const getTriageIcon = (triageTag: string): string => {
    const icons: { [key: string]: string } = {
      elderly: 'elderly',
      child: 'child',
      'oku-physical': 'wheelchair',
      'oku-neuro': 'psychology',
    };
    return icons[triageTag] || 'info';
  };

  const defaultDependents: Dependent[] = [
    {
      id: '1',
      name: 'Salmah binti Hamid',
      relationship: 'Mother',
      badges: ['Elderly (60+)', 'Limited Mobility'],
      icon: 'elderly',
      color: 'orange',
    },
    {
      id: '2',
      name: 'Aiman Hakim',
      relationship: 'Son',
      badges: ['Child (<12)'],
      icon: 'child',
      color: 'green',
    },
    {
      id: '3',
      name: 'Siti Aminah',
      relationship: 'Sister',
      badges: ['OKU (Physical)', 'Requires Meds'],
      icon: 'wheelchair',
      color: 'purple',
    },
  ];

  const dependents: Dependent[] = passedDependents 
    ? passedDependents.map(d => ({
        id: d.id,
        name: d.fullName,
        relationship: d.relationship,
        badges: [],
        icon: getTriageIcon(d.triageTag),
        color: getTriageColor(d.triageTag),
      }))
    : defaultDependents;

  const [medicalDataIncomplete] = useState(true);

  const getBadgeStyles = (color: string) => {
    const colors: { [key: string]: string } = {
      orange: 'bg-orange-50 text-orange-600 border-orange-100',
      green: 'bg-green-50 text-green-600 border-green-100',
      purple: 'bg-purple-50 text-purple-600 border-purple-100',
      blue: 'bg-blue-50 text-blue-600 border-blue-100',
      red: 'bg-red-50 text-red-600 border-red-100',
    };
    return colors[color] || colors.blue;
  };

  const getIconColor = (color: string) => {
    const colors: { [key: string]: string } = {
      orange: 'text-orange-600 bg-orange-50',
      green: 'text-green-600 bg-green-50',
      purple: 'text-purple-600 bg-purple-50',
      blue: 'text-blue-600 bg-blue-50',
      red: 'text-red-600 bg-red-50',
    };
    return colors[color] || colors.blue;
  };

  const getDependentIcon = (icon: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      elderly: <AlertTriangle size={20} />,
      child: <Baby size={20} />,
      wheelchair: <Accessibility size={20} />,
    };
    return icons[icon] || <User size={20} />;
  };

  


  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-4 font-display text-dark-text">
      <div className="w-full md:w-[400px] max-w-[400px] h-screen md:h-[824px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-slate-200">
        {/* Header */}
        <header className="flex-none px-6 pt-8 pb-4 bg-white/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between border-b border-slate-100">
          <h1 className="text-lg font-black text-slate-900">Profile</h1>
          <button
            onClick={onSettings}
            className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-primary transition-colors border border-slate-100"
          >
            <Settings size={20} />
          </button>
        </header>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto px-6 space-y-6 no-scrollbar pb-32">
          {/* Profile Card */}
          <div className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <img
                  alt="Profile"
                  className="w-16 h-16 rounded-2xl bg-slate-100 object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXD-ZQKnABmvT_3X0LwRQMMBH3hhcZTwMJ3JIpITtOjSID42VMEJB3bTIEN7mJTOFDGRc1U2PUW0J7YmVzwHYHvd3rG7O57KfmNKrGZstg5G9wm52Ab2208YlsEwc24elt1gJYGTQfr1FZQHLu64Ap8GO04c97MgdovK679JF5hsywdEB01Ux6llMVyAdWD1GLhMh9EIWo65KKiFmPAcQYMTJx1VVg2b-orTUo_G03_HZgJQIhRArg5JDjwYcTf9VSqcY3tu-SpCmv"
                />
                <div className="absolute -bottom-1 -right-1 bg-safe-green text-white rounded-full p-0.5 border-2 border-white">
                  <Check size={12} />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 leading-tight">
                  Amirul Hafiz bin Ramli
                </h2>
                <p className="text-xs font-medium text-light-text">
                  NRIC: 920512-10-5433
                </p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              {/* Phone */}
              <div className="flex items-center justify-between group">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Phone Number
                    </p>
                    <p className="text-sm font-medium text-slate-700">
                      +60 12-345 6789
                    </p>
                  </div>
                </div>
                <button
                  onClick={onEditPhoneNumber}
                  className="text-slate-300 hover:text-primary transition-colors"
                >
                  <Edit2 size={18} />
                </button>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between group">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Email Address
                    </p>
                    <p className="text-sm font-medium text-slate-700">
                      amirul.hafiz@email.com
                    </p>
                  </div>
                </div>
                <button
                  onClick={onEditEmailAddress}
                  className="text-slate-300 hover:text-primary transition-colors"
                >
                  <Edit2 size={18} />
                </button>
              </div>

              {/* Address */}
              <div className="flex items-center justify-between group">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
                    <Home size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Home Address
                    </p>
                    <p className="text-sm font-medium text-slate-700 leading-tight">
                      No. 24, Jalan Teluk Gadung 27/93, Seksyen 27, Shah Alam
                    </p>
                  </div>
                </div>
                <button
                  onClick={onEditHomeAddress}
                  className="text-slate-300 hover:text-primary transition-colors"
                >
                  <Edit2 size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Readiness Triage - Critical Warning */}
          {medicalDataIncomplete && (
            <div className="bg-white border border-red-100 rounded-[24px] overflow-hidden shadow-sm">
              <div className="bg-red-50 px-4 py-2 flex items-center gap-2">
                <AlertCircle size={14} className="text-hazard-red flex-shrink-0" />
                <span className="text-[10px] font-bold text-hazard-red uppercase tracking-wider">
                  Missing Information • Profile Not Rescue Ready
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      Medical & Special Needs
                    </h3>
                    <span className="px-1.5 py-0.5 bg-red-100 text-hazard-red text-[9px] font-black rounded uppercase">
                      Required
                    </span>
                  </div>
                  <button
                    onClick={onEditMedicalProfile}
                    className="text-slate-300 hover:text-primary transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Allergies */}
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-hazard-red">
                        <AlertTriangle size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Allergies
                        </p>
                        <p className="text-sm font-medium text-slate-300 italic">
                          e.g., Penicillin, Peanuts
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Medical History */}
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-hazard-red">
                        <ShoppingBag size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Medical History
                        </p>
                        <p className="text-sm font-medium text-slate-300 italic">
                          e.g., Asthma, Hypertension
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Blood Type */}
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-hazard-red">
                        <Droplets size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Blood Type
                        </p>
                        <p className="text-sm font-medium text-primary">
                          Select Blood Type
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Household & Dependents */}
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                Household & Dependents
              </h3>
              <p className="text-xs text-light-text leading-relaxed">
                Your household data is encrypted. This information is only shared
                with NADMA/BOMBA during active rescue operations to prioritize
                vulnerable members.
              </p>
            </div>

            {/* Add New Dependent Button */}
            <button
              onClick={onAddDependent}
              className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-primary font-bold text-sm hover:bg-slate-50 transition-colors mb-4"
            >
              <Plus size={18} />
              Add New Dependent
            </button>

            {/* Dependents List */}
            <div className="space-y-3">
              {dependents.map((dependent) => (
                <div
                  key={dependent.id}
                  className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer hover:border-primary/20 transition-colors"
                  onClick={() => onEditDependent?.(dependent.id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${getIconColor(
                        dependent.color
                      )}`}
                    >
                      {getDependentIcon(dependent.icon)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {dependent.name}
                      </h4>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {dependent.badges.map((badge, index) => (
                          <span
                            key={index}
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${getBadgeStyles(
                              dependent.color
                            )}`}
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">
                    {dependent.relationship}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Settings Menu */}
          <div className="bg-white border border-slate-100 rounded-[24px] p-2 shadow-sm">
            <button
              onClick={onSettings}
              className="w-full p-4 flex items-center justify-between text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings size={18} className="text-slate-400" />
                <span className="text-sm font-bold">App Settings</span>
              </div>
              <span className="text-slate-300">›</span>
            </button>
            <div className="h-px bg-slate-50 mx-4"></div>
            <button
              onClick={onHelp}
              className="w-full p-4 flex items-center justify-between text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <HelpCircle size={18} className="text-slate-400" />
                <span className="text-sm font-bold">Help & Support</span>
              </div>
              <span className="text-slate-300">›</span>
            </button>
            <div className="h-px bg-slate-50 mx-4"></div>
            <button
              onClick={onLogout}
              className="w-full p-4 flex items-center justify-between text-hazard-red hover:bg-red-50 rounded-2xl transition-colors mt-1"
            >
              <div className="flex items-center gap-3">
                <LogOut size={18} />
                <span className="text-sm font-bold">Log Out</span>
              </div>
            </button>
          </div>
        </main>

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

export default UserProfileScreen;
