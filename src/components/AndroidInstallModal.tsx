import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  CheckCircle,
  ShieldCheck,
  Share2,
  Copy,
  ExternalLink,
  Key,
  Info,
  X,
  QrCode,
  PackageCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';

interface AndroidInstallModalProps {
  onClose: () => void;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'apk_download' | 'install' | 'qr' | 'apikey_info'>('apk_download');
  const { isInstallable, isInstalled, install } = usePWAInstall();

  const appUrl =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://ais-pre-ldt5jpt2hxpnosx6odybbg-98558632611.asia-southeast1.run.app';

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Direct PWABuilder URL prefilled with this app's live origin
  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(appUrl)}`;

  // Google Chart API / QR server for instant Android camera scan
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    appUrl
  )}&color=be185d&bgcolor=fff1f5`;

  // Download manifest & launcher descriptor JSON
  const handleDownloadAppBundle = () => {
    const bundleData = {
      app_name: "EAGLE WOMEN'S RIDE",
      short_name: "Eagle Ride",
      version: "1.0.0",
      package_id: "com.eaglewomenride.multan",
      live_url: appUrl,
      support_contact: "03247150585",
      service_city: "Multan, Pakistan",
      operating_hours: "06:00 AM - 10:00 PM PKT",
      manifest_url: `${appUrl}/manifest.json`,
      generated_at: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(bundleData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'eagle-womens-ride-multan-apk-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-rose-200 relative my-auto animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-pink-500 to-amber-300 mx-auto shadow-lg mb-2 overflow-hidden">
            <img
              src="/src/assets/images/eagle_logo_crest_1793507620161.jpg"
              alt="Eagle App Icon"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>

          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            DOWNLOAD APK & INSTALL ON ANDROID
          </h3>
          <p className="text-xs text-pink-700 font-semibold">
            اینڈرائیڈ موبائل پر ایپ ڈاؤنلوڈ اور انسٹال کریں
          </p>
          <span className="text-[10px] text-slate-500 font-mono">
            EAGLE WOMEN'S RIDE · MULTAN, PAKISTAN
          </span>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl my-3 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('apk_download')}
            className={`flex-1 py-1.5 px-2 font-bold rounded-xl transition-all whitespace-nowrap text-center ${
              activeTab === 'apk_download'
                ? 'bg-gradient-to-r from-pink-700 to-rose-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            📥 Download APK
          </button>
          <button
            onClick={() => setActiveTab('install')}
            className={`flex-1 py-1.5 px-2 font-bold rounded-xl transition-all whitespace-nowrap text-center ${
              activeTab === 'install'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Chrome Install
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-1.5 px-2 font-bold rounded-xl transition-all whitespace-nowrap text-center ${
              activeTab === 'qr'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Scan QR
          </button>
          <button
            onClick={() => setActiveTab('apikey_info')}
            className={`flex-1 py-1.5 px-2 font-bold rounded-xl transition-all whitespace-nowrap text-center ${
              activeTab === 'apikey_info'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            API Key Info
          </button>
        </div>

        {/* TAB 1: DIRECT APK DOWNLOAD & GENERATOR */}
        {activeTab === 'apk_download' && (
          <div className="space-y-3 text-xs">
            {/* Primary Action 1: One-tap install if supported in browser */}
            {isInstallable && (
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl text-white shadow-md space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Android Direct WebAPK Ready!
                  </span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                    One-Tap
                  </span>
                </div>
                <p className="text-[11px] text-emerald-50">
                  آپ کے براؤزر میں براہ راست انسٹالیشن فعال ہے۔ نیچے بٹن دبائیں:
                </p>
                <button
                  onClick={install}
                  className="w-full py-2.5 rounded-xl bg-white text-emerald-950 font-black text-xs hover:bg-emerald-50 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Download className="w-4 h-4 text-emerald-700" />
                  <span>TAP HERE TO INSTALL APP (WebAPK)</span>
                </button>
              </div>
            )}

            {/* Direct App Link for Browser */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                Direct App Link (اوپن اور ڈاؤنلوڈ لنک):
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={appUrl}
                  className="w-full text-xs font-mono bg-white p-2 rounded-lg border border-slate-300 text-slate-800 truncate"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-2 bg-pink-700 hover:bg-pink-800 text-white rounded-lg font-bold shrink-0 flex items-center gap-1"
                >
                  {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Direct APK Build & Download Options */}
            <div className="p-3.5 bg-rose-50/70 rounded-2xl border border-rose-200 space-y-2.5">
              <span className="font-extrabold text-slate-900 block text-xs">
                براہ راست APK حاصل کرنے کے 3 تیز ترین طریقے:
              </span>

              {/* Option A: PWABuilder Instant Package */}
              <a
                href={pwaBuilderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white rounded-xl border border-pink-300 hover:border-pink-500 transition-all flex items-center justify-between group shadow-xs block"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center font-bold">
                    <PackageCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs group-hover:text-pink-700">
                      1. PWABuilder Direct APK Generator
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      One-click generate signed .apk for your phone
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-pink-600" />
              </a>

              {/* Option B: WhatsApp direct APK dispatch */}
              <a
                href={`https://wa.me/923247150585?text=${encodeURIComponent(
                  "Assalam-o-Alaikum! Mujhe Eagle Women's Ride Multan ki Android APK file chahiye."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white rounded-xl border border-emerald-300 hover:border-emerald-500 transition-all flex items-center justify-between group shadow-xs block"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs group-hover:text-emerald-700">
                      2. Get APK File via WhatsApp (03247150585)
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      ہماری ہیلپ ڈیسک سے براہ راست واٹس ایپ پر APK فائل منگوائیں
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* Option C: Download APK Configuration Manifest */}
              <button
                type="button"
                onClick={handleDownloadAppBundle}
                className="w-full p-2.5 bg-white rounded-xl border border-slate-200 hover:border-slate-400 transition-all flex items-center justify-between group shadow-xs"
              >
                <div className="flex items-center gap-2 text-left">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">
                      3. Download App Config & Manifest
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Save APK descriptor & setup JSON file to device
                    </span>
                  </div>
                </div>
                <Download className="w-4 h-4 text-slate-400 group-hover:text-slate-800" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: CHROME NATIVE INSTALL */}
        {activeTab === 'install' && (
          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-2">
              <span className="font-bold text-slate-900 block text-xs">
                Install as Native App on Android in 3 Simple Steps:
              </span>

              <div className="space-y-2 text-slate-700">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-pink-700 text-white font-black flex items-center justify-center shrink-0 text-xs">
                    1
                  </span>
                  <div>
                    <strong className="block text-slate-900">Open in Google Chrome:</strong>
                    <span>Copy or open the URL in Chrome on your phone.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-pink-700 text-white font-black flex items-center justify-center shrink-0 text-xs">
                    2
                  </span>
                  <div>
                    <strong className="block text-slate-900">Open Chrome Menu:</strong>
                    <span>Tap the three vertical dots (⋮) in the top-right corner.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-pink-700 text-white font-black flex items-center justify-center shrink-0 text-xs">
                    3
                  </span>
                  <div>
                    <strong className="block text-slate-900">Tap "Install App":</strong>
                    <span>Choose <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-[11px] font-semibold mt-2">
                ✓ The <strong>EAGLE WOMEN'S RIDE</strong> golden crest icon will appear on your phone's home screen and app drawer, opening in standalone fullscreen!
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SCAN QR CODE */}
        {activeTab === 'qr' && (
          <div className="text-center py-2 space-y-3 text-xs">
            <div className="inline-block p-3 bg-rose-50 rounded-2xl border-2 border-pink-200 shadow-md">
              <img
                src={qrCodeUrl}
                alt="Scan to open Eagle Women's Ride on Android"
                className="w-48 h-48 mx-auto rounded-lg object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-slate-700 font-medium max-w-xs mx-auto">
              Scan this QR code with your Android camera or Google Lens to instantly open and install the app on your mobile phone!
            </p>
          </div>
        )}

        {/* TAB 4: API KEY & PLAY STORE APK BUILD */}
        {activeTab === 'apikey_info' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <Key className="w-4 h-4 text-amber-700" />
                <span>Notice Regarding API Key (اے پی آئی کی معلومات):</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                <strong>No API Key is required to download or use this app!</strong> آپ کو ایپ ڈاؤنلوڈ یا استعمال کرنے کے لیے کسی API Key کی ضرورت نہیں ہے۔ تمام بکنگ اور رابطہ براہ راست +923247150585 کے ساتھ مربوط ہے۔
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-800 block">
                Google Play Store APK Packaging Details:
              </span>
              <ul className="space-y-1 text-slate-600 font-mono text-[11px]">
                <li>Package ID: <strong className="text-pink-700">com.eaglewomenride.multan</strong></li>
                <li>PWA Manifest: /manifest.json (Included & Validated)</li>
                <li>Theme Color: #E91E63 (Multan Women Safety Rose Pink)</li>
                <li>Tool to build standalone APK: Bubblewrap CLI or PWABuilder</li>
              </ul>
              <div className="pt-2">
                <span className="text-[10px] text-slate-500 block mb-1">Terminal command to build APK:</span>
                <code className="block bg-slate-900 text-pink-300 p-2 rounded-lg font-mono text-[10px] break-all">
                  npx @bubblewrap/cli init --manifest={appUrl}/manifest.json
                </code>
              </div>
            </div>
          </div>
        )}

        {/* Footer Support Hotline */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-500 font-medium">Multan Helpline:</span>
          <a
            href="https://wa.me/923247150585?text=Hello%20Eagle%20Women's%20Ride!%20Need%20help%20installing%20the%20app%20on%20my%20Android%20phone."
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
          >
            <span>WhatsApp 03247150585</span>
          </a>
        </div>
      </div>
    </div>
  );
};
