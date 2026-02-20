import React, { useState } from 'react';
import { Mail, Phone, MapPin, ChevronDown, ArrowLeft } from 'lucide-react';

interface PersonalDetailsScreenProps {
  onBack: () => void;
  onNext: (data: PersonalDetailsData) => void;
  isLoading?: boolean;
}

interface PersonalDetailsData {
  identityType: 'local' | 'international';
  icNumber?: string;
  passportNumber?: string;
  fullName: string;
  countryOfOrigin?: string;
  email: string;
  phoneNumber: string;
  address: string;
}

// Fallback list if Intl.supportedValuesOf is unavailable.
const FALLBACK_COUNTRIES = [
  { code: 'AF', name: 'Afghanistan' },
  { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'AS', name: 'American Samoa' },
  { code: 'AD', name: 'Andorra' },
  { code: 'AO', name: 'Angola' },
  { code: 'AG', name: 'Antigua and Barbuda' },
  { code: 'AR', name: 'Argentina' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AW', name: 'Aruba' },
  { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'BS', name: 'Bahamas' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'BB', name: 'Barbados' },
  { code: 'BY', name: 'Belarus' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BZ', name: 'Belize' },
  { code: 'BJ', name: 'Benin' },
  { code: 'BM', name: 'Bermuda' },
  { code: 'BT', name: 'Bhutan' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'BA', name: 'Bosnia and Herzegovina' },
  { code: 'BW', name: 'Botswana' },
  { code: 'BR', name: 'Brazil' },
  { code: 'BN', name: 'Brunei' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' },
  { code: 'KH', name: 'Cambodia' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'CA', name: 'Canada' },
  { code: 'CV', name: 'Cape Verde' },
  { code: 'KY', name: 'Cayman Islands' },
  { code: 'CF', name: 'Central African Republic' },
  { code: 'TD', name: 'Chad' },
  { code: 'CL', name: 'Chile' },
  { code: 'CN', name: 'China' },
  { code: 'CO', name: 'Colombia' },
  { code: 'KM', name: 'Comoros' },
  { code: 'CG', name: 'Congo' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'HR', name: 'Croatia' },
  { code: 'CU', name: 'Cuba' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'DK', name: 'Denmark' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'DM', name: 'Dominica' },
  { code: 'DO', name: 'Dominican Republic' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'EG', name: 'Egypt' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'GQ', name: 'Equatorial Guinea' },
  { code: 'ER', name: 'Eritrea' },
  { code: 'EE', name: 'Estonia' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'FK', name: 'Falkland Islands' },
  { code: 'FO', name: 'Faroe Islands' },
  { code: 'FJ', name: 'Fiji' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'GF', name: 'French Guiana' },
  { code: 'PF', name: 'French Polynesia' },
  { code: 'GA', name: 'Gabon' },
  { code: 'GM', name: 'Gambia' },
  { code: 'GE', name: 'Georgia' },
  { code: 'DE', name: 'Germany' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GI', name: 'Gibraltar' },
  { code: 'GR', name: 'Greece' },
  { code: 'GL', name: 'Greenland' },
  { code: 'GD', name: 'Grenada' },
  { code: 'GP', name: 'Guadeloupe' },
  { code: 'GU', name: 'Guam' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'GG', name: 'Guernsey' },
  { code: 'GN', name: 'Guinea' },
  { code: 'GW', name: 'Guinea-Bissau' },
  { code: 'GY', name: 'Guyana' },
  { code: 'HT', name: 'Haiti' },
  { code: 'HN', name: 'Honduras' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IS', name: 'Iceland' },
  { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'IR', name: 'Iran' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IM', name: 'Isle of Man' },
  { code: 'IL', name: 'Israel' },
  { code: 'IT', name: 'Italy' },
  { code: 'CI', name: 'Ivory Coast' },
  { code: 'JM', name: 'Jamaica' },
  { code: 'JP', name: 'Japan' },
  { code: 'JE', name: 'Jersey' },
  { code: 'JO', name: 'Jordan' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'KE', name: 'Kenya' },
  { code: 'KI', name: 'Kiribati' },
  { code: 'KP', name: 'Korea, North' },
  { code: 'KR', name: 'Korea, South' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'KG', name: 'Kyrgyzstan' },
  { code: 'LA', name: 'Laos' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'LS', name: 'Lesotho' },
  { code: 'LR', name: 'Liberia' },
  { code: 'LY', name: 'Libya' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MO', name: 'Macao' },
  { code: 'MK', name: 'Macedonia' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MW', name: 'Malawi' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'MV', name: 'Maldives' },
  { code: 'ML', name: 'Mali' },
  { code: 'MT', name: 'Malta' },
  { code: 'MH', name: 'Marshall Islands' },
  { code: 'MQ', name: 'Martinique' },
  { code: 'MR', name: 'Mauritania' },
  { code: 'MU', name: 'Mauritius' },
  { code: 'YT', name: 'Mayotte' },
  { code: 'MX', name: 'Mexico' },
  { code: 'FM', name: 'Micronesia' },
  { code: 'MD', name: 'Moldova' },
  { code: 'MC', name: 'Monaco' },
  { code: 'MN', name: 'Mongolia' },
  { code: 'ME', name: 'Montenegro' },
  { code: 'MA', name: 'Morocco' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'NA', name: 'Namibia' },
  { code: 'NR', name: 'Nauru' },
  { code: 'NP', name: 'Nepal' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NC', name: 'New Caledonia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'NU', name: 'Niue' },
  { code: 'MP', name: 'Northern Mariana Islands' },
  { code: 'NO', name: 'Norway' },
  { code: 'OM', name: 'Oman' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'PW', name: 'Palau' },
  { code: 'PS', name: 'Palestine' },
  { code: 'PA', name: 'Panama' },
  { code: 'PG', name: 'Papua New Guinea' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Peru' },
  { code: 'PH', name: 'Philippines' },
  { code: 'PN', name: 'Pitcairn' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'QA', name: 'Qatar' },
  { code: 'RE', name: 'Reunion' },
  { code: 'RO', name: 'Romania' },
  { code: 'RU', name: 'Russia' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'KN', name: 'Saint Kitts and Nevis' },
  { code: 'LC', name: 'Saint Lucia' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines' },
  { code: 'WS', name: 'Samoa' },
  { code: 'SM', name: 'San Marino' },
  { code: 'ST', name: 'Sao Tome and Principe' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SN', name: 'Senegal' },
  { code: 'RS', name: 'Serbia' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'SG', name: 'Singapore' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'SB', name: 'Solomon Islands' },
  { code: 'SO', name: 'Somalia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'SS', name: 'South Sudan' },
  { code: 'ES', name: 'Spain' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'SD', name: 'Sudan' },
  { code: 'SR', name: 'Suriname' },
  { code: 'SZ', name: 'Swaziland' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SY', name: 'Syria' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'TJ', name: 'Tajikistan' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'TH', name: 'Thailand' },
  { code: 'TL', name: 'Timor-Leste' },
  { code: 'TG', name: 'Togo' },
  { code: 'TK', name: 'Tokelau' },
  { code: 'TO', name: 'Tonga' },
  { code: 'TT', name: 'Trinidad and Tobago' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'TM', name: 'Turkmenistan' },
  { code: 'TV', name: 'Tuvalu' },
  { code: 'UG', name: 'Uganda' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'VU', name: 'Vanuatu' },
  { code: 'VA', name: 'Vatican City' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'VG', name: 'Virgin Islands, British' },
  { code: 'VI', name: 'Virgin Islands, U.S.' },
  { code: 'WF', name: 'Wallis and Futuna' },
  { code: 'EH', name: 'Western Sahara' },
  { code: 'YE', name: 'Yemen' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' },
];

const getCountryOptions = () => {
  if (typeof Intl !== 'undefined' && 'supportedValuesOf' in Intl) {
    const regions = (Intl as unknown as { supportedValuesOf: (key: string) => string[] }).supportedValuesOf('region');
    const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });

    return regions
      .map((code) => ({ code, name: displayNames.of(code) ?? code }))
      .filter((country) => country.name && country.name !== country.code)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  return FALLBACK_COUNTRIES;
};

const COUNTRIES = getCountryOptions();

export const PersonalDetailsScreen: React.FC<PersonalDetailsScreenProps> = ({
  onBack,
  onNext,
  isLoading = false,
}) => {
  const [identityType, setIdentityType] = useState<'local' | 'international'>('local');
  const [icNumber, setIcNumber] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [countryOfOrigin, setCountryOfOrigin] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateEmail = (emailValue: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    return phone.length >= 10 && /^\d+[-\s]?\d+/.test(phone);
  };

  const isEmailValid = validateEmail(email);
  const isPhoneValid = validatePhoneNumber(phoneNumber);
  const isFormValid = 
    fullName.trim() &&
    email.trim() &&
    phoneNumber.trim() &&
    address.trim() &&
    isEmailValid &&
    isPhoneValid &&
    (identityType === 'local' 
      ? icNumber.trim() && icNumber.length === 12
      : passportNumber.trim() && countryOfOrigin);

  const handleNextClick = () => {
    if (isFormValid) {
      const formData: PersonalDetailsData = {
        identityType,
        fullName,
        email,
        phoneNumber,
        address,
        ...(identityType === 'local' && { icNumber }),
        ...(identityType === 'international' && { passportNumber, countryOfOrigin }),
      };
      onNext(formData);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-2 md:p-6">
      <div className="w-full max-w-[390px] h-screen md:h-[900px] md:max-h-[90vh] bg-white md:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative border border-slate-200">
      {/* Header */}
      <header className="flex-none px-6 pt-8 pb-5 bg-white sticky top-0 z-30 border-b border-slate-100">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors group"
            aria-label="Go back"
          >
            <ArrowLeft className="text-slate-400 group-hover:text-primary transition-colors" size={24} />
          </button>
          <div className="flex gap-1.5">
            <div className="h-1.5 w-8 bg-primary rounded-full transition-all duration-300"></div>
            <div className="h-1.5 w-2 bg-slate-200 rounded-full transition-all duration-300"></div>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-dark-navy">Personal Details</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Provide your basic identification for government data synchronization.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 pb-10">
        {/* Identity Type Toggle */}
        <div className="bg-slate-50 p-1 rounded-2xl flex items-center mb-8 border border-slate-100 mt-6">
          <button
            onClick={() => setIdentityType('local')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
              identityType === 'local'
                ? 'bg-white text-primary shadow-sm border border-slate-100'
                : 'text-slate-400 hover:text-slate-600'
            }`}
            type="button"
          >
            Local Citizen
          </button>
          <button
            onClick={() => setIdentityType('international')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
              identityType === 'international'
                ? 'bg-white text-primary shadow-sm border border-slate-100'
                : 'text-slate-400 hover:text-slate-600'
            }`}
            type="button"
          >
            International
          </button>
        </div>

        {/* Form Fields */}
        <form className="space-y-5">
          {/* Local Citizen Fields */}
          {identityType === 'local' && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">
                  IC Number (12 Digits)
                </label>
                <input
                  type="text"
                  value={icNumber}
                  onChange={(e) => setIcNumber(e.target.value.toUpperCase())}
                  onBlur={() => setTouched({ ...touched, icNumber: true })}
                  placeholder="E.g. 900101015522"
                  className={`w-full rounded-xl py-3.5 px-4 text-sm font-medium transition-all border ${
                    touched.icNumber && icNumber && icNumber.length < 12
                      ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300'
                      : 'border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary focus:border-primary'
                  } outline-none`}
                />
              </div>
            </div>
          )}

          {/* International Fields */}
          {identityType === 'international' && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">
                  Passport Number
                </label>
                <input
                  type="text"
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
                  onBlur={() => setTouched({ ...touched, passportNumber: true })}
                  placeholder="Enter passport number"
                  className="w-full rounded-xl border-slate-200 bg-slate-50 py-3.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">
                  Country of Origin
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={countryOfOrigin}
                    onChange={(e) => setCountryOfOrigin(e.target.value)}
                    onBlur={() => setTouched({ ...touched, country: true })}
                    list="country-options"
                    placeholder="Select or type your country"
                    className="w-full rounded-xl border-slate-200 bg-slate-50 py-3.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none pr-10"
                  />
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={20}
                  />
                  <datalist id="country-options">
                    {COUNTRIES.map((country) => (
                      <option key={country.code} value={country.name} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>
          )}

          {/* Full Name Field (Common) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">
              Full Name (As per {identityType === 'local' ? 'MyKad' : 'Passport'})
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onBlur={() => setTouched({ ...touched, fullName: true })}
              placeholder={identityType === 'local' ? 'Enter your full name as shown on MyKad' : 'Enter full name'}
              className="w-full rounded-xl border-slate-200 bg-slate-50 py-3.5 px-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none border"
            />
          </div>

          {/* Email Field (Common) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">
              Email Address
            </label>
            <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all ${
              touched.email && email && !isEmailValid
                ? 'border-red-400 bg-red-50'
                : 'border-slate-200 bg-slate-50'
            } focus-within:ring-2 ${
              touched.email && email && !isEmailValid
                ? 'focus-within:ring-red-300'
                : 'focus-within:ring-primary'
            }`}>
              <Mail className="text-slate-400 flex-shrink-0" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched({ ...touched, email: true })}
                placeholder="name@example.com"
                className="flex-1 bg-transparent text-sm outline-none"
              />
            </div>
            {touched.email && email && !isEmailValid && (
              <p className="text-xs text-red-600">Invalid email format</p>
            )}
          </div>

          {/* Phone Number Field (Common) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">
              Active Phone Number
            </label>
            <div className="flex gap-2">
              <div className="w-20 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-sm font-medium text-slate-600">
                +60
              </div>
              <div className="flex-1 relative">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onBlur={() => setTouched({ ...touched, phone: true })}
                  placeholder="12-345 6789"
                  className={`w-full rounded-xl py-3.5 px-4 pl-10 text-sm transition-all border outline-none focus:ring-2 ${
                    touched.phone && phoneNumber && !isPhoneValid
                      ? 'border-red-400 bg-red-50 focus:ring-red-300'
                      : 'border-slate-200 bg-slate-50 focus:ring-primary focus:border-primary'
                  }`}
                />
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              </div>
            </div>
            {touched.phone && phoneNumber && !isPhoneValid && (
              <p className="text-xs text-red-600">Invalid phone number format</p>
            )}
          </div>

          {/* Residential Address (Common) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">
              Residential Address
            </label>
            <div className="relative">
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onBlur={() => setTouched({ ...touched, address: true })}
                placeholder="Unit, Street, Area in Malaysia"
                className="w-full rounded-xl border-slate-200 bg-slate-50 py-3.5 pl-4 pr-12 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none border resize-none min-h-[100px]"
              />
              <button
                type="button"
                className="absolute right-3 top-4 text-primary hover:bg-blue-50 p-1.5 rounded-lg transition-colors"
              >
                <MapPin size={20} />
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* Footer with Security Badge */}
      <footer className="flex-none px-6 py-6 bg-white border-t border-slate-100">
        <button
          onClick={handleNextClick}
          disabled={!isFormValid || isLoading}
          className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 group ${
            isFormValid
              ? 'bg-primary text-white shadow-xl shadow-blue-900/20 hover:bg-blue-800 active:scale-[0.98]'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          NEXT: EMERGENCY & MEDICAL
          <ChevronDown className="group-hover:translate-x-1 transition-transform rotate-270" size={20} />
        </button>
        <div className="flex items-center justify-center gap-2 mt-4 opacity-70">
          <div className="w-4 h-4 rounded-full bg-trust-green flex items-center justify-center">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
            Secure Government-Linked Sync
          </span>
        </div>
      </footer>
      </div>
    </div>
  );
};
