import React, { useState, useEffect } from 'react';
import { DriverProfile, Language, FareConfig, RideBooking } from '../types';
import { getCurrentPktTime } from '../utils/pktTime';
import { translations } from '../data/translations';
import { playRideIncomingTone, playNotificationChime } from '../utils/audio';
import {
  ShieldCheck,
  Power,
  DollarSign,
  TrendingUp,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Car,
  Bike,
  Sparkles,
  Lock,
  BarChart3,
  Calendar,
  Send,
  CheckCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface DriverDashboardProps {
  driver: DriverProfile;
  lang: Language;
  fareConfig: FareConfig;
  onUpdateDriver: (updated: Partial<DriverProfile>) => void;
  onOpenSos: () => void;
  onOpenHelp: () => void;
  onAcceptIncomingRide?: (booking: RideBooking) => void;
}

export const DriverDashboard: React.FC<DriverDashboardProps> = ({
  driver,
  lang,
  fareConfig,
  onUpdateDriver,
  onOpenSos,
  onOpenHelp,
  onAcceptIncomingRide,
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'requests' | 'earnings' | 'vehicle' | 'documents'>('requests');
  const [incomingRequest, setIncomingRequest] = useState<RideBooking | null>(null);
  const [requestCountdown, setRequestCountdown] = useState(25);
  const [activeTrip, setActiveTrip] = useState<RideBooking | null>(null);
  const [tripStep, setTripStep] = useState<'arriving' | 'arrived' | 'in_transit' | 'finished'>('arriving');
  const [sentSms, setSentSms] = useState<{
    id: string;
    recipientPhone: string;
    passengerName: string;
    messageText: string;
    sentAt: string;
    status: 'delivered';
  } | null>(null);

  const pktInfo = getCurrentPktTime(fareConfig.morningStartHourPKT, fareConfig.nightCurfewHourPKT);

  // Automatic curfew shutdown for drivers at 10:00 PM PKT
  useEffect(() => {
    if (pktInfo.isNightCurfewActive && driver.isOnline) {
      onUpdateDriver({ isOnline: false });
    }
  }, [pktInfo.isNightCurfewActive, driver.isOnline, onUpdateDriver]);

  // Demo incoming request simulator when driver is online and approved
  useEffect(() => {
    if (driver.isOnline && driver.isApproved && !incomingRequest && !activeTrip && !pktInfo.isNightCurfewActive) {
      const timer = setTimeout(() => {
        playRideIncomingTone();
        setIncomingRequest({
          id: `EWR-${Math.floor(100000 + Math.random() * 900000)}`,
          passengerId: 'p-101',
          passengerName: 'Fatima Zahra',
          passengerPhone: '03001234567',
          vehicleType: driver.vehicleType,
          pickupLocation: {
            id: 'gulgasht',
            name: 'Gulgasht Main Gol Bagh Commercial Market',
            nameUrdu: 'گلگشت مین گول باغ',
            roadName: 'Pir Khurshid Colony Road',
            lat: 30.2291,
            lng: 71.4883,
            isMainRoad: true,
            isSafeHub: true,
            landmark: 'Gol Bagh Market',
            description: 'Approved Main Road Safe Point',
          },
          destinationLocation: {
            id: 'mall_multan',
            name: 'Mall of Multan, Bosan Road',
            nameUrdu: 'مال آف ملتان، بوسن روڈ',
            roadName: 'Bosan Road',
            lat: 30.2396,
            lng: 71.4991,
            isMainRoad: true,
            isSafeHub: true,
            landmark: 'Mall of Multan',
            description: 'Approved Safe Hub',
          },
          pickupAddress: 'Gulgasht Main Gol Bagh Commercial Market',
          destinationAddress: 'Mall of Multan, Bosan Road',
          distanceKm: 5.4,
          estimatedMinutes: 14,
          estimatedFare: driver.vehicleType === 'car' ? 432 : 162,
          totalFare: driver.vehicleType === 'car' ? 432 : 162,
          perKmRate: driver.vehicleType === 'car' ? 80 : 30,
          is30KmPackageApplied: false,
          paymentMethod: 'cash',
          paymentStatus: 'pending',
          status: 'searching',
          bookingTime: new Date().toISOString(),
        });
        setRequestCountdown(25);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [driver.isOnline, driver.isApproved, incomingRequest, activeTrip, pktInfo.isNightCurfewActive, driver.vehicleType]);

  // Request countdown timer
  useEffect(() => {
    if (incomingRequest) {
      if (requestCountdown <= 0) {
        setIncomingRequest(null);
      } else {
        const cd = setInterval(() => {
          setRequestCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(cd);
      }
    }
  }, [incomingRequest, requestCountdown]);

  const handleToggleOnline = () => {
    if (pktInfo.isNightCurfewActive) {
      alert(t.nightCurfewBlocked);
      return;
    }
    if (!driver.isApproved) {
      alert('Your driver documents are pending Admin approval. You cannot go online until approved.');
      return;
    }
    onUpdateDriver({ isOnline: !driver.isOnline });
  };

  const handleAcceptRequest = () => {
    if (!incomingRequest) return;
    playNotificationChime();
    setActiveTrip({ ...incomingRequest, status: 'driver_arriving' });
    setTripStep('arriving');
    setSentSms(null);
    setIncomingRequest(null);
    if (onAcceptIncomingRide) {
      onAcceptIncomingRide(incomingRequest);
    }
  };

  const handleDriverMarkArrived = () => {
    if (!activeTrip) return;
    setTripStep('arrived');
    playNotificationChime();

    const vehicleLabel =
      driver.vehicleType === 'bike' ? 'Bike' : driver.vehicleType === 'scooty' ? 'Scooty' : 'Car';
    const pickupLocName = activeTrip.pickupLocation?.name || activeTrip.pickupAddress;

    // Templated SMS sent automatically to passenger's phone
    const templateSms = `[EAGLE WOMEN'S RIDE] Assalam-o-Alaikum ${activeTrip.passengerName}! Your captain ${driver.fullName} has ARRIVED at your pickup point: ${pickupLocName}. Vehicle: ${vehicleLabel} (${driver.vehicleNumber}). Please proceed to board safely. Support Helpline: 03247150585.`;

    const newSmsRecord = {
      id: `SMS-${Date.now()}`,
      recipientPhone: activeTrip.passengerPhone,
      passengerName: activeTrip.passengerName,
      messageText: templateSms,
      sentAt: new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      status: 'delivered' as const,
    };

    setSentSms(newSmsRecord);

    // On mobile devices, trigger SMS intent if supported
    try {
      const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = `sms:${activeTrip.passengerPhone}?body=${encodeURIComponent(templateSms)}`;
      }
    } catch (err) {
      console.log('Automated SMS link intent:', err);
    }
  };

  const handleRejectRequest = () => {
    setIncomingRequest(null);
  };

  const handleCompleteActiveRide = () => {
    if (!activeTrip) return;
    playNotificationChime();
    const earned = activeTrip.estimatedFare;
    onUpdateDriver({
      todayEarnings: driver.todayEarnings + earned,
      weeklyEarnings: driver.weeklyEarnings + earned,
      totalTrips: driver.totalTrips + 1,
    });
    setTripStep('finished');
    setTimeout(() => {
      setActiveTrip(null);
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Driver Status Banner */}
      <div className="bg-white rounded-3xl p-5 shadow-lg border border-rose-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="/src/assets/images/eagle_logo_crest_1793507620161.jpg"
              alt="Driver Avatar"
              className="w-14 h-14 rounded-full object-cover border-2 border-pink-600 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                driver.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            ></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900">{driver.fullName}</h2>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  driver.isApproved
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                {driver.isApproved ? 'Admin Verified Driver' : 'Pending Verification'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-600 mt-1 font-medium">
              <span>{driver.mobile}</span>
              <span>·</span>
              <span className="font-mono">{driver.vehicleNumber}</span>
              <span>·</span>
              <span className="capitalize text-pink-700 font-semibold">{driver.vehicleType}</span>
            </div>
          </div>
        </div>

        {/* Go Online / Offline Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleOnline}
            disabled={pktInfo.isNightCurfewActive || !driver.isApproved}
            className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 shadow-md transition-all ${
              driver.isOnline
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                : 'bg-slate-800 hover:bg-slate-900 text-white'
            } ${
              pktInfo.isNightCurfewActive || !driver.isApproved
                ? 'opacity-60 cursor-not-allowed'
                : 'active:scale-95'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{driver.isOnline ? 'ONLINE (Accepting Rides)' : 'GO ONLINE'}</span>
          </button>
        </div>
      </div>

      {/* Night Curfew Notice for Drivers */}
      <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
        pktInfo.isNightCurfewActive
          ? 'bg-red-50 text-red-900 border-red-200'
          : 'bg-amber-50 text-amber-950 border-amber-200'
      }`}>
        <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold block">
            Operating Hours: 06:00 AM – 10:00 PM (Current Multan PKT: {pktInfo.formattedTime})
          </span>
          <p className="mt-0.5 opacity-90">
            {pktInfo.isNightCurfewActive
              ? "Driver service is currently closed for the night curfew. No new ride requests can be accepted until 06:00 AM."
              : "All drivers are automatically logged offline at 10:00 PM PKT sharp. Only trips concluding before 10:00 PM may be initiated."}
          </p>
        </div>
      </div>

      {/* KPI Earnings Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Today's Earnings</span>
          <span className="text-xl font-extrabold text-pink-700 font-mono mt-1 block">
            PKR {driver.todayEarnings}
          </span>
          <span className="text-[10px] text-emerald-600 font-medium">+100% women safety</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Weekly Earnings</span>
          <span className="text-xl font-extrabold text-slate-900 font-mono mt-1 block">
            PKR {driver.weeklyEarnings}
          </span>
          <span className="text-[10px] text-slate-500 font-medium">Transferred every Tuesday</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Safe Trips</span>
          <span className="text-xl font-extrabold text-slate-900 font-mono mt-1 block">
            {driver.totalTrips}
          </span>
          <span className="text-[10px] text-pink-700 font-medium">Multan City Corridor</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Driver Rating</span>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xl font-extrabold text-amber-600 font-mono">{driver.rating}</span>
            <span className="text-amber-500 text-sm">★★★★★</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-medium">Verified by Eagle Admin</span>
        </div>
      </div>

      {/* Visual Chart: Daily Earnings Trend Over the Past Week (recharts) */}
      <div className="bg-white rounded-3xl p-5 shadow-lg border border-rose-100 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-rose-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-pink-100 text-pink-700">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Daily Earnings Trend (Past 7 Days)
              </h3>
              <p className="text-[11px] text-slate-500">
                Performance history across Multan safe main road corridors
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">7-Day Total</span>
              <span className="text-sm font-extrabold text-pink-700 font-mono">
                PKR {(driver.weeklyEarnings || 16400).toLocaleString()}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Daily Average</span>
              <span className="text-sm font-extrabold text-amber-600 font-mono">
                PKR {Math.round((driver.weeklyEarnings || 16400) / 7).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="w-full h-64 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={[
                { day: 'Mon', date: 'Oct 26', earnings: 2100, trips: 7 },
                { day: 'Tue', date: 'Oct 27', earnings: 2650, trips: 9 },
                { day: 'Wed', date: 'Oct 28', earnings: 1950, trips: 6 },
                { day: 'Thu', date: 'Oct 29', earnings: 3200, trips: 11 },
                { day: 'Fri', date: 'Oct 30', earnings: 3650, trips: 12 },
                { day: 'Sat', date: 'Oct 31', earnings: 2850, trips: 10 },
                {
                  day: 'Today',
                  date: 'Nov 01',
                  earnings: driver.todayEarnings || 2850,
                  trips: Math.max(1, Math.round((driver.todayEarnings || 2850) / 280)),
                },
              ]}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#be185d" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#be185d" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffe4e6" vertical={false} />
              <XAxis
                dataKey="day"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#f1f5f9' }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between gap-4 font-bold border-b border-slate-800 pb-1">
                          <span className="text-amber-300">{data.day}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{data.date}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 pt-0.5">
                          <span className="text-slate-400">Earnings:</span>
                          <span className="font-extrabold font-mono text-pink-300">
                            PKR {data.earnings.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-[11px]">
                          <span className="text-slate-400">Safe Trips:</span>
                          <span className="font-semibold text-emerald-400">{data.trips} rides</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="earnings"
                stroke="#be185d"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#earningsGradient)"
                activeDot={{
                  r: 6,
                  fill: '#f59e0b',
                  stroke: '#be185d',
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-600"></span>
            Peak day: <strong>Friday (PKR 3,650)</strong>
          </span>
          <span className="text-emerald-700 font-semibold">
            ✓ 0% commission deducted on women driver incentive tier
          </span>
        </div>
      </div>

      {/* Incoming Ride Request Modal (Audio + 25s Countdown) */}
      {incomingRequest && (
        <div className="bg-gradient-to-r from-pink-900 to-rose-950 text-white rounded-3xl p-5 shadow-2xl border-2 border-amber-400 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-pink-700/60">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping"></span>
              <span className="font-extrabold text-sm uppercase tracking-wider text-amber-300">
                Incoming Women Ride Request!
              </span>
            </div>
            <span className="font-mono text-sm bg-amber-400 text-slate-900 px-2 py-0.5 rounded font-black">
              {requestCountdown}s
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-pink-200">Passenger:</span>
                <span className="font-extrabold text-sm">{incomingRequest.passengerName}</span>
                <span className="text-[10px] bg-pink-800 text-pink-200 px-1.5 py-0.2 rounded font-semibold">
                  CNIC Verified
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-200">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                  <span>Pickup: {incomingRequest.pickupAddress}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>Drop: {incomingRequest.destinationAddress}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between sm:items-end">
              <div>
                <span className="text-xs text-pink-300 block sm:text-right">Estimated Fare:</span>
                <span className="text-2xl font-black text-amber-300 font-mono block sm:text-right">
                  PKR {incomingRequest.estimatedFare}
                </span>
                <span className="text-[11px] text-slate-300 block sm:text-right font-medium">
                  Distance: {incomingRequest.distanceKm} KM (~{incomingRequest.estimatedMinutes} mins)
                </span>
              </div>

              <div className="flex items-center gap-2 mt-4 w-full sm:w-auto">
                <button
                  onClick={handleRejectRequest}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                >
                  Decline
                </button>
                <button
                  onClick={handleAcceptRequest}
                  className="flex-1 sm:flex-none px-6 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/25"
                >
                  Accept Ride
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Trip Navigation Card */}
      {activeTrip && (
        <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-pink-500">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-extrabold text-sm text-slate-900">
                {tripStep === 'arriving' && 'Step 1: Navigating to Pickup Point'}
                {tripStep === 'arrived' && 'Step 2: Arrived at Pickup Point'}
                {tripStep === 'in_transit' && 'Step 3: Driving Passenger to Destination'}
                {tripStep === 'finished' && 'Trip Completed! Collecting Fare'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${activeTrip.passengerPhone}`}
                className="p-2 rounded-xl bg-pink-100 text-pink-800 hover:bg-pink-200 flex items-center gap-1 text-xs font-bold"
              >
                <Phone className="w-3.5 h-3.5 text-pink-700" />
                <span>Call Passenger</span>
              </a>

              <a
                href={`https://wa.me/923247150585?text=Hello%20${activeTrip.passengerName},%20I%20am%20your%20Eagle%20Women%20Rider.`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 flex items-center gap-1 text-xs font-bold"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="py-4 space-y-2 text-xs">
            <p className="font-semibold text-slate-800">
              Passenger: <span className="font-bold text-pink-700">{activeTrip.passengerName}</span>
            </p>
            <p className="text-slate-600">
              Pickup Safe Point: <span className="font-semibold text-slate-800">{activeTrip.pickupAddress}</span>
            </p>
            <p className="text-slate-600">
              Drop Destination: <span className="font-semibold text-slate-800">{activeTrip.destinationAddress}</span>
            </p>
            <p className="font-mono text-sm font-bold text-pink-700">
              Collect Fare: PKR {activeTrip.estimatedFare} ({activeTrip.paymentMethod.toUpperCase()})
            </p>
          </div>

          {/* Step Actions */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            {tripStep === 'arriving' && (
              <button
                onClick={handleDriverMarkArrived}
                className="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>Confirm: I Have Arrived (Auto-Sends SMS to Passenger)</span>
              </button>
            )}

            {/* Automated SMS Delivery Card */}
            {sentSms && tripStep !== 'finished' && (
              <div className="p-3.5 bg-emerald-50/90 rounded-2xl border border-emerald-200 text-xs space-y-2 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold">
                    <CheckCheck className="w-4 h-4 text-emerald-600" />
                    <span>Automated SMS Sent to Passenger</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                    Delivered: {sentSms.sentAt}
                  </span>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-emerald-200/80 text-[11px] font-mono text-slate-800 leading-relaxed shadow-xs">
                  {sentSms.messageText}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] pt-1">
                  <span className="text-emerald-800 font-medium">
                    Sent to: <strong className="font-mono text-slate-900">{sentSms.recipientPhone}</strong> ({sentSms.passengerName})
                  </span>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`sms:${sentSms.recipientPhone}?body=${encodeURIComponent(sentSms.messageText)}`}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <Send className="w-3 h-3 text-emerald-200" />
                      <span>Resend SMS</span>
                    </a>
                    <a
                      href={`https://wa.me/92${sentSms.recipientPhone.replace(/^0/, '')}?text=${encodeURIComponent(sentSms.messageText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>WhatsApp Copy</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {tripStep === 'arrived' && (
              <button
                onClick={() => setTripStep('in_transit')}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md active:scale-[0.99] transition-all"
              >
                Passenger Onboard: Start Safe Ride
              </button>
            )}

            {tripStep === 'in_transit' && (
              <button
                onClick={handleCompleteActiveRide}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md"
              >
                Arrived at Destination: Complete Ride & Collect PKR {activeTrip.estimatedFare}
              </button>
            )}

            {tripStep === 'finished' && (
              <div className="w-full py-2 bg-emerald-50 text-emerald-800 font-bold text-center rounded-xl border border-emerald-200">
                ✓ Fare Collected Successfully! Today's earnings updated.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Driver Tabs (Vehicle Details, Documents, History) */}
      <div className="bg-white rounded-3xl p-5 shadow-lg border border-rose-100">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'requests' ? 'bg-pink-100 text-pink-900' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Vehicle Information
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'earnings' ? 'bg-pink-100 text-pink-900' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Earnings Breakdown
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'documents' ? 'bg-pink-100 text-pink-900' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Verification Documents
          </button>
        </div>

        {activeTab === 'requests' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-800">Vehicle Profile</h4>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Category:</span>
                <span className="font-bold capitalize text-pink-700">{driver.vehicleType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Model / Make:</span>
                <span className="font-bold text-slate-800">{driver.vehicleModel}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Registration Number:</span>
                <span className="font-bold font-mono text-slate-800">{driver.vehicleNumber}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">City Jurisdiction:</span>
                <span className="font-bold text-slate-800">Multan, Punjab</span>
              </div>
            </div>

            <div className="space-y-2 bg-pink-50/60 p-4 rounded-2xl border border-pink-200">
              <h4 className="font-bold text-pink-900">Driver Safety Protocol</h4>
              <ul className="space-y-1.5 text-slate-700">
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                  <span>Only female passengers are permitted to ride.</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                  <span>Always stick to approved main roads (Bosan Rd, Cantt, Gulgasht).</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                  <span>Service automatically concludes at 10:00 PM PKT.</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                  <span>Support Helpline (03247150585) available for any roadside issue.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-rose-50/70 rounded-2xl border border-rose-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Weekly Payout Method</span>
                <span className="text-sm font-extrabold text-pink-700 block mt-0.5">Easypaisa / JazzCash</span>
                <span className="text-[10px] text-slate-500 font-mono">03247150585 (Verified)</span>
              </div>

              <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Next Auto Settlement</span>
                <span className="text-sm font-extrabold text-amber-800 block mt-0.5">Tuesday, 10:00 AM</span>
                <span className="text-[10px] text-amber-900 font-semibold">Automatic direct bank release</span>
              </div>

              <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Driver Safety Bonus</span>
                <span className="text-sm font-extrabold text-emerald-800 block mt-0.5">+ PKR 1,500</span>
                <span className="text-[10px] text-emerald-700">100% Curfew & Rating compliance</span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-2.5 font-bold text-slate-800 border-b border-slate-200 flex justify-between">
                <span>7-Day Daily Earning Log</span>
                <span className="text-pink-700 font-mono">Total: PKR {(driver.weeklyEarnings || 16400).toLocaleString()}</span>
              </div>

              <div className="divide-y divide-slate-100 text-[11px]">
                {[
                  { day: 'Friday', date: 'Oct 30', rides: 12, pkr: 3650, status: 'Settled' },
                  { day: 'Thursday', date: 'Oct 29', rides: 11, pkr: 3200, status: 'Settled' },
                  { day: 'Saturday', date: 'Oct 31', rides: 10, pkr: 2850, status: 'Settled' },
                  { day: 'Tuesday', date: 'Oct 27', rides: 9, pkr: 2650, status: 'Settled' },
                  { day: 'Today', date: 'Nov 01', rides: Math.max(1, Math.round((driver.todayEarnings || 2850) / 280)), pkr: driver.todayEarnings || 2850, status: 'Accruing' },
                  { day: 'Monday', date: 'Oct 26', rides: 7, pkr: 2100, status: 'Settled' },
                  { day: 'Wednesday', date: 'Oct 28', rides: 6, pkr: 1950, status: 'Settled' },
                ].map((row, idx) => (
                  <div key={idx} className="px-4 py-2 flex items-center justify-between hover:bg-slate-50/60">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 w-18">{row.day}</span>
                      <span className="text-slate-400 font-mono">{row.date}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-500">{row.rides} rides</span>
                      <span className="font-bold font-mono text-slate-900 w-20 text-right">PKR {row.pkr.toLocaleString()}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${row.status === 'Accruing' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'}`}>
                        {row.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 flex items-center justify-between">
              <div>
                <span className="font-bold block">NADRA & Licensing Verification Status:</span>
                <span className="text-[11px] opacity-90">All documents are stored privately in encrypted storage.</span>
              </div>
              <span className="font-extrabold px-2.5 py-1 rounded bg-amber-200 text-amber-900">
                {driver.isApproved ? 'Approved by Admin' : 'Under Review'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { title: 'CNIC Front', status: 'Uploaded' },
                { title: 'CNIC Back', status: 'Uploaded' },
                { title: 'Driving Licence', status: 'Verified' },
                { title: 'Vehicle Reg. Book', status: 'Verified' },
              ].map((doc, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <FileText className="w-6 h-6 text-pink-600 mx-auto mb-1" />
                  <span className="font-bold text-slate-800 block">{doc.title}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">{doc.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
