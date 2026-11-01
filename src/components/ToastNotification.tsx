import React, { useEffect, useState } from 'react';
import { ShieldAlert, ShieldCheck, X, BellRing, Sparkles, CheckCircle2 } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  messageUrdu?: string;
  type?: 'safety' | 'success' | 'alert';
  duration?: number;
}

export const SAFETY_REMINDERS: Omit<ToastMessage, 'id'>[] = [
  {
    title: 'Check Vehicle License Plate',
    message: 'Always verify the vehicle plate number (e.g., MN-24-7860) before getting on the ride.',
    messageUrdu: 'سوار ہونے سے پہلے ہمیشہ گاڑی کا نمبر پلیٹ ایپ سے ضرور میچ کریں۔',
    type: 'safety',
  },
  {
    title: 'Verified Female Driver Check',
    message: 'Ensure your driver is a verified woman wearing the official Eagle Women crest identifier.',
    messageUrdu: 'تسلی کر لیں کہ آپ کی رائیڈر ایک تصدیق شدہ خاتون ہیں جن کے پاس ایگل ویمن بیج موجود ہے۔',
    type: 'safety',
  },
  {
    title: 'Wait at Monitored Main Road',
    message: 'Please wait at the designated, well-lit main avenue pickup point for your security.',
    messageUrdu: 'اپنے تحفظ کے لیے براہ کرم صرف روشن اور پررونق مین روڈ پوائنٹ پر انتظار فرمائیں۔',
    type: 'safety',
  },
  {
    title: 'Share Trip With Family',
    message: 'Tap "Share Trip" on your active ride screen to send your live GPS route to family via WhatsApp.',
    messageUrdu: 'اپنے خاندان کو واٹس ایپ پر لائیو روٹ بھیجنے کے لیے شیئر ٹرپ بٹن کا استعمال کریں۔',
    type: 'safety',
  },
  {
    title: 'Emergency SOS is Standing By',
    message: 'The red Emergency SOS button connects directly to 24/7 Eagle Command (03247150585) & Police 15.',
    messageUrdu: 'ایمرجنسی ایس او ایس بٹن فوری مدد اور پولیس 15 سے رابطے کے لیے ہمیشہ اسکرین پر فعال ہے۔',
    type: 'safety',
  },
  {
    title: 'Transparent Fixed Fare',
    message: 'Pay only the confirmed PKR fare displayed in the app. No off-meter or extra charges allowed.',
    messageUrdu: 'صرف ایپ میں ظاہر کردہ طے شدہ کرایہ ادا کریں۔ کوئی اضافی چارجز وصول نہیں کیے جاتے۔',
    type: 'safety',
  },
  {
    title: 'Strict 10:00 PM Night Curfew',
    message: 'All women rides conclude before 10:00 PM PKT sharp to ensure maximum protection.',
    messageUrdu: 'خواتین کے تحفظ کے لیے تمام رائیڈز رات 10:00 بجے سے پہلے مکمل ہونا لازمی ہیں۔',
    type: 'safety',
  },
];

export function getRandomSafetyReminder(): Omit<ToastMessage, 'id'> {
  const index = Math.floor(Math.random() * SAFETY_REMINDERS.length);
  return SAFETY_REMINDERS[index];
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
  lang?: 'en' | 'ur';
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss, lang = 'en' }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[9999] max-w-sm w-full space-y-2 pointer-events-none px-2 sm:px-0">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} lang={lang} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
  lang?: 'en' | 'ur';
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss, lang = 'en' }) => {
  const [progress, setProgress] = useState(100);
  const duration = toast.duration || 6500;

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onDismiss(toast.id);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [toast.id, duration, onDismiss]);

  return (
    <div
      className="pointer-events-auto bg-gradient-to-r from-pink-950 via-slate-900 to-rose-950 text-white rounded-2xl p-4 shadow-2xl border-2 border-amber-400/80 animate-in slide-in-from-top-4 fade-in duration-300 relative overflow-hidden backdrop-blur-md"
      role="alert"
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-pink-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-sm animate-pulse">
            <ShieldAlert className="w-4 h-4 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-300/30">
                Safety Reminder
              </span>
            </div>
            <h4 className="text-xs font-black text-white mt-0.5 tracking-tight">
              {toast.title}
            </h4>
          </div>
        </div>

        <button
          onClick={() => onDismiss(toast.id)}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors shrink-0"
          title="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Message */}
      <p className="text-[11px] text-pink-100/95 leading-relaxed mt-2 pl-1 font-medium">
        {lang === 'ur' && toast.messageUrdu ? toast.messageUrdu : toast.message}
      </p>

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-pink-950/40">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-pink-500 transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
