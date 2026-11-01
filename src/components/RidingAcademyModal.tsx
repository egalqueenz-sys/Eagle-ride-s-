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
  X,
  MapPin,
  Send,
  HeartHandshake,
} from 'lucide-react';

interface RidingAcademyModalProps {
  lang: Language;
  onClose: () => void;
}

export const RidingAcademyModal: React.FC<RidingAcademyModalProps> = ({ lang, onClose }) => {
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [vehicleChoice, setVehicleChoice] = useState<'scooty' | 'bike'>('scooty');
  const [preferredSlot, setPreferredSlot] = useState<'morning' | 'evening'>('morning');
  const [registered, setRegistered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentPhone) return;

    const message = [
      `*EAGLE WOMEN RIDING ACADEMY - ADMISSION FORM*`,
      `--------------------------------------------`,
      `*Student Name:* ${studentName}`,
      `*Contact Mobile:* ${studentPhone}`,
      `*Course Selected:* Learn to Ride ${vehicleChoice === 'scooty' ? 'Scooty' : 'Commuter Bike'}`,
      `*Preferred Slot:* ${preferredSlot === 'morning' ? 'Morning (08:00 AM - 10:00 AM)' : 'Evening (04:30 PM - 06:30 PM)'}`,
      `*Course Fee:* PKR 2,000 Flat`,
      `*City:* Multan, Pakistan`,
      `--------------------------------------------`,
      `Please confirm my batch schedule & training ground location.`,
    ].join('\n');

    const whatsappUrl = `https://wa.me/923247150585?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setRegistered(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-rose-200 relative my-auto animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-pink-600 to-amber-500 text-white shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-base text-slate-900 tracking-tight">
              {lang === 'ur'
                ? 'ایگل ویمنز رائیڈنگ اکیڈمی ملتان'
                : "Eagle Women's Riding Academy"}
            </h3>
            <p className="text-xs text-pink-700 font-bold">
              {lang === 'ur'
                ? 'بائیک و اسکوٹی چلانا سیکھیں – صرف 2,000 روپے مکمل کورس'
                : 'Bike & Scooty Learning Course · PKR 2,000 Fee'}
            </p>
          </div>
        </div>

        {/* Training Highlights Card */}
        <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 p-4 rounded-2xl border border-pink-200 space-y-2.5 text-xs text-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-pink-200/60">
            <span className="font-bold text-pink-900">
              {lang === 'ur' ? 'کورس کی اہم خصوصیات:' : 'Course Features:'}
            </span>
            <span className="font-mono font-black text-sm text-pink-700 bg-white px-2 py-0.5 rounded-lg border border-pink-200">
              PKR 2,000
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-pink-600 shrink-0" />
              <span>100% لیڈی ٹرینر (Female Trainer)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-pink-600 shrink-0" />
              <span>ہیلمٹ اور گارڈز کی فراہمی</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-pink-600 shrink-0" />
              <span>بیلنس، بریکنگ اور تھروٹل کنٹرول</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-pink-600 shrink-0" />
              <span>ٹریفک لائسنس ٹیسٹ کی مکمل تیاری</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>ملتان محفوظ ٹریننگ گراؤنڈز: بوسن روڈ، گلگشت، اور کینٹ ٹریکس</span>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              {lang === 'ur' ? 'طالبہ کا مکمل نام (Student Name):' : 'Student Full Name:'}
            </label>
            <input
              type="text"
              required
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Full Name"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              {lang === 'ur' ? 'موبائل / واٹس ایپ نمبر (Mobile Number):' : 'Mobile / WhatsApp Number:'}
            </label>
            <input
              type="tel"
              required
              value={studentPhone}
              onChange={(e) => setStudentPhone(e.target.value)}
              placeholder="03XXXXXXXXX"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                {lang === 'ur' ? 'گاڑی کی قسم:' : 'Vehicle Type:'}
              </label>
              <select
                value={vehicleChoice}
                onChange={(e) => setVehicleChoice(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none"
              >
                <option value="scooty">اسکوٹی (Scooty / Scooter)</option>
                <option value="bike">بائیک (Commuter Bike)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                {lang === 'ur' ? 'مناسب وقت:' : 'Preferred Timing:'}
              </label>
              <select
                value={preferredSlot}
                onChange={(e) => setPreferredSlot(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none"
              >
                <option value="morning">صبح (08:00 AM - 10:00 AM)</option>
                <option value="evening">شام (04:30 PM - 06:30 PM)</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4 text-emerald-200" />
              <span>
                {lang === 'ur'
                  ? 'واٹس ایپ پر داخلہ فارم جمع کرائیں (03247150585)'
                  : 'Submit Enrollment on WhatsApp (03247150585)'}
              </span>
            </button>
          </div>
        </form>

        {/* Footer Support Hotline */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">
            {lang === 'ur' ? 'براہ راست کال رابطہ:' : 'Direct Helpline:'}
          </span>
          <a
            href="tel:03247150585"
            className="font-bold font-mono text-pink-700 hover:underline flex items-center gap-1"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>03247150585</span>
          </a>
        </div>
      </div>
    </div>
  );
};
