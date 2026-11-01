import React from 'react';
import { BrandLogo } from './BrandLogo';
import { Language, UserRole } from '../types';
import { Phone, ShieldCheck, Moon, Sun, Smartphone } from 'lucide-react';
import { getCurrentPktTime } from '../utils/pktTime';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  lang: Language;
  onLangToggle: () => void;
  onOpenSos: () => void;
  onOpenAndroidModal: () => void;
  nightCurfewHour?: number;
  morningStartHour?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  lang,
  onLangToggle,
  onOpenSos,
  onOpenAndroidModal,
  nightCurfewHour = 22,
  morningStartHour = 6,
}) => {
  const pktTime = getCurrentPktTime(morningStartHour, nightCurfewHour);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <BrandLogo size="md" showTagline={false} />
        </div>

        {/* Zone 2: Navigation / Roles */}
        <nav className="flex items-center gap-1 sm:gap-2 bg-rose-50/70 p-1 rounded-xl border border-rose-200/60 overflow-x-auto">
          <button
            onClick={() => onRoleChange('passenger')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              currentRole === 'passenger'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-pink-700'
            }`}
          >
            {lang === 'ur' ? 'مسافر ایپ' : 'Passenger App'}
          </button>

          <button
            onClick={() => onRoleChange('driver')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1 ${
              currentRole === 'driver'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-pink-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>{lang === 'ur' ? 'ڈرائیور پورٹل' : 'Driver Portal'}</span>
          </button>

          <button
            onClick={() => onRoleChange('admin')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              currentRole === 'admin'
                ? 'bg-slate-900 text-amber-400 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'ur' ? 'ایڈمن' : 'Admin'}
          </button>
        </nav>

        {/* Zone 3: Actions (Urdu toggle, Android app, Support) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={onOpenAndroidModal}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-xs font-bold text-pink-900 bg-pink-100 hover:bg-pink-200 rounded-lg border border-pink-300 shadow-xs transition-all whitespace-nowrap"
            title="Download Android APK / Install App"
          >
            <Smartphone className="w-3.5 h-3.5 text-pink-700 animate-pulse" />
            <span>{lang === 'ur' ? 'APK ڈاؤنلوڈ' : 'Download APK'}</span>
          </button>

          <button
            onClick={onLangToggle}
            className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-pink-200 bg-white hover:bg-pink-50 text-pink-900 transition-colors whitespace-nowrap shadow-xs"
            title="Switch Language / زبان تبدیل کریں"
          >
            {lang === 'en' ? 'اردو (Urdu)' : 'English'}
          </button>

          <a
            href="tel:03247150585"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-pink-700 hover:bg-pink-800 text-white shadow-xs transition-colors whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5 text-amber-300" />
            <span>03247150585</span>
          </a>
        </div>
      </div>

      {/* PKT Real-time Curfew Status Bar */}
      <div className={`px-4 py-1 text-[11px] font-medium flex items-center justify-between border-t ${
        pktTime.isNightCurfewActive
          ? 'bg-red-950 text-red-200 border-red-800'
          : 'bg-amber-500/10 text-amber-900 border-amber-200/50'
      }`}>
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            {pktTime.isNightCurfewActive ? (
              <Moon className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            )}
            <span className="font-semibold">
              Multan PKT: {pktTime.formattedTime}
            </span>
            <span className="text-slate-400">|</span>
            <span>
              {pktTime.isNightCurfewActive
                ? 'Night Curfew Active. Operating strictly 06:00 AM – 10:00 PM PKT.'
                : 'Service Active. All trips must conclude before 10:00 PM PKT.'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-pink-700 bg-pink-100/80 px-2 py-0.5 rounded border border-pink-200">
              Women Only Transit
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
