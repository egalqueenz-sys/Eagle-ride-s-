import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckSquare,
  FileText,
  Copy,
  Check,
  Lock,
  ExternalLink,
  Smartphone,
  AlertTriangle,
  X,
  ChevronRight,
  Download,
} from 'lucide-react';

interface PlayStoreSubmissionModalProps {
  onClose: () => void;
}

export const PlayStoreSubmissionModal: React.FC<PlayStoreSubmissionModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'privacy_policy' | 'data_safety' | 'permissions'>('checklist');
  const [copiedPolicy, setCopiedPolicy] = useState(false);
  const [copiedDataSafety, setCopiedDataSafety] = useState(false);

  const privacyPolicyContent = `PRIVACY POLICY FOR EAGLE WOMEN'S RIDE
Last Updated: November 1, 2026
Service City: Multan, Punjab, Pakistan
Official Contact & Data Protection Officer:
Eagle Women's Ride Management
Helpline: +923247150585 / 03247150585
Email: egalqueenz@gmail.com
Address: Multan, Punjab, Pakistan

1. INTRODUCTION & SCOPE
Eagle Women's Ride ("we", "our", or "us") operates a specialized, women-only transport ecosystem in Multan, Pakistan under the guiding principle "Her Journey, Her Freedom, Her Safety." This Privacy Policy explains our practices regarding the collection, processing, storage, and protection of personal data provided by female passengers and verified female drivers in full compliance with Google Play Developer Program Policies, Pakistan Electronic Crimes Act (PECA), and international personal data protection standards.

2. SPECIAL WOMEN SAFETY & ELIGIBILITY VERIFICATION
To maintain an exclusive women-only secure corridor:
a. Passengers: We collect full legal name, Pakistani mobile number (OTP verified), CNIC (Computerized National Identity Card) number, profile photograph, and designated emergency contact details.
b. Drivers: We collect full legal name, mobile number, government-issued CNIC front and back copies, live selfie verification photograph, valid driving licence, vehicle registration documents, and vehicle license plate details.
All driver identity and government documents are encrypted and reviewed manually by authorized Eagle Women administrators before driver account activation.

3. LOCATION DATA DISCLOSURE & USAGE
a. Precise Location (GPS): Eagle Women's Ride collects real-time foreground and background location data from your mobile device to:
- Detect pickup points along approved, well-lit main road corridors in Multan.
- Calculate accurate road distance and fair PKR pricing.
- Enable live ride tracking for passengers during active trips.
- Provide emergency location dispatch when the Emergency SOS button is triggered.
b. Background Location: For drivers, background location is collected only while "Online" (between 06:00 AM and 10:00 PM PKT) to dispatch nearby rides and ensure in-transit passenger tracking. Background tracking terminates automatically when going offline or upon the 10:00 PM safety curfew.

4. EMERGENCY SOS & DATA SHARING
In an active emergency triggered via the in-app SOS feature:
- Your real-time GPS location and trip details are shared immediately with Multan Police (15) and the 24/7 Eagle Command Center (+923247150585).
- An automated SMS or WhatsApp broadcast is dispatched to your registered Emergency Contact.
We NEVER sell, monetize, or disclose your personal data to commercial third parties.

5. PAYMENT & FINANCIAL PRIVACY
We support Cash, Easypaisa, JazzCash, and direct bank transfers. We do not store credit card CVV codes or banking passwords. Transaction records and digital receipts are maintained solely for dispute resolution and passenger fare transparency.

6. DATA RETENTION & ACCOUNT DELETION
Users have the unconditional right to request deletion of their account and associated identity documents at any time:
- In-App: Contact support or file a ticket under Help & Support.
- Email: Submit a deletion request to egalqueenz@gmail.com or via WhatsApp (+923247150585).
Account deletion requests are processed within 7 business days, securely purging all biometric and CNIC photos.

7. CONTACT US
For inquiries, safety concerns, or privacy disclosures:
Eagle Women's Ride Helpline: 03247150585
WhatsApp: +923247150585
Operating Hours: 06:00 AM – 10:00 PM PKT
Multan, Punjab, Pakistan`;

  const dataSafetyAnswers = `GOOGLE PLAY CONSOLE - DATA SAFETY DECLARATIONS

1. DATA COLLECTION & SHARING:
- Does your app collect or share any user data? YES
- Is all user data encrypted in transit? YES (HTTPS / TLS 1.3)
- Do you provide a way for users to request data deletion? YES

2. LOCATION:
- Approximate Location: Collected (App functionality, safety)
- Precise Location: Collected (App functionality, real-time routing, emergency SOS dispatch)
- Ephemeral processing or saved? Saved with trip history for passenger receipts and safety audit.

3. PERSONAL INFO:
- Name: Collected (Account management, driver identification)
- Phone Number: Collected (OTP verification, emergency liaison, passenger contact)
- Government ID / National ID (CNIC): Collected (Mandatory for women-only verification and safety enforcement; never shared publicly)

4. PHOTOS & VIDEOS:
- Photos: Collected (Driver driving license, vehicle photos, passenger profile photo for verification)

5. EMERGENCY & SECURITY:
- App functionality: Emergency dispatch to Multan Police 15 and 24/7 Command Center (03247150585) when user activates SOS.`;

  const handleCopyPolicy = () => {
    navigator.clipboard.writeText(privacyPolicyContent);
    setCopiedPolicy(true);
    setTimeout(() => setCopiedPolicy(false), 2000);
  };

  const handleCopyDataSafety = () => {
    navigator.clipboard.writeText(dataSafetyAnswers);
    setCopiedDataSafety(true);
    setTimeout(() => setCopiedDataSafety(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-rose-200 relative my-auto animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-pink-600 to-amber-500 text-white shadow-md">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-base text-slate-900 tracking-tight">
              GOOGLE PLAY STORE SUBMISSION & PRIVACY PORTAL
            </h3>
            <p className="text-xs text-pink-700 font-semibold">
              Mandatory Requirements & Safety Policies for Eagle Women's Ride
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl my-3 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3 py-1.5 font-bold rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'checklist' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Play Store Checklist
          </button>
          <button
            onClick={() => setActiveTab('privacy_policy')}
            className={`px-3 py-1.5 font-bold rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'privacy_policy' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Privacy Policy Template
          </button>
          <button
            onClick={() => setActiveTab('data_safety')}
            className={`px-3 py-1.5 font-bold rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'data_safety' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Data Safety Answers
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`px-3 py-1.5 font-bold rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'permissions' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Permission Justifications
          </button>
        </div>

        {/* TAB 1: Play Store Readiness Checklist */}
        {activeTab === 'checklist' && (
          <div className="space-y-3 text-xs max-h-[440px] overflow-y-auto pr-1">
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950">
              <span className="font-bold block mb-1">Critical Google Play Requirements for Safety Apps:</span>
              <p className="text-[11px] leading-relaxed">
                Google rigorously audits transport and safety apps. Ensure all declarations below are completed in Google Play Console prior to production release.
              </p>
            </div>

            <div className="space-y-2">
              {[
                {
                  title: '1. Public HTTPS Privacy Policy URL',
                  desc: 'Host the template below at a public accessible URL (e.g. your app domain /privacy) and link it in Play Console → Policy → Privacy Policy.',
                  status: 'Mandatory',
                },
                {
                  title: '2. Prominent Location In-App Disclosure',
                  desc: 'Before requesting ACCESS_FINE_LOCATION, show an in-app dialog explaining that location is used for pickup, route tracking, and SOS dispatch.',
                  status: 'Mandatory',
                },
                {
                  title: '3. Background Location Justification Video',
                  desc: 'Google requires a short 30-second screen recording showing driver online mode and why location is required when the screen is locked or app is in background.',
                  status: 'Driver App Only',
                },
                {
                  title: '4. Account Deletion URL & Instructions',
                  desc: 'Provide an active web link where users can submit account and CNIC deletion requests without calling customer care.',
                  status: 'Mandatory',
                },
                {
                  title: '5. App Access Credentials for Google Reviewers',
                  desc: 'Provide a pre-approved test passenger and test driver account in Play Console → Policy → App access, so Google reviewers can test ride booking.',
                  status: 'Mandatory',
                },
                {
                  title: '6. Government ID / CNIC Policy Compliance',
                  desc: 'CNIC photos must only be used for women driver vetting and passenger safety; declare under Personal Info → Government ID in Data Safety.',
                  status: 'Mandatory',
                },
                {
                  title: '7. Night Curfew Disclosure',
                  desc: 'Highlight operating hours (06:00 AM – 10:00 PM PKT) in your Store Listing description so users understand nighttime booking closure.',
                  status: 'Recommended',
                },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{item.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.status === 'Mandatory'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Privacy Policy Template */}
        {activeTab === 'privacy_policy' && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">
                Complete Privacy Policy (Ready to Publish)
              </span>
              <button
                onClick={handleCopyPolicy}
                className="px-3 py-1.5 bg-pink-700 hover:bg-pink-800 text-white rounded-lg font-bold flex items-center gap-1 shadow-xs transition-colors"
              >
                {copiedPolicy ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPolicy ? 'Copied to Clipboard!' : 'Copy Policy'}</span>
              </button>
            </div>

            <textarea
              readOnly
              rows={14}
              value={privacyPolicyContent}
              className="w-full text-[11px] font-mono bg-slate-50 p-3 rounded-2xl border border-slate-300 text-slate-800 focus:outline-none"
            />
          </div>
        )}

        {/* TAB 3: Data Safety Answers */}
        {activeTab === 'data_safety' && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">
                Google Play Console Data Safety Form Exact Answers
              </span>
              <button
                onClick={handleCopyDataSafety}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold flex items-center gap-1 shadow-xs transition-colors"
              >
                {copiedDataSafety ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDataSafety ? 'Copied Answers' : 'Copy Answers'}</span>
              </button>
            </div>

            <pre className="w-full text-[11px] font-mono bg-slate-900 text-amber-300 p-3.5 rounded-2xl border border-slate-800 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[380px]">
              {dataSafetyAnswers}
            </pre>
          </div>
        )}

        {/* TAB 4: Permission Justifications */}
        {activeTab === 'permissions' && (
          <div className="space-y-3 text-xs max-h-[440px] overflow-y-auto pr-1">
            <span className="font-bold text-slate-800 block">
              Android Manifest Permissions & Play Console Explanations
            </span>

            <div className="space-y-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-mono font-bold text-pink-700 block">ACCESS_FINE_LOCATION</span>
                <p className="text-[11px] text-slate-600 mt-1">
                  <strong>Declaration in Play Console:</strong> Required to pinpoint the passenger along verified Multan main road pickup points, track real-time trip route, and instantly transmit precise GPS coordinates to Multan Police 15 upon SOS trigger.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-mono font-bold text-pink-700 block">ACCESS_BACKGROUND_LOCATION</span>
                <p className="text-[11px] text-slate-600 mt-1">
                  <strong>Declaration in Play Console:</strong> For approved female drivers, continuous location tracking is necessary while in the "Online" state to allow passenger ride dispatch and ensure passenger route safety even when navigation runs in the background. Automatically ceases at 10:00 PM PKT.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-mono font-bold text-pink-700 block">POST_NOTIFICATIONS</span>
                <p className="text-[11px] text-slate-600 mt-1">
                  <strong>Declaration in Play Console:</strong> Used for time-critical ride dispatch alerts to drivers, driver arrival alerts to passengers, and emergency curfew countdown reminders.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-mono font-bold text-pink-700 block">CAMERA / READ_MEDIA_IMAGES</span>
                <p className="text-[11px] text-slate-600 mt-1">
                  <strong>Declaration in Play Console:</strong> Strictly used for mandatory NADRA CNIC front/back document upload and driver selfie verification before granting access to provide rides.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Need Play Store help?</span>
          <a
            href="https://wa.me/923247150585?text=Hello%20Eagle%20Women's%20Ride!%20I%20need%20assistance%20with%20Google%20Play%20submission."
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-pink-700 hover:underline"
          >
            Contact Eagle Admin: 03247150585
          </a>
        </div>
      </div>
    </div>
  );
};
