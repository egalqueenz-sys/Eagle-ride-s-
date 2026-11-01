import React, { useState } from 'react';
import { PassengerProfile, Language } from '../types';
import { ShieldCheck, CheckCircle2, Phone, User, KeyRound, AlertCircle, X } from 'lucide-react';

interface ProfileModalProps {
  profile: PassengerProfile;
  lang: Language;
  onClose: () => void;
  onSaveProfile: (updated: PassengerProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  lang,
  onClose,
  onSaveProfile,
}) => {
  const [fullName, setFullName] = useState(profile.fullName);
  const [mobile, setMobile] = useState(profile.mobile);
  const [cnic, setCnic] = useState(profile.cnic);
  const [emergencyName, setEmergencyName] = useState(profile.emergencyContactName);
  const [emergencyPhone, setEmergencyPhone] = useState(profile.emergencyContactPhone);

  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(profile.isOtpVerified);

  const handleSendOtp = () => {
    setOtpSent(true);
    // Instant test alert with OTP code
    setTimeout(() => {
      alert(`[Eagle Women SMS Gateway]\nYour one-time security verification code is: 4829\nEnter this code to verify your mobile number.`);
      setOtpCode('4829');
    }, 500);
  };

  const handleVerifyOtp = () => {
    if (otpCode === '4829' || otpCode === '1234' || otpCode.length >= 4) {
      setOtpVerified(true);
      alert('Mobile Number & CNIC Identity successfully verified!');
    } else {
      alert('Invalid OTP code. Please enter 4829.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...profile,
      fullName,
      mobile,
      cnic,
      emergencyContactName: emergencyName,
      emergencyContactPhone: emergencyPhone,
      isOtpVerified: otpVerified,
      isCnicVerified: true,
      isApproved: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-200 relative my-auto animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-xl bg-pink-100 text-pink-700">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Women Passenger Verification
            </h3>
            <p className="text-xs text-slate-500">Multan Safe Network NADRA Registration</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Full Legal Name:</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Mobile Number (Pakistan):</label>
            <div className="flex gap-2">
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
              {!otpVerified ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="px-3 py-2 bg-pink-700 text-white font-bold rounded-xl shrink-0 hover:bg-pink-800"
                >
                  {otpSent ? 'Resend' : 'Send OTP'}
                </button>
              ) : (
                <span className="px-3 py-2 bg-emerald-100 text-emerald-800 font-bold rounded-xl shrink-0 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              )}
            </div>
          </div>

          {otpSent && !otpVerified && (
            <div className="p-3 bg-pink-50 rounded-xl border border-pink-200 space-y-2">
              <span className="text-[11px] font-semibold text-pink-900 block">
                Enter 4-digit code sent to {mobile} (Demo: 4829):
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="4829"
                  maxLength={4}
                  className="w-28 p-2 text-center text-sm font-mono tracking-widest bg-white border border-pink-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700"
                >
                  Verify Code
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              NADRA CNIC Number (13 digits):
            </label>
            <input
              type="text"
              required
              value={cnic}
              onChange={(e) => setCnic(e.target.value)}
              placeholder="36302-1234567-8"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
            />
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
            <span className="font-bold text-amber-950 block">Emergency Contact (SOS Liaison):</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-600 block mb-0.5">Contact Name:</label>
                <input
                  type="text"
                  required
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="Mother / Sister"
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-600 block mb-0.5">Contact Mobile:</label>
                <input
                  type="tel"
                  required
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="03XXXXXXXXX"
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-700 to-rose-600 hover:from-pink-800 hover:to-rose-700 text-white font-extrabold text-xs shadow-md transition-all mt-2"
          >
            Save & Update Women Passenger Profile
          </button>
        </form>
      </div>
    </div>
  );
};
