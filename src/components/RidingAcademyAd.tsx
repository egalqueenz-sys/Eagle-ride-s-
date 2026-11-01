import React, { useState } from 'react';
import { Language } from '../types';
import {
  GraduationCap,
  Sparkles,
  Phone,
  MessageCircle,
  CheckCircle,
  ShieldCheck,
  Calendar,
  Clock,
  ArrowRight,
  BadgeCheck,
} from 'lucide-react';

interface RidingAcademyAdProps {
  lang: Language;
  onOpenDetails: () => void;
}

export const RidingAcademyAd: React.FC<RidingAcademyAdProps> = ({ lang, onOpenDetails }) => {
  const whatsappEnrollUrl = `https://wa.me/923247150585?text=${encodeURIComponent(
    "Assalam-o-Alaikum Eagle Women's Ride! I want to enroll in the Women Bike & Scooty Riding Training Course in Multan (Course Fee: PKR 2,000). Please share details & class timings."
  )}`;

  return (
    <div className="relative rounded-3xl bg-gradient-to-r from-pink-900 via-rose-900 to-amber-950 text-white p-5 sm:p-6 shadow-2xl border-2 border-amber-400/70 overflow-hidden my-6">
      {/* Decorative Glow */}
      <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-amber-500/20 blur-2xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Text & Offer */}
        <div className="space-y-3 text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black tracking-wide shadow-sm">
            <GraduationCap className="w-4 h-4 text-slate-950" />
            <span>
              {lang === 'ur'
                ? 'ایگل ویمنز رائیڈنگ اکیڈمی ملتان'
                : 'EAGLE WOMEN RIDING ACADEMY'}
            </span>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {lang === 'ur'
                ? 'بائیک اور اسکوٹی چلانا سیکھیں – مکمل ٹریننگ کورس'
                : 'Learn to Ride Bike & Scooty – Women Riding Course'}
            </h3>
            <p className="text-xs sm:text-sm text-pink-200 mt-1 font-medium">
              {lang === 'ur'
                ? 'لیڈی انسٹرکٹر کی زیر نگرانی محفوظ ماحول میں بائیک اور اسکوٹی ڈرائیونگ سیکھیں۔ خود مختار اور بااعتماد بنیں!'
                : 'Learn confident, safe two-wheeler riding under certified female instructors in Multan. Become independent & free!'}
            </p>
          </div>

          {/* Highlights */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-amber-300">
              <BadgeCheck className="w-4 h-4 text-amber-400" />
              {lang === 'ur' ? '100% لیڈی ٹرینرز' : '100% Female Instructors'}
            </span>
            <span className="flex items-center gap-1.5 text-pink-200">
              <ShieldCheck className="w-4 h-4 text-pink-400" />
              {lang === 'ur' ? 'ہیلمٹ اور سیفٹی گیئر فراہم' : 'Safety Gear & Helmet Provided'}
            </span>
            <span className="flex items-center gap-1.5 text-emerald-300">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              {lang === 'ur' ? 'ڈرائیونگ لائسنس ٹیسٹ رہنمائی' : 'Licence Test Preparation'}
            </span>
          </div>
        </div>

        {/* Right: Fee Card & Actions */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-amber-300/40 text-center shrink-0 w-full md:w-auto min-w-[260px] space-y-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block">
              {lang === 'ur' ? 'مکمل کورس فیس' : 'Full Course Fee'}
            </span>
            <div className="text-3xl font-black font-mono text-amber-400 mt-0.5">
              PKR 2,000
            </div>
            <span className="text-[10px] text-pink-200 font-medium block">
              {lang === 'ur' ? 'صرف دو ہزار روپے (کوئی اضافی چارجز نہیں)' : 'One-time Flat Fee · Multan'}
            </span>
          </div>

          <div className="space-y-2">
            <a
              href={whatsappEnrollUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-200" />
              <span>{lang === 'ur' ? 'واٹس ایپ پر داخلہ لیں' : 'Enroll on WhatsApp'}</span>
            </a>

            <div className="flex gap-2">
              <a
                href="tel:03247150585"
                className="flex-1 py-2 px-2.5 rounded-xl bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-amber-300" />
                <span>03247150585</span>
              </a>

              <button
                onClick={onOpenDetails}
                className="flex-1 py-2 px-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-amber-300 font-bold text-xs flex items-center justify-center gap-1 transition-all border border-white/20"
              >
                <span>{lang === 'ur' ? 'تفصیلات' : 'Details'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
