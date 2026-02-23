import { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Home,
  Map,
  Megaphone,
  User,
  AlertCircle,
} from 'lucide-react';

interface EditPhoneNumberScreenProps {
  onBack?: () => void;
  onVerify?: (phoneNumber: string) => void;
  onNavigate?: (screen: string) => void;
  initialPhoneNumber?: string;
}

// Country codes for SEA and major countries that visit/reside in Malaysia
const COUNTRY_PHONE_RULES: Record<string, { name: string; minDigits: number; maxDigits: number; flag: string }> = {
  // Southeast Asia (ASEAN)
  '+60': { name: 'Malaysia', minDigits: 9, maxDigits: 10, flag: '🇲🇾' },
  '+65': { name: 'Singapore', minDigits: 8, maxDigits: 8, flag: '🇸🇬' },
  '+62': { name: 'Indonesia', minDigits: 9, maxDigits: 12, flag: '🇮🇩' },
  '+66': { name: 'Thailand', minDigits: 9, maxDigits: 9, flag: '🇹🇭' },
  '+63': { name: 'Philippines', minDigits: 10, maxDigits: 10, flag: '🇵🇭' },
  '+84': { name: 'Vietnam', minDigits: 9, maxDigits: 10, flag: '🇻🇳' },
  '+673': { name: 'Brunei', minDigits: 7, maxDigits: 7, flag: '🇧🇳' },
  '+95': { name: 'Myanmar', minDigits: 8, maxDigits: 10, flag: '🇲🇲' },
  '+855': { name: 'Cambodia', minDigits: 8, maxDigits: 9, flag: '🇰🇭' },
  '+856': { name: 'Laos', minDigits: 9, maxDigits: 10, flag: '🇱🇦' },
  '+670': { name: 'Timor-Leste', minDigits: 7, maxDigits: 8, flag: '🇹🇱' },

  // East Asia
  '+86': { name: 'China', minDigits: 11, maxDigits: 11, flag: '🇨🇳' },
  '+852': { name: 'Hong Kong', minDigits: 8, maxDigits: 8, flag: '🇭🇰' },
  '+853': { name: 'Macau', minDigits: 8, maxDigits: 8, flag: '🇲🇴' },
  '+886': { name: 'Taiwan', minDigits: 9, maxDigits: 9, flag: '🇹🇼' },
  '+81': { name: 'Japan', minDigits: 10, maxDigits: 10, flag: '🇯🇵' },
  '+82': { name: 'South Korea', minDigits: 9, maxDigits: 10, flag: '🇰🇷' },

  // South Asia
  '+91': { name: 'India', minDigits: 10, maxDigits: 10, flag: '🇮🇳' },
  '+92': { name: 'Pakistan', minDigits: 10, maxDigits: 10, flag: '🇵🇰' },
  '+880': { name: 'Bangladesh', minDigits: 10, maxDigits: 10, flag: '🇧🇩' },
  '+94': { name: 'Sri Lanka', minDigits: 9, maxDigits: 9, flag: '🇱🇰' },
  '+977': { name: 'Nepal', minDigits: 10, maxDigits: 10, flag: '🇳🇵' },

  // Oceania
  '+61': { name: 'Australia', minDigits: 9, maxDigits: 9, flag: '🇦🇺' },
  '+64': { name: 'New Zealand', minDigits: 8, maxDigits: 10, flag: '🇳🇿' },

  // Middle East (Major visitors to Malaysia)
  '+966': { name: 'Saudi Arabia', minDigits: 9, maxDigits: 9, flag: '🇸🇦' },
  '+971': { name: 'UAE', minDigits: 9, maxDigits: 9, flag: '🇦🇪' },
  '+974': { name: 'Qatar', minDigits: 8, maxDigits: 8, flag: '🇶🇦' },
  '+973': { name: 'Bahrain', minDigits: 8, maxDigits: 8, flag: '🇧🇭' },
  '+965': { name: 'Kuwait', minDigits: 8, maxDigits: 8, flag: '🇰🇼' },
  '+968': { name: 'Oman', minDigits: 8, maxDigits: 8, flag: '🇴🇲' },
  '+962': { name: 'Jordan', minDigits: 9, maxDigits: 9, flag: '🇯🇴' },
  '+961': { name: 'Lebanon', minDigits: 7, maxDigits: 8, flag: '🇱🇧' },
  '+90': { name: 'Turkey', minDigits: 10, maxDigits: 10, flag: '🇹🇷' },

  // Europe (Major countries)
  '+44': { name: 'United Kingdom', minDigits: 10, maxDigits: 10, flag: '🇬🇧' },
  '+33': { name: 'France', minDigits: 9, maxDigits: 9, flag: '🇫🇷' },
  '+49': { name: 'Germany', minDigits: 10, maxDigits: 11, flag: '🇩🇪' },
  '+39': { name: 'Italy', minDigits: 9, maxDigits: 10, flag: '🇮🇹' },
  '+34': { name: 'Spain', minDigits: 9, maxDigits: 9, flag: '🇪🇸' },
  '+31': { name: 'Netherlands', minDigits: 9, maxDigits: 9, flag: '🇳🇱' },
  '+41': { name: 'Switzerland', minDigits: 9, maxDigits: 9, flag: '🇨🇭' },
  '+7': { name: 'Russia', minDigits: 10, maxDigits: 10, flag: '🇷🇺' },

  // Americas
  '+1': { name: 'USA/Canada', minDigits: 10, maxDigits: 10, flag: '🇺🇸' },

  // Africa (Common visitors)
  '+27': { name: 'South Africa', minDigits: 9, maxDigits: 9, flag: '🇿🇦' },
  '+20': { name: 'Egypt', minDigits: 10, maxDigits: 10, flag: '🇪🇬' },
  '+234': { name: 'Nigeria', minDigits: 10, maxDigits: 10, flag: '🇳🇬' },
};

// Flag component using Unicode emoji flags
const FlagIcon = ({ countryCode }: { countryCode: string | null }) => {
  if (!countryCode) {
    return (
      <div className="w-6 h-4 overflow-hidden rounded-sm bg-slate-300 flex items-center justify-center">
        <span className="text-[8px] text-slate-500">?</span>
      </div>
    );
  }

  const countryData = COUNTRY_PHONE_RULES[countryCode];
  if (!countryData) {
    return (
      <div className="w-6 h-4 overflow-hidden rounded-sm bg-slate-200 flex items-center justify-center">
        <span className="text-[6px] font-bold text-slate-600">{countryCode}</span>
      </div>
    );
  }

  return (
    <div className="w-6 h-4 overflow-hidden rounded-sm flex items-center justify-center text-base leading-none">
      {countryData.flag}
    </div>
  );
};

export function EditPhoneNumberScreen({
  onBack,
  onVerify,
  onNavigate,
  initialPhoneNumber = '+60 12-345 6789',
}: EditPhoneNumberScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);

  // Validate phone number based on country code
  const validation = useMemo(() => {
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    
    // Find matching country code
    let countryCode = '';
    let countryRule = null;
    
    for (const code in COUNTRY_PHONE_RULES) {
      const codeDigits = code.replace(/\D/g, '');
      if (digitsOnly.startsWith(codeDigits)) {
        countryCode = code;
        countryRule = COUNTRY_PHONE_RULES[code];
        break;
      }
    }

    if (!countryRule) {
      return {
        isValid: false,
        error: 'Country code not recognized. Please use a valid international format (e.g., +60)',
        countryName: null,
        countryCode: null,
      };
    }

    const codeDigits = countryCode.replace(/\D/g, '');
    const numberWithoutCode = digitsOnly.substring(codeDigits.length);
    const digitCount = numberWithoutCode.length;

    if (digitCount < countryRule.minDigits) {
      return {
        isValid: false,
        error: `${countryRule.name} phone numbers require ${countryRule.minDigits === countryRule.maxDigits ? countryRule.minDigits : `${countryRule.minDigits}-${countryRule.maxDigits}`} digits (currently ${digitCount})`,
        countryName: countryRule.name,
        countryCode: countryCode,
      };
    }

    if (digitCount > countryRule.maxDigits) {
      return {
        isValid: false,
        error: `${countryRule.name} phone numbers cannot exceed ${countryRule.maxDigits} digits`,
        countryName: countryRule.name,
        countryCode: countryCode,
      };
    }

    return {
      isValid: true,
      error: null,
      countryName: countryRule.name,
      countryCode: countryCode,
    };
  }, [phoneNumber]);

  const handleVerifyAndUpdate = () => {
    if (validation.isValid) {
      onVerify?.(phoneNumber);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-4 font-display text-dark-text">
      <div className="w-full md:w-[400px] max-w-[400px] h-screen md:h-[824px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-slate-200">
        {/* Header */}
        <header className="flex-none pt-12 px-6 pb-4 bg-white backdrop-blur-md sticky top-0 z-30 flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Edit Phone Number</h1>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
          <div className="space-y-6">
            {/* Phone Input Card */}
            <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm">
              <label
                htmlFor="phone"
                className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2"
              >
                Phone Number
                {validation.countryName && (
                  <span className="ml-2 text-primary font-normal">
                    ({validation.countryName})
                  </span>
                )}
              </label>
              <div className="relative flex items-center">
                {/* Dynamic Country Flag */}
                <div className="absolute left-4 flex items-center gap-2 pointer-events-none">
                  <FlagIcon countryCode={validation.countryCode} />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={`w-full pl-14 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-medium focus:ring-2 transition-all ${
                    validation.error && phoneNumber
                      ? 'focus:ring-red-200 bg-red-50/50'
                      : 'focus:ring-primary/20'
                  }`}
                />
              </div>
              
              {/* Validation Message */}
              {validation.error && phoneNumber && (
                <div className="mt-3 flex items-start gap-2 text-hazard-red">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed">{validation.error}</p>
                </div>
              )}
              
              {!validation.error && phoneNumber && (
                <div className="mt-3 flex items-start gap-2 text-safe-green">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed">
                    Valid {validation.countryName} phone number
                  </p>
                </div>
              )}
              
              <p className="mt-4 text-xs text-light-text leading-relaxed">
                We will send a verification code to this number for security purposes.
              </p>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyAndUpdate}
              disabled={!validation.isValid}
              className={`w-full py-4 rounded-2xl font-bold text-base shadow-lg transition-all ${
                validation.isValid
                  ? 'bg-primary hover:bg-blue-900 text-white shadow-blue-900/20 active:scale-[0.98]'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              Verify &amp; Update
            </button>
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

export default EditPhoneNumberScreen;
