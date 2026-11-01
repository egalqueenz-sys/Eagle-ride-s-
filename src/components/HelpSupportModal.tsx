import React, { useState } from 'react';
import { Language, ComplaintReport } from '../types';
import { translations } from '../data/translations';
import {
  Phone,
  MessageCircle,
  AlertTriangle,
  LifeBuoy,
  Send,
  X,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';

interface HelpSupportModalProps {
  lang: Language;
  onClose: () => void;
  onOpenSos: () => void;
  onSubmitComplaint: (complaint: ComplaintReport) => void;
}

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({
  lang,
  onClose,
  onOpenSos,
  onSubmitComplaint,
}) => {
  const t = translations[lang];
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [category, setCategory] = useState<ComplaintReport['category']>('safety');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact || !description) return;

    const newReport: ComplaintReport = {
      id: `CMP-${Math.floor(1000 + Math.random() * 9000)}`,
      reporterType: 'passenger',
      reporterName: name,
      reporterContact: contact,
      category,
      description,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    onSubmitComplaint(newReport);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
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

        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-xl bg-pink-100 text-pink-700">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Eagle Women Support & Helpdesk
            </h3>
            <p className="text-xs text-slate-500">Dedicated Multan Women Transit Safety Hub</p>
          </div>
        </div>

        {/* Direct Contact Cards */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <a
            href="tel:03247150585"
            className="p-3.5 rounded-2xl bg-gradient-to-tr from-pink-700 to-rose-600 text-white flex flex-col justify-between shadow-md hover:opacity-95 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-pink-200">24/7 Phone Support</span>
              <Phone className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <span className="text-sm font-black font-mono block">03247150585</span>
              <span className="text-[10px] text-pink-100">Tap to call instantly</span>
            </div>
          </a>

          <a
            href="https://wa.me/923247150585?text=Assalam-o-Alaikum%20Eagle%20Women's%20Ride!%20I%20need%20help%20with%20my%20service."
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-600 text-white flex flex-col justify-between shadow-md hover:opacity-95 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-emerald-200">WhatsApp Helpdesk</span>
              <MessageCircle className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <span className="text-sm font-black font-mono block">03247150585</span>
              <span className="text-[10px] text-emerald-100">Open WhatsApp chat</span>
            </div>
          </a>
        </div>

        {/* Emergency SOS Banner */}
        <div className="p-3 bg-red-50 rounded-2xl border border-red-200 flex items-center justify-between mb-4">
          <div className="text-xs text-red-900">
            <span className="font-bold block flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              Experiencing an immediate emergency?
            </span>
            <span className="text-[11px] text-red-700">Sound loud siren & notify police + HQ</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenSos();
            }}
            className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-sm"
          >
            Trigger SOS
          </button>
        </div>

        {/* Incident Reporting Form */}
        <div className="border-t border-slate-100 pt-3">
          <h4 className="font-bold text-xs text-slate-800 mb-2">
            Submit a Complaint or Safety Incident
          </h4>

          {submitted ? (
            <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-center space-y-1">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
              <h5 className="font-bold text-xs">Complaint Submitted Successfully</h5>
              <p className="text-[11px] text-emerald-700">
                Ticket assigned to Eagle Women's Ride Admin Multan. We will contact you shortly on WhatsApp.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Your Name:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Phone Number:</label>
                  <input
                    type="tel"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="03XXXXXXXXX"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">Issue Category:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                >
                  <option value="safety">Safety / Unsafe Location</option>
                  <option value="driver_behavior">Driver Conduct</option>
                  <option value="fare_dispute">Fare or Payment Issue</option>
                  <option value="route">Route Deviation</option>
                  <option value="other">General Feedback / Inquiry</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">Details:</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your incident or inquiry in detail..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5 text-pink-400" />
                <span>Submit Report to HQ</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
