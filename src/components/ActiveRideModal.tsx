import React, { useState, useEffect } from 'react';
import { RideBooking, Language } from '../types';
import { translations } from '../data/translations';
import {
  Phone,
  MessageCircle,
  Share2,
  AlertTriangle,
  Star,
  CheckCircle,
  MapPin,
  Clock,
  Car,
  Bike,
  ShieldCheck,
  Receipt,
  X,
  Ban,
  AlertCircle,
  BellRing,
  MessageSquare,
  Lock,
  Timer,
  FastForward,
  Navigation,
  Compass,
} from 'lucide-react';
import { RideChat } from './RideChat';
import { MapLeaflet } from './MapLeaflet';

interface ActiveRideModalProps {
  booking: RideBooking;
  lang: Language;
  onClose: () => void;
  onTriggerSos: () => void;
  onUpdateStatus: (newStatus: RideBooking['status']) => void;
  onRateDriver?: (rating: number, review: string) => void;
}

export const ActiveRideModal: React.FC<ActiveRideModalProps> = ({
  booking,
  lang,
  onClose,
  onTriggerSos,
  onUpdateStatus,
  onRateDriver,
}) => {
  const t = translations[lang];
  const [rating, setRating] = useState<number>(booking.ratingGivenByPassenger || 5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewComment, setReviewComment] = useState<string>(booking.reviewByPassenger || '');
  const [hasRated, setHasRated] = useState<boolean>(!!booking.ratingGivenByPassenger);
  const [copiedShare, setCopiedShare] = useState(false);
  const [quickTags, setQuickTags] = useState<string[]>([]);

  // Cancel ride dialog state
  const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of plans');
  const [isDriverNotified, setIsDriverNotified] = useState(false);

  // Real-time Countdown Timer based on booking.estimatedMinutes
  const totalTripSeconds = Math.max(60, (booking.estimatedMinutes || 11) * 60);
  const totalArrivalSeconds = 210; // 3.5 minutes for driver to reach pickup point

  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    if (booking.status === 'driver_arriving') return totalArrivalSeconds;
    if (booking.status === 'in_progress') return totalTripSeconds;
    return totalTripSeconds;
  });

  const [totalSeconds, setTotalSeconds] = useState<number>(() => {
    if (booking.status === 'driver_arriving') return totalArrivalSeconds;
    return totalTripSeconds;
  });

  // Pickup & destination coordinates for real-time driver movement
  const pickupLat = booking.pickupLocation?.lat || 30.2585;
  const pickupLng = booking.pickupLocation?.lng || 71.5147;
  const destLat = booking.destinationLocation?.lat || 30.2291;
  const destLng = booking.destinationLocation?.lng || 71.4883;

  // Approach start point for driver simulation (~1.5 km offset from pickup point)
  const approachStartLat = pickupLat + 0.012;
  const approachStartLng = pickupLng - 0.009;

  const [driverPosition, setDriverPosition] = useState<{ lat: number; lng: number }>(() => {
    if (booking.status === 'driver_arriving') {
      return { lat: approachStartLat, lng: approachStartLng };
    }
    return { lat: pickupLat, lng: pickupLng };
  });

  // Real-time location movement of assigned driver using setInterval simulation
  useEffect(() => {
    if (booking.status !== 'driver_arriving' && booking.status !== 'in_progress') {
      return;
    }

    const interval = setInterval(() => {
      // Calculate fraction of trip completed (0 to 1) based on countdown timer
      const fraction = Math.min(
        1,
        Math.max(0, (totalSeconds - remainingSeconds) / totalSeconds)
      );

      if (booking.status === 'driver_arriving') {
        // Driver moving smoothly from approach position towards pickup point
        const currentLat = approachStartLat + (pickupLat - approachStartLat) * fraction;
        const currentLng = approachStartLng + (pickupLng - approachStartLng) * fraction;
        setDriverPosition({ lat: currentLat, lng: currentLng });
      } else if (booking.status === 'in_progress') {
        // Driver moving smoothly along road route towards destination
        const midLat = (pickupLat + destLat) / 2;
        const midLng = (pickupLng + destLng) / 2;
        const bendLat = midLat + (destLng > pickupLng ? 0.002 : -0.002);
        const bendLng = midLng + (destLat > pickupLat ? -0.003 : 0.003);

        let currentLat: number;
        let currentLng: number;

        if (fraction <= 0.5) {
          const subF = fraction * 2;
          currentLat = pickupLat + (bendLat - pickupLat) * subF;
          currentLng = pickupLng + (bendLng - pickupLng) * subF;
        } else {
          const subF = (fraction - 0.5) * 2;
          currentLat = bendLat + (destLat - bendLat) * subF;
          currentLng = bendLng + (destLng - bendLng) * subF;
        }

        setDriverPosition({ lat: currentLat, lng: currentLng });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    booking.status,
    remainingSeconds,
    totalSeconds,
    pickupLat,
    pickupLng,
    destLat,
    destLng,
    approachStartLat,
    approachStartLng,
  ]);

  // Keep countdown calibrated when booking status changes
  useEffect(() => {
    if (booking.status === 'driver_arriving') {
      setRemainingSeconds(totalArrivalSeconds);
      setTotalSeconds(totalArrivalSeconds);
      setDriverPosition({ lat: approachStartLat, lng: approachStartLng });
    } else if (booking.status === 'in_progress') {
      setRemainingSeconds(totalTripSeconds);
      setTotalSeconds(totalTripSeconds);
      setDriverPosition({ lat: pickupLat, lng: pickupLng });
    }
  }, [booking.status, totalTripSeconds, totalArrivalSeconds, approachStartLat, approachStartLng, pickupLat, pickupLng]);

  // Live 1-second countdown ticker
  useEffect(() => {
    if (booking.status !== 'driver_arriving' && booking.status !== 'in_progress') {
      return;
    }

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          // If arrival timer finishes, auto-transition or alert
          if (booking.status === 'driver_arriving') {
            return 0;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [booking.status]);

  // Format mm:ss
  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress percentage (0% to 100%)
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((totalSeconds - remainingSeconds) / totalSeconds) * 100))
  );

  // Fast forward simulator helper for testing
  const handleFastForward = (secondsToDeduct: number) => {
    setRemainingSeconds((prev) => Math.max(5, prev - secondsToDeduct));
  };

  // Simulated ride progression steps for realistic demo
  useEffect(() => {
    if (booking.status === 'searching') {
      const timer = setTimeout(() => {
        onUpdateStatus('driver_arriving');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [booking.status, onUpdateStatus]);

  const handleShareTrip = () => {
    const shareText = `${t.shareMessage}\nRide ID: ${booking.id}\nDriver: Ayesha Bibi (CNIC Verified)\nVehicle: ${booking.vehicleType.toUpperCase()} (MN-24-7860)\nPickup: ${booking.pickupAddress}\nDestination: ${booking.destinationAddress}\nEmergency Contact: 03247150585`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl border border-rose-200 relative my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                booking.status === 'cancelled' ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'
              }`}
            ></span>
            <span className="font-extrabold text-sm text-slate-900 tracking-tight">
              {booking.status === 'searching' && (lang === 'ur' ? 'تصدیق شدہ خاتون رائیڈر کی تلاش...' : 'Looking for Verified Female Driver...')}
              {booking.status === 'driver_arriving' && (lang === 'ur' ? `ڈرائیور آ رہی ہیں (${formatTimer(remainingSeconds)})` : `Verified Driver Arriving (${formatTimer(remainingSeconds)})`)}
              {booking.status === 'in_progress' && (lang === 'ur' ? `سفر جاری ہے (${formatTimer(remainingSeconds)} باقی)` : `Trip in Progress (${formatTimer(remainingSeconds)} remaining)`)}
              {booking.status === 'completed' && (lang === 'ur' ? 'سفر بخیریت مکمل ہوا' : 'Trip Completed Safely')}
              {booking.status === 'cancelled' && (lang === 'ur' ? 'رائیڈ منسوخ کر دی گئی' : 'Ride Cancelled')}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Driver Profile Card */}
        {booking.status !== 'searching' && (
          <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 rounded-2xl p-3.5 my-3 border border-pink-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
                  alt="Verified Female Driver"
                  className="w-13 h-13 rounded-full object-cover border-2 border-pink-600 shadow-sm"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to avatar container
                    (e.target as any).src = '/src/assets/images/eagle_logo_crest_1793507620161.jpg';
                  }}
                />
                <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 border border-white" title="CNIC Verified">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-slate-900">Ayesha Bibi</span>
                  <span className="text-[10px] font-bold text-pink-700 bg-pink-100 px-1.5 py-0.2 rounded">
                    Verified Rider
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5">
                  <span className="flex items-center gap-0.5 font-bold text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    4.9
                  </span>
                  <span>·</span>
                  <span className="font-mono text-[11px] font-semibold text-slate-700">
                    MN-24-7860
                  </span>
                  <span>·</span>
                  <span className="capitalize text-pink-900">{booking.vehicleType}</span>
                </div>
              </div>
            </div>

            {/* Safe In-App Chat + Direct Call / WhatsApp */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
                  activeTab === 'chat'
                    ? 'bg-emerald-700 text-white shadow-emerald-700/20 ring-2 ring-emerald-400'
                    : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white'
                }`}
                title="Chat with Driver (No Phone Number Shared)"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{lang === 'ur' ? 'ڈرائیور سے چیٹ کریں' : 'Chat with Driver'}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
              </button>

              <a
                href="tel:03247150585"
                className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-all border border-slate-200"
                title="Call Support Helpline"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://wa.me/923247150585?text=Assalam-o-Alaikum%20Ayesha%20Bibi,%20I%20am%20waiting%20at%20pickup%20point."
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center hover:bg-emerald-200 transition-all border border-emerald-200"
                title="WhatsApp Driver"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Navigation Tabs (Trip Details vs Chat with Driver) */}
        {booking.status !== 'searching' && (
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl my-2.5 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-2 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'details'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-pink-600" />
              <span>{lang === 'ur' ? 'تفصیلات و روٹ' : 'Trip Details & Route'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'chat'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'ur' ? 'ڈرائیور سے چیٹ کریں' : 'Chat with Driver'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>
          </div>
        )}

        {activeTab === 'chat' && booking.status !== 'searching' ? (
          <div className="my-2">
            <RideChat
              booking={booking}
              lang={lang}
              onCloseChat={() => setActiveTab('details')}
            />
          </div>
        ) : (
          <>
            {/* Searching Animation State */}
            {booking.status === 'searching' && (
              <div className="text-center py-6 px-4">
                <div className="w-16 h-16 rounded-full bg-pink-100 mx-auto flex items-center justify-center text-pink-600 mb-3 animate-bounce">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">
                  Connecting to Verified Female Drivers in Multan
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                  Matching your safe route along Bosan Road and main commercial hubs...
                </p>
              </div>
            )}

            {/* REAL-TIME DYNAMIC COUNTDOWN TIMER CARD */}
            {(booking.status === 'driver_arriving' || booking.status === 'in_progress') && (
              <div className="bg-gradient-to-br from-rose-50 via-white to-amber-50 rounded-2xl p-4 my-2.5 border-2 border-pink-300 shadow-md space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-pink-100 text-pink-700 animate-pulse">
                      <Timer className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-wider text-pink-700 block">
                        {booking.status === 'driver_arriving'
                          ? (lang === 'ur' ? 'ڈرائیور کی آمد کا لائیو وقت' : 'DRIVER ARRIVAL COUNTDOWN')
                          : (lang === 'ur' ? 'منزل تک سفر کا لائیو وقت' : 'TRIP DESTINATION COUNTDOWN')}
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {booking.status === 'driver_arriving'
                          ? 'Ayesha Bibi approaching pickup point'
                          : `En route via Bosan Road (${booking.distanceKm || 3.8} km)`}
                      </span>
                    </div>
                  </div>

                  {/* Large Digital Countdown Display */}
                  <div className="text-right">
                    <div className="flex items-baseline justify-end gap-1 font-mono font-black text-2xl text-pink-800 tracking-tight">
                      <span>{formatTimer(remainingSeconds)}</span>
                      <span className="text-[10px] font-sans font-bold text-slate-500 uppercase">
                        {remainingSeconds <= 60 ? 'sec' : 'mins'}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 flex items-center justify-end gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      Live GPS Sync
                    </span>
                  </div>
                </div>

                {/* Dynamic Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                    <span className="flex items-center gap-1 text-pink-900 truncate max-w-[140px]">
                      <MapPin className="w-3 h-3 text-pink-600 shrink-0" />
                      {booking.pickupAddress.split(',')[0]}
                    </span>
                    <span className="text-[10px] font-bold text-pink-700 bg-pink-100/80 px-2 py-0.5 rounded-full">
                      {progressPercent}% {lang === 'ur' ? 'مکمل' : 'Completed'}
                    </span>
                    <span className="flex items-center gap-1 text-amber-900 truncate max-w-[140px] text-right">
                      <Compass className="w-3 h-3 text-amber-600 shrink-0" />
                      {booking.destinationAddress.split(',')[0]}
                    </span>
                  </div>

                  {/* Bar track */}
                  <div className="h-3 bg-slate-100 rounded-full p-0.5 border border-slate-200 relative overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 rounded-full transition-all duration-1000 relative"
                      style={{ width: `${Math.max(5, progressPercent)}%` }}
                    >
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-xs"></span>
                    </div>
                  </div>

                  {/* Sub-indicator details */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                    <span>
                      {booking.status === 'driver_arriving'
                        ? `Distance: ~${Math.max(0.1, (0.8 * (remainingSeconds / totalSeconds))).toFixed(1)} km away`
                        : `Remaining: ~${Math.max(0.1, ((booking.distanceKm || 3.8) * (remainingSeconds / totalSeconds))).toFixed(1)} km`}
                    </span>

                    {/* Simulation testing controls */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] text-slate-400">Test:</span>
                      <button
                        type="button"
                        onClick={() => handleFastForward(30)}
                        className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[9px] font-bold flex items-center gap-0.5"
                        title="Simulate Fast Forward -30 seconds"
                      >
                        <FastForward className="w-2.5 h-2.5 text-pink-600" />
                        -30s
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFastForward(120)}
                        className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[9px] font-bold flex items-center gap-0.5"
                        title="Simulate Fast Forward -2 mins"
                      >
                        <FastForward className="w-2.5 h-2.5 text-pink-600" />
                        -2m
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LIVE TRIP RADAR MAP - Shows real-time driver movement towards destination */}
            {(booking.status === 'driver_arriving' || booking.status === 'in_progress') && (
              <div className="relative rounded-2xl overflow-hidden border-2 border-pink-200 shadow-md my-2.5 h-56 sm:h-64 w-full">
                <MapLeaflet
                  pickupLocation={booking.pickupLocation}
                  destLocation={booking.destinationLocation}
                  driverLocation={driverPosition}
                  vehicleType={booking.vehicleType}
                  interactive={true}
                />

                {/* Live Movement HUD Overlay */}
                <div className="absolute top-2.5 left-2.5 right-2.5 z-[990] pointer-events-none flex items-center justify-between">
                  <div className="bg-slate-900/90 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-xl shadow-md border border-slate-700/60 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>
                      {booking.status === 'driver_arriving'
                        ? (lang === 'ur' ? 'ڈرائیور پک اپ پوائنٹ کی طرف آ رہی ہیں' : 'Driver moving towards pickup point')
                        : (lang === 'ur' ? 'ڈرائیور منزل کی طرف رواں دواں ہیں' : 'Driver moving towards destination')}
                    </span>
                  </div>
                  <div className="bg-pink-700/90 backdrop-blur-md text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-md border border-pink-500/50 flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-pink-200 animate-spin" />
                    <span>Live GPS</span>
                  </div>
                </div>
              </div>
            )}

        {/* Route Details */}
        <div className="space-y-2.5 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 my-2">
          <div className="flex items-start gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-600 mt-1 shrink-0"></span>
            <div>
              <span className="text-[10px] uppercase font-bold text-pink-700 block">
                Pickup (Main Road Safe Corridor)
              </span>
              <span className="font-semibold text-slate-800">{booking.pickupAddress}</span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1 shrink-0"></span>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-700 block">
                Safe Destination
              </span>
              <span className="font-semibold text-slate-800">{booking.destinationAddress}</span>
            </div>
          </div>
        </div>

        {/* Fare & Payment Summary */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs">
          <div>
            <span className="text-slate-600 block">Confirmed Fare:</span>
            <span className="text-[10px] font-semibold text-slate-500 capitalize">
              Payment via {booking.paymentMethod.replace('_', ' ')}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xl font-extrabold text-pink-700 font-mono">
              PKR {booking.totalFare ?? booking.estimatedFare}
            </span>
            {booking.perKmRate && (
              <span className="text-[10px] text-pink-700 font-semibold block">
                {booking.distanceKm} KM x {booking.perKmRate} Rs
              </span>
            )}
          </div>
        </div>

        {/* COMPLETED RIDE RATING & REVIEW CARD */}
        {booking.status === 'completed' && (
          <div className="bg-gradient-to-b from-amber-50/70 to-rose-50/70 rounded-2xl p-4 my-3 border border-amber-200/80 space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200/50">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-amber-400 text-slate-950 font-bold">
                  <Star className="w-4 h-4 fill-slate-950" />
                </span>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">
                    Rate Your Female Driver
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Help keep Multan's women transit network safe and reliable
                  </p>
                </div>
              </div>

              {hasRated && (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  Submitted
                </span>
              )}
            </div>

            {!hasRated ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setHasRated(true);
                  if (onRateDriver) {
                    onRateDriver(rating, reviewComment);
                  }
                }}
                className="space-y-3"
              >
                {/* 5-Star Interactive Selector */}
                <div className="flex flex-col items-center justify-center py-1">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = (hoverRating !== null ? hoverRating : rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => setRating(star)}
                          className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                          title={`${star} Star${star > 1 ? 's' : ''}`}
                        >
                          <Star
                            className={`w-7 h-7 transition-colors ${
                              isFilled
                                ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                                : 'text-slate-300 stroke-[1.5]'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  {/* Rating Label Text */}
                  <span className="text-xs font-bold text-amber-900 mt-1">
                    {rating === 5 && '⭐️⭐️⭐️⭐️⭐️ Outstanding & Safe Journey'}
                    {rating === 4 && '⭐️⭐️⭐️⭐️ Very Good & Polite Rider'}
                    {rating === 3 && '⭐️⭐️⭐️ Average Experience'}
                    {rating === 2 && '⭐️⭐️ Needs Improvement'}
                    {rating === 1 && '⭐️ Poor Experience'}
                  </span>
                </div>

                {/* Quick Feedback Tags */}
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {[
                    'Safe Driving',
                    'Polite & Respectful',
                    'On Time',
                    'Clean Vehicle',
                    'Followed Main Road',
                  ].map((tag) => {
                    const isSelected = quickTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setQuickTags(quickTags.filter((t) => t !== tag));
                          } else {
                            setQuickTags([...quickTags, tag]);
                            if (!reviewComment.includes(tag)) {
                              setReviewComment(
                                reviewComment ? `${reviewComment}, ${tag}` : tag
                              );
                            }
                          }
                        }}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-full border transition-all ${
                          isSelected
                            ? 'bg-pink-700 text-white border-pink-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-pink-300'
                        }`}
                      >
                        {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                      </button>
                    );
                  })}
                </div>

                {/* Short Comment Input */}
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">
                    Add a short comment for Ayesha Bibi (Optional):
                  </label>
                  <textarea
                    rows={2}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share feedback on punctuality, safety, or vehicle comfort..."
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800 resize-none shadow-xs"
                    maxLength={250}
                  />
                  <div className="text-[10px] text-slate-400 text-right">
                    {reviewComment.length}/250 characters
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-700 to-rose-600 hover:from-pink-800 hover:to-rose-700 text-white font-extrabold text-xs shadow-md shadow-pink-700/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4 text-amber-200" />
                  <span>Submit Rating & Review</span>
                </button>
              </form>
            ) : (
              <div className="bg-white/80 rounded-xl p-3 border border-emerald-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= rating ? 'fill-amber-400 text-amber-500' : 'text-slate-200'
                        }`}
                      />
                    ))}
                    <span className="font-bold text-slate-800 font-mono text-xs ml-1">
                      {rating}.0 / 5.0
                    </span>
                  </div>
                  <button
                    onClick={() => setHasRated(false)}
                    className="text-[10px] text-pink-700 font-bold hover:underline"
                  >
                    Edit Review
                  </button>
                </div>

                {reviewComment ? (
                  <p className="text-slate-700 italic bg-slate-50 p-2 rounded-lg border border-slate-100 text-[11px]">
                    "{reviewComment}"
                  </p>
                ) : (
                  <p className="text-slate-500 text-[11px]">
                    Thank you! Your verified rating has been saved to the driver's profile.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* CANCELLED RIDE NOTIFICATION CARD */}
        {booking.status === 'cancelled' && (
          <div className="bg-rose-50/80 rounded-2xl p-4 my-3 border border-rose-200 text-center space-y-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <Ban className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">
                Ride Cancelled by Passenger
              </h4>
              <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto leading-relaxed">
                Your assigned female driver (Ayesha Bibi) has been notified immediately. Zero cancellation charges applied.
              </p>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-rose-200 text-[11px] text-pink-900 font-semibold flex items-center justify-center gap-1.5 shadow-xs">
              <BellRing className="w-3.5 h-3.5 text-pink-600 animate-bounce" />
              <span>Driver Notified · Reassigned to Available Multan Fleet</span>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Close & Return to Map
            </button>
          </div>
        )}
      </>
    )}

        {/* Live Safety Controls: Chat with Driver, SOS, Share Trip, Support */}
        {booking.status !== 'completed' && booking.status !== 'cancelled' && (
          <div className="space-y-2 my-3">
            {/* Primary Chat with Driver Button */}
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'chat' ? 'details' : 'chat')}
              className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] ${
                activeTab === 'chat'
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                  : 'bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white shadow-pink-600/25'
              }`}
            >
              <MessageSquare className={`w-4 h-4 ${activeTab === 'chat' ? 'text-pink-600' : 'text-white'}`} />
              <span>
                {activeTab === 'chat'
                  ? (lang === 'ur' ? 'روٹ اور لائیو تفصیلات پر واپس جائیں' : 'Back to Trip Details & Live Tracking')
                  : (lang === 'ur' ? 'ڈرائیور سے چیٹ کریں (Chat with Driver)' : 'Chat with Driver')}
              </span>
              {activeTab !== 'chat' && (
                <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
                  Live & Masked
                </span>
              )}
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleShareTrip}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
              >
                <Share2 className="w-4 h-4 text-pink-700" />
                <span>{copiedShare ? 'Trip Link Copied!' : t.shareRide}</span>
              </button>

              <button
                onClick={onTriggerSos}
                className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-red-600/30 transition-all"
              >
                <AlertTriangle className="w-4 h-4 text-amber-200" />
                <span>EMERGENCY SOS</span>
              </button>
            </div>

            {/* Cancel Ride Action Button */}
            <button
              onClick={() => setShowCancelDialog(true)}
              className="w-full py-2 px-3 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Ban className="w-3.5 h-3.5 text-rose-600" />
              <span>Cancel Ride</span>
            </button>
          </div>
        )}

        {/* Demo Simulation Stepper for Testing Full Workflow */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-500 font-medium">Demo Workflow Step:</span>
          <div className="flex items-center gap-1">
            {booking.status === 'driver_arriving' && (
              <button
                onClick={() => onUpdateStatus('in_progress')}
                className="px-2.5 py-1 rounded-lg bg-pink-100 text-pink-900 font-bold hover:bg-pink-200"
              >
                Start Ride
              </button>
            )}

            {booking.status === 'in_progress' && (
              <button
                onClick={() => onUpdateStatus('completed')}
                className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold hover:bg-emerald-200"
              >
                Complete Ride
              </button>
            )}

            {booking.status === 'completed' && (
              <button
                onClick={onClose}
                className="px-3 py-1 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 text-xs"
              >
                Close & Return
              </button>
            )}
          </div>
        </div>

        {/* CANCEL CONFIRMATION DIALOG MODAL */}
        {showCancelDialog && (
          <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-rose-200 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-2">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="font-black text-base text-slate-900">
                  Cancel This Ride?
                </h3>
                <p className="text-xs text-slate-500">
                  Are you sure you want to cancel your ride? Your assigned female driver (Ayesha Bibi) will be notified immediately.
                </p>
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Select a cancellation reason:
                </label>
                <div className="space-y-1">
                  {[
                    'Change of plans',
                    'Driver is taking too long',
                    'Selected incorrect pickup location',
                    'Booked alternate transport',
                    'Personal emergency',
                  ].map((reason) => (
                    <label
                      key={reason}
                      onClick={() => setCancelReason(reason)}
                      className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-all ${
                        cancelReason === reason
                          ? 'border-pink-600 bg-pink-50/70 text-pink-950 font-bold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="cancelReason"
                        checked={cancelReason === reason}
                        onChange={() => setCancelReason(reason)}
                        className="text-pink-600 focus:ring-pink-500"
                      />
                      <span className="text-[11px]">{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCancelDialog(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                >
                  Keep My Ride
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowCancelDialog(false);
                    onUpdateStatus('cancelled');
                    setIsDriverNotified(true);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-600/25 transition-colors"
                >
                  Yes, Cancel Ride
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
