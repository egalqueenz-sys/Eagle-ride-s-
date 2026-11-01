import React from 'react';
import { Phone, MessageCircle, AlertTriangle, LifeBuoy } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface SupportHotbarProps {
  lang: Language;
  onOpenSos: () => void;
  onOpenHelp: () => void;
  variant?: 'floating' | 'banner' | 'compact';
}

export const SupportHotbar: React.FC<SupportHotbarProps> = ({
  lang,
  onOpenSos,
  onOpenHelp,
  variant = 'banner',
}) => {
  const t = translations[lang];

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1.5 shrink-0">
        <a
          href="tel:03247150585"
          className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-pink-100 text-pink-800 hover:bg-pink-200 border border-pink-300 flex items-center gap-1 transition-all"
          title="Call 03247150585"
        >
          <Phone className="w-3.5 h-3.5 text-pink-700" />
          <span className="hidden sm:inline">03247150585</span>
        </a>

        <a
          href="https://wa.me/923247150585?text=Assalam-o-Alaikum%20Eagle%20Women's%20Ride%20Support!%20I%20need%20assistance."
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-100 text-emerald-900 hover:bg-emerald-200 border border-emerald-300 flex items-center gap-1 transition-all"
          title="WhatsApp 03247150585"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>

        <button
          onClick={onOpenSos}
          className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-sm flex items-center gap-1 animate-pulse"
          title="Emergency SOS Multan"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>SOS</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-pink-900 via-rose-900 to-amber-950 text-white px-3 py-2 border-b border-amber-500/30 shadow-sm">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Support Phone & WhatsApp */}
        <div className="flex items-center gap-3">
          <span className="font-semibold text-amber-300 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            24/7 Multan Women Helpdesk:
          </span>

          <a
            href="tel:03247150585"
            className="font-bold text-white hover:text-amber-200 flex items-center gap-1 underline underline-offset-2 transition-colors"
          >
            <Phone className="w-3 h-3 text-pink-300" />
            <span>03247150585</span>
          </a>

          <a
            href="https://wa.me/923247150585?text=Assalam-o-Alaikum%20Eagle%20Women's%20Ride!%20Need%20immediate%20ride%20help."
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-emerald-300 hover:text-emerald-200 flex items-center gap-1 transition-colors"
          >
            <MessageCircle className="w-3 h-3" />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={onOpenHelp}
            className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center gap-1 font-medium transition-colors"
          >
            <LifeBuoy className="w-3 h-3 text-amber-300" />
            <span>Help & Complaints</span>
          </button>

          <button
            onClick={onOpenSos}
            className="px-3 py-1 rounded bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold flex items-center gap-1.5 shadow-md shadow-red-950/40 uppercase tracking-wider"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-200 animate-bounce" />
            <span>EMERGENCY SOS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
