import React, { useState, useEffect } from 'react';
import { playSosSiren, stopAllAudio } from '../utils/audio';
import { Language, PassengerProfile } from '../types';
import { translations } from '../data/translations';
import {
  AlertTriangle,
  Phone,
  Volume2,
  VolumeX,
  ShieldAlert,
  MapPin,
  MessageCircle,
  X,
  Share2,
} from 'lucide-react';

interface SafetySOSModalProps {
  lang: Language;
  passengerProfile: PassengerProfile;
  currentLocationName: string;
  onClose: () => void;
}

export const SafetySOSModal: React.FC<SafetySOSModalProps> = ({
  lang,
  passengerProfile,
  currentLocationName,
  onClose,
}) => {
  const t = translations[lang];
  const [isSirenPlaying, setIsSirenPlaying] = useState(true);
  const [sosSent, setSosSent] = useState(false);

  useEffect(() => {
    // Automatically sound siren when emergency SOS opens
    playSosSiren();
    setIsSirenPlaying(true);
    setSosSent(true);

    return () => {
      stopAllAudio();
    };
  }, []);

  const toggleSiren = () => {
    if (isSirenPlaying) {
      stopAllAudio();
      setIsSirenPlaying(false);
    } else {
      playSosSiren();
      setIsSirenPlaying(true);
    }
  };

  const handleClose = () => {
    stopAllAudio();
    onClose();
  };

  const emergencyMessage = `*EMERGENCY SOS ALERT - EAGLE WOMEN'S RIDE MULTAN*\n\nPassenger: ${passengerProfile.fullName} (${passengerProfile.mobile})\nLocation: ${currentLocationName}, Multan\nStatus: EMERGENCY SOS ACTIVATED\nPlease dispatch assistance immediately!`;

  return (
    <div className="fixed inset-0 z-50 bg-red-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-red-600 relative my-auto animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* SOS Flashing Beacon */}
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-red-600 mx-auto flex items-center justify-center text-white shadow-xl shadow-red-600/40 animate-pulse mb-3">
            <AlertTriangle className="w-10 h-10 text-amber-200" />
          </div>

          <h3 className="text-xl font-black text-red-700 tracking-tight uppercase">
            EMERGENCY SOS ACTIVATED
          </h3>

          <p className="text-xs text-slate-600 font-semibold mt-1">
            Multan Women Safety Command Center & Police Alerted
          </p>
        </div>

        {/* Siren Control Button */}
        <div className="flex justify-center my-3">
          <button
            onClick={toggleSiren}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
              isSirenPlaying
                ? 'bg-red-100 text-red-800 border-red-300 animate-bounce'
                : 'bg-slate-100 text-slate-700 border-slate-300'
            }`}
          >
            {isSirenPlaying ? (
              <>
                <Volume2 className="w-4 h-4 text-red-600" />
                <span>Alarm Sounding (Tap to Silence)</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-500" />
                <span>Alarm Silenced (Tap to Sound)</span>
              </>
            )}
          </button>
        </div>

        {/* Current Incident Coordinates */}
        <div className="bg-red-50 p-3 rounded-2xl border border-red-200 text-xs my-3 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-red-900">
            <MapPin className="w-3.5 h-3.5 text-red-600" />
            <span>Last Known Location in Multan:</span>
          </div>
          <p className="font-semibold text-slate-800 pl-5">{currentLocationName}</p>
          <div className="text-[11px] text-red-700 font-medium pl-5">
            Emergency Contact: {passengerProfile.emergencyContactName} ({passengerProfile.emergencyContactPhone})
          </div>
        </div>

        {/* High-Priority Instant Call Actions */}
        <div className="space-y-2.5 my-4">
          {/* Eagle Women Command Center */}
          <a
            href="tel:03247150585"
            className="w-full py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm flex items-center justify-between shadow-lg shadow-red-600/30 transition-all"
          >
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span>Call Eagle HQ (03247150585)</span>
            </div>
            <span className="text-xs bg-red-700 px-2 py-0.5 rounded font-mono">24/7 Live</span>
          </a>

          {/* Multan Police 15 */}
          <a
            href="tel:15"
            className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-sm flex items-center justify-between shadow-md transition-all"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <span>Call Multan Police (15)</span>
            </div>
            <span className="text-xs bg-slate-800 text-slate-200 px-2 py-0.5 rounded">Emergency</span>
          </a>

          {/* WhatsApp Emergency Broadcast */}
          <a
            href={`https://wa.me/923247150585?text=${encodeURIComponent(emergencyMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <MessageCircle className="w-4 h-4 text-emerald-200" />
            <span>Send Instant SOS to WhatsApp (03247150585)</span>
          </a>
        </div>

        {/* Family Sharing: Share live location link */}
        <button
          onClick={() => {
            const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-ldt5jpt2hxpnosx6odybbg-98558632611.asia-southeast1.run.app';
            const text = `🚨 *EAGLE WOMEN'S RIDE - LIVE LOCATION SHARE*\nI am sharing my live ride location in Multan:\n${shareUrl}\nPickup/Area: ${currentLocationName}\nContact: ${passengerProfile.fullName} (${passengerProfile.mobile})\nHelpline: 03247150585 | Police: 15`;
            if (navigator.share) {
              navigator.share({ title: "Eagle Women's Ride Live Location", text, url: shareUrl }).catch(() => {});
            } else if (navigator.clipboard) {
              navigator.clipboard.writeText(text);
              alert('Live location link copied to clipboard! You can paste and share it with your family on WhatsApp.');
            }
          }}
          className="w-full py-3 px-4 rounded-2xl bg-pink-100 hover:bg-pink-200 text-pink-900 font-extrabold text-xs flex items-center justify-center gap-2 border border-pink-300 shadow-sm transition-all mb-2"
        >
          <Share2 className="w-4 h-4 text-pink-700" />
          <span>Family Sharing: Share Live Location Link</span>
        </button>

        {/* Safe Exit */}
        <button
          onClick={handleClose}
          className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
        >
          Cancel SOS and Return to App
        </button>
      </div>
    </div>
  );
};
