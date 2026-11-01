import React, { useState } from 'react';
import {
  LocationPoint,
  VehicleCategory,
  FareConfig,
  Language,
  PaymentMethod,
  RideBooking,
  PassengerProfile,
} from '../types';
import { APPROVED_SAFE_LOCATIONS } from '../data/multanLocations';
import { generateWhatsAppBookingUrl } from '../utils/fareCalculator';
import { getCurrentPktTime, willRideExceedCurfew } from '../utils/pktTime';
import { translations } from '../data/translations';
import {
  MapPin,
  Clock,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  MessageCircle,
  Car,
  Bike,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  Calculator,
} from 'lucide-react';
import { getRandomSafetyReminder, ToastMessage } from './ToastNotification';

interface BookingFormProps {
  lang: Language;
  fareConfig: FareConfig;
  passengerProfile: PassengerProfile;
  pickup: LocationPoint;
  destination: LocationPoint;
  onPickupChange: (point: LocationPoint) => void;
  onDestinationChange: (point: LocationPoint) => void;
  onConfirmBooking: (booking: RideBooking) => void;
  onSelectMapMode: (mode: 'pickup' | 'destination' | null) => void;
  selectedMapMode: 'pickup' | 'destination' | null;
  onShowSafetyToast?: (reminder: Omit<ToastMessage, 'id'>) => void;
}

// User-specified rates:
// Bike = 30 Rs / KM
// Scooty = 30 Rs / KM
// Car = 80 Rs / KM
const rates: Record<VehicleCategory, number> = {
  bike: 30,
  scooty: 30,
  car: 80,
};

// Popular Multan Hubs for quick select
const POPULAR_HUBS = [
  'Bosan Road',
  'Gulgasht',
  'Cantt',
  'Model Town',
  'MDA Chowk',
  'Shalimar',
  'Vehari Chowk',
];

export const BookingForm: React.FC<BookingFormProps> = ({
  lang,
  fareConfig,
  passengerProfile,
  pickup,
  destination,
  onPickupChange,
  onDestinationChange,
  onConfirmBooking,
  onSelectMapMode,
  selectedMapMode,
  onShowSafetyToast,
}) => {
  const t = translations[lang];

  // 1. Vehicle selection
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleCategory>('scooty');

  // 2. From & To text state
  const [fromLocation, setFromLocation] = useState<string>(pickup.name || 'Bosan Road (Women Univ Gate)');
  const [toLocation, setToLocation] = useState<string>(destination.name || 'Gulgasht Colony Gol Bagh');

  // 3. Distance in KM (کلومیٹر) slider/input - 1 to 50 KM (default 4 KM)
  const [distance, setDistance] = useState<number>(4);

  // Other booking states
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [customDate, setCustomDate] = useState<'now' | 'scheduled'>('now');
  const [scheduledDateTime, setScheduledDateTime] = useState('');

  // 4. Live Automatic Fare Calculation
  // totalFare = distance * rates[selectedVehicle]
  const currentRate = rates[selectedVehicle];
  const totalFare = distance * currentRate;

  // Estimated travel time in Multan traffic (~2.3 min per KM)
  const minPerKm = selectedVehicle === 'car' ? 2.6 : 2.2;
  const estimatedMinutes = Math.max(5, Math.round(distance * minPerKm + 3));

  // Current PKT Time and Curfew Evaluation (06:00 AM - 10:00 PM PKT)
  const pktInfo = getCurrentPktTime(fareConfig.morningStartHourPKT, fareConfig.nightCurfewHourPKT);
  const tripViolatesCurfew =
    pktInfo.isNightCurfewActive ||
    willRideExceedCurfew(estimatedMinutes, fareConfig.nightCurfewHourPKT, fareConfig.morningStartHourPKT);

  // Helper when selecting pre-defined location point
  const handleSelectFromPoint = (locName: string) => {
    setFromLocation(locName);
    const found = APPROVED_SAFE_LOCATIONS.find((l) => l.name.includes(locName) || locName.includes(l.name));
    if (found) onPickupChange(found);
  };

  const handleSelectToPoint = (locName: string) => {
    setToLocation(locName);
    const found = APPROVED_SAFE_LOCATIONS.find((l) => l.name.includes(locName) || locName.includes(l.name));
    if (found) onDestinationChange(found);
  };

  // WhatsApp Booking Handler
  const handleBookOnWhatsApp = () => {
    const dateTimeStr =
      customDate === 'now'
        ? `Immediate Ride (PKT ${pktInfo.formattedTime})`
        : scheduledDateTime || 'Scheduled Trip';

    const url = generateWhatsAppBookingUrl({
      passengerName: passengerProfile.fullName,
      passengerPhone: passengerProfile.mobile,
      pickup: fromLocation,
      destination: toLocation,
      vehicle: selectedVehicle,
      dateTime: dateTimeStr,
      distanceKm: distance,
      farePkr: totalFare,
    });

    if (onShowSafetyToast) {
      onShowSafetyToast(getRandomSafetyReminder());
    }

    window.open(url, '_blank');
  };

  // Internal In-App Booking Confirmation (Saves totalFare to Firestore collection 'rides')
  const handleConfirmRide = () => {
    if (tripViolatesCurfew && fareConfig.curfewStrictEnforced) {
      alert(t.nightCurfewBlocked);
      return;
    }

    if (!fromLocation.trim() || !toLocation.trim()) {
      alert(lang === 'ur' ? 'براہ کرم روانگی اور منزل درج کریں' : 'Please provide From and To locations.');
      return;
    }

    if (onShowSafetyToast) {
      onShowSafetyToast(getRandomSafetyReminder());
    }

    const newBooking: RideBooking = {
      id: `EWR-${Math.floor(100000 + Math.random() * 900000)}`,
      passengerId: passengerProfile.id || `guest_${Date.now()}`,
      passengerName: passengerProfile.fullName || 'Multan Passenger',
      passengerPhone: passengerProfile.mobile || '03247150585',
      vehicleType: selectedVehicle,
      pickupLocation: pickup,
      destinationLocation: destination,
      pickupAddress: fromLocation,
      destinationAddress: toLocation,
      fromText: fromLocation,
      toText: toLocation,
      distanceKm: distance,
      perKmRate: currentRate,
      estimatedMinutes,
      estimatedFare: totalFare,
      totalFare: totalFare, // Saved directly to Firestore
      is30KmPackageApplied: false,
      paymentMethod,
      paymentStatus: 'pending',
      status: 'searching',
      bookingTime: new Date().toISOString(),
      scheduledTime: customDate === 'scheduled' ? scheduledDateTime : undefined,
    };

    onConfirmBooking(newBooking);
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-rose-100 flex flex-col gap-5">
      {/* Operating Hours & Curfew Header Banner */}
      <div
        className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-colors ${
          pktInfo.isNightCurfewActive
            ? 'bg-red-50 text-red-900 border-red-200'
            : 'bg-gradient-to-r from-pink-50 to-rose-50 text-pink-950 border-pink-200'
        }`}
      >
        <div
          className={`p-2 rounded-xl text-white shrink-0 ${
            pktInfo.isNightCurfewActive ? 'bg-red-600' : 'bg-pink-600'
          }`}
        >
          <Lock className="w-4 h-4" />
        </div>
        <div className="flex-1 text-xs">
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5">
              <span>{t.operatingHours}</span>
              <span className="text-[10px] bg-pink-100 text-pink-800 px-2 py-0.5 rounded-full font-semibold">
                06:00 AM - 10:00 PM PKT
              </span>
            </span>
            <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded-lg border border-pink-300 font-bold text-pink-700">
              {pktInfo.formattedTime}
            </span>
          </div>
          <p className="mt-1 opacity-90 leading-relaxed text-[11px]">
            {pktInfo.isNightCurfewActive
              ? t.nightCurfewBlocked
              : 'خواتین کے تحفظ کے لیے سروس صبح 6 بجے سے رات 10 بجے تک فعال ہے۔ تمام رائیڈز رات 10 بجے سے پہلے مکمل ہونی چاہئیں۔'}
          </p>
        </div>
      </div>

      {/* 2. From (کہاں سے) and To (کہاں تک) Inputs */}
      <div className="space-y-3.5 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200">
        {/* From Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-600 ring-4 ring-pink-100"></span>
              <span>From (کہاں سے)</span>
            </label>
            <span className="text-[10px] text-pink-700 font-bold bg-pink-100/80 px-2 py-0.5 rounded">
              Main Road Point
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              placeholder="کہاں سے روانہ ہونا ہے؟ (مثلاً: بوسن روڈ، گلگشت، کینٹ)"
              className="w-full text-xs font-medium bg-white border border-slate-300 rounded-xl px-3 py-2.5 pl-8 focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800 shadow-xs"
            />
            <MapPin className="w-4 h-4 text-pink-600 absolute left-2.5 top-3" />
          </div>
          {/* Quick Area Chips */}
          <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto pb-1 text-[10px] scrollbar-none">
            <span className="text-slate-500 font-semibold shrink-0">فوری انتخاب:</span>
            {POPULAR_HUBS.map((hub) => (
              <button
                key={`from_${hub}`}
                type="button"
                onClick={() => handleSelectFromPoint(hub)}
                className={`px-2 py-0.5 rounded-full border whitespace-nowrap transition-colors ${
                  fromLocation.includes(hub)
                    ? 'bg-pink-600 text-white border-pink-700 font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-pink-300'
                }`}
              >
                {hub}
              </button>
            ))}
          </div>
        </div>

        {/* To Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-100"></span>
              <span>To (کہاں تک)</span>
            </label>
            <span className="text-[10px] text-amber-800 font-bold bg-amber-100/80 px-2 py-0.5 rounded">
              Safe Dropoff
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              placeholder="کہاں پہنچنا ہے؟ (مثلاً: ماڈل ٹاؤن، ایم ڈی اے چوک، شالیمار)"
              className="w-full text-xs font-medium bg-white border border-slate-300 rounded-xl px-3 py-2.5 pl-8 focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800 shadow-xs"
            />
            <MapPin className="w-4 h-4 text-amber-500 absolute left-2.5 top-3" />
          </div>
          {/* Quick Area Chips */}
          <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto pb-1 text-[10px] scrollbar-none">
            <span className="text-slate-500 font-semibold shrink-0">فوری انتخاب:</span>
            {POPULAR_HUBS.map((hub) => (
              <button
                key={`to_${hub}`}
                type="button"
                onClick={() => handleSelectToPoint(hub)}
                className={`px-2 py-0.5 rounded-full border whitespace-nowrap transition-colors ${
                  toLocation.includes(hub)
                    ? 'bg-amber-600 text-white border-amber-700 font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
                }`}
              >
                {hub}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Distance in KM (کلومیٹر) Slider & Number Input (1 to 50 KM) */}
      <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
            <Calculator className="w-4 h-4 text-pink-600" />
            <span>Distance in KM (کلومیٹر)</span>
          </label>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-xl border border-pink-300 shadow-xs">
            <input
              type="number"
              min={1}
              max={50}
              value={distance}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 1 && val <= 50) setDistance(val);
                else if (val < 1) setDistance(1);
                else if (val > 50) setDistance(50);
              }}
              className="w-12 text-center text-sm font-black font-mono text-pink-700 focus:outline-none"
            />
            <span className="text-xs font-extrabold text-slate-600 font-mono">KM</span>
          </div>
        </div>

        {/* Range Slider (1 to 50 KM) */}
        <div className="space-y-1">
          <input
            type="range"
            min={1}
            max={50}
            step={1}
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full h-2.5 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono font-semibold">
            <span>1 KM</span>
            <span>10 KM</span>
            <span>25 KM</span>
            <span>40 KM</span>
            <span>50 KM</span>
          </div>
        </div>

        {/* Quick Distance Presets */}
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          <span className="text-[11px] font-bold text-slate-600">Quick KM:</span>
          {[2, 4, 7, 10, 15, 25, 35].map((kmVal) => (
            <button
              key={`preset_${kmVal}`}
              type="button"
              onClick={() => setDistance(kmVal)}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                distance === kmVal
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-pink-100 hover:text-pink-900'
              }`}
            >
              {kmVal} KM
            </button>
          ))}
        </div>
      </div>

      {/* 4. 3 Cards to select Vehicle Type */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
            <span>سواری کا انتخاب کریں (Select Vehicle Type)</span>
          </span>
          <span className="text-[11px] text-pink-700 font-bold bg-pink-100 px-2 py-0.5 rounded">
            فکس فی کلومیٹر ریٹ
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card 1: Bike (30 Rs/KM) */}
          <div
            onClick={() => setSelectedVehicle('bike')}
            className={`cursor-pointer rounded-2xl p-3 border-2 transition-all flex flex-col justify-between relative overflow-hidden ${
              selectedVehicle === 'bike'
                ? 'border-pink-600 bg-pink-50/60 shadow-lg ring-2 ring-pink-500/50 scale-[1.01]'
                : 'border-slate-200 bg-white hover:border-pink-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1">
                <Bike className="w-4 h-4 text-pink-600" />
                <span>Bike</span>
              </span>
              <span className="text-[11px] font-black text-pink-700 bg-pink-100 px-2 py-0.5 rounded-full border border-pink-200">
                30 Rs/KM
              </span>
            </div>

            <div className="h-24 w-full rounded-xl overflow-hidden mb-2 bg-pink-100/40 relative">
              <img
                src="/src/assets/images/vehicle_women_bike_1793507620830.jpg"
                alt="Women Bike Ride Multan"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="text-[11px] text-slate-600 font-medium mb-1">
              تیز ترین اور کفایتی سفر
            </div>

            <div className="flex items-baseline justify-between mt-auto pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-500 font-bold font-mono">
                {distance} KM x 30
              </span>
              <span className="text-base font-black text-pink-700 font-mono">
                PKR {distance * 30}
              </span>
            </div>
          </div>

          {/* Card 2: Scooty (30 Rs/KM) */}
          <div
            onClick={() => setSelectedVehicle('scooty')}
            className={`cursor-pointer rounded-2xl p-3 border-2 transition-all flex flex-col justify-between relative overflow-hidden ${
              selectedVehicle === 'scooty'
                ? 'border-pink-600 bg-pink-50/60 shadow-lg ring-2 ring-pink-500/50 scale-[1.01]'
                : 'border-slate-200 bg-white hover:border-pink-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1">
                <Bike className="w-4 h-4 text-pink-600" />
                <span>Scooty</span>
              </span>
              <span className="text-[11px] font-black text-pink-700 bg-pink-100 px-2 py-0.5 rounded-full border border-pink-200">
                30 Rs/KM
              </span>
            </div>

            <div className="h-24 w-full rounded-xl overflow-hidden mb-2 bg-pink-100/40 relative">
              <img
                src="/src/assets/images/vehicle_women_scooty_1793507621173.jpg"
                alt="Women Scooty Ride Multan"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="text-[11px] text-slate-600 font-medium mb-1">
              خواتین کے لیے آرام دہ اور مقبول
            </div>

            <div className="flex items-baseline justify-between mt-auto pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-500 font-bold font-mono">
                {distance} KM x 30
              </span>
              <span className="text-base font-black text-pink-700 font-mono">
                PKR {distance * 30}
              </span>
            </div>
          </div>

          {/* Card 3: Car (80 Rs/KM) with AC */}
          <div
            onClick={() => setSelectedVehicle('car')}
            className={`cursor-pointer rounded-2xl p-3 border-2 transition-all flex flex-col justify-between relative overflow-hidden ${
              selectedVehicle === 'car'
                ? 'border-pink-600 bg-pink-50/60 shadow-lg ring-2 ring-pink-500/50 scale-[1.01]'
                : 'border-slate-200 bg-white hover:border-pink-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1">
                <Car className="w-4 h-4 text-pink-600" />
                <span>Car with AC</span>
              </span>
              <span className="text-[11px] font-black text-pink-700 bg-pink-100 px-2 py-0.5 rounded-full border border-pink-200">
                80 Rs/KM
              </span>
            </div>

            <div className="h-24 w-full rounded-xl overflow-hidden mb-2 bg-pink-100/40 relative">
              <img
                src="/src/assets/images/vehicle_women_car_1793507620855.jpg"
                alt="Women AC Car Ride Multan"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="text-[11px] text-slate-600 font-medium mb-1">
              مکمل ایئر کنڈیشنڈ پرائیویٹ فیملی کار
            </div>

            <div className="flex items-baseline justify-between mt-auto pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-500 font-bold font-mono">
                {distance} KM x 80
              </span>
              <span className="text-base font-black text-pink-700 font-mono">
                PKR {distance * 80}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Breakdown in UI + Big Pink Box */}
      <div className="bg-gradient-to-br from-pink-600 via-rose-600 to-pink-700 rounded-2xl p-5 text-white shadow-xl shadow-pink-600/30 border border-pink-400 relative overflow-hidden text-center">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

        {/* Breakdown badges */}
        <div className="flex items-center justify-center gap-3 text-xs font-semibold mb-3">
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
            Per KM Rate: <span className="font-black font-mono">{currentRate} Rs/KM</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
            Total Distance: <span className="font-black font-mono">{distance} KM</span>
          </div>
        </div>

        {/* Big Amount */}
        <div className="text-xs uppercase tracking-wider text-pink-100 font-bold mb-1">
          کل رقم (Total Amount)
        </div>
        <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white drop-shadow-sm mb-2">
          Rs. {totalFare}
        </div>

        {/* Instant Urdu Calculation Line */}
        <div className="bg-black/20 backdrop-blur-md rounded-xl py-2 px-3 mx-auto inline-block border border-white/20 mb-2">
          <span className="text-sm sm:text-base font-extrabold text-amber-200">
            آپ کا کل کرایہ: {totalFare} روپے ({distance} کلومیٹر x {currentRate} روپے)
          </span>
        </div>

        {/* Fixed Rate Guarantee Text */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-white/95 font-bold pt-1">
          <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>فکس ریٹ، کوئی اضافی چارج نہیں (Fixed Rate, No Extra Charges)</span>
        </div>
      </div>

      {/* Date & Time Selector */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <button
          type="button"
          onClick={() => setCustomDate('now')}
          className={`py-2.5 px-3 rounded-xl font-bold border flex items-center justify-center gap-1.5 transition-all ${
            customDate === 'now'
              ? 'bg-pink-600 text-white border-pink-700 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{t.rideNow}</span>
        </button>

        <button
          type="button"
          onClick={() => setCustomDate('scheduled')}
          className={`py-2.5 px-3 rounded-xl font-bold border flex items-center justify-center gap-1.5 transition-all ${
            customDate === 'scheduled'
              ? 'bg-pink-600 text-white border-pink-700 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{t.scheduleLater}</span>
        </button>
      </div>

      {customDate === 'scheduled' && (
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
          <label className="text-[11px] font-bold text-slate-700 block mb-1">
            Pick Date & Time (Between 06:00 AM – 09:30 PM PKT):
          </label>
          <input
            type="datetime-local"
            value={scheduledDateTime}
            onChange={(e) => setScheduledDateTime(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 font-medium"
          />
        </div>
      )}

      {/* Payment Method Selector */}
      <div>
        <label className="text-xs font-bold text-slate-800 block mb-1.5">ادائیگی کا طریقہ (Payment Method):</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[
            { id: 'cash', label: 'Cash on Drop-off' },
            { id: 'easypaisa', label: 'Easypaisa' },
            { id: 'jazzcash', label: 'JazzCash' },
            { id: 'bank_transfer', label: 'Bank Transfer' },
          ].map((pm) => (
            <button
              key={pm.id}
              type="button"
              onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
              className={`p-2 rounded-xl text-center border font-medium transition-all ${
                paymentMethod === pm.id
                  ? 'border-pink-600 bg-pink-100 text-pink-900 font-bold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {pm.label}
            </button>
          ))}
        </div>
      </div>

      {/* Curfew Alert before action buttons */}
      {tripViolatesCurfew && (
        <div className="p-3 rounded-2xl bg-red-100 border border-red-300 text-xs text-red-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">10:00 PM Safety Curfew Alert:</span>
            <span>{t.rideWillExceedCurfew}</span>
          </div>
        </div>
      )}

      {/* Action Buttons: BOOK ON WHATSAPP & In-App Direct Booking */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {/* Prominent WhatsApp Button */}
        <button
          type="button"
          onClick={handleBookOnWhatsApp}
          className="flex-1 py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-[0.98] transition-all"
        >
          <MessageCircle className="w-5 h-5 text-emerald-200" />
          <span>{t.bookOnWhatsapp} (03247150585)</span>
        </button>

        {/* In-App Direct Booking (Saves to Firestore) */}
        <button
          type="button"
          onClick={handleConfirmRide}
          disabled={tripViolatesCurfew && fareConfig.curfewStrictEnforced}
          className={`flex-1 py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
            tripViolatesCurfew && fareConfig.curfewStrictEnforced
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:from-pink-700 hover:to-amber-700 text-white shadow-pink-600/30 active:scale-[0.98]'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 text-amber-200" />
          <span>{lang === 'ur' ? 'ابھی محفوظ رائیڈ بک کریں' : 'BOOK SAFE RIDE NOW'}</span>
        </button>
      </div>

      {/* Safety Guarantee Footnote */}
      <div className="text-[11px] text-center text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-pink-600" />
        <span>100% Women Passengers & Verified Women Drivers in Multan</span>
      </div>
    </div>
  );
};
