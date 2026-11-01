/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Language,
  UserRole,
  LocationPoint,
  FareConfig,
  RideBooking,
  PassengerProfile,
  DriverProfile,
  ComplaintReport,
} from './types';
import { APPROVED_SAFE_LOCATIONS } from './data/multanLocations';
import { DEFAULT_FARE_CONFIG } from './utils/fareCalculator';
import { getCurrentPktTime } from './utils/pktTime';
import { translations } from './data/translations';
import { Header } from './components/Header';
import { SupportHotbar } from './components/SupportHotbar';
import { BookingForm } from './components/BookingForm';
import { MapLeaflet } from './components/MapLeaflet';
import { ActiveRideModal } from './components/ActiveRideModal';
import { SafetySOSModal } from './components/SafetySOSModal';
import { HelpSupportModal } from './components/HelpSupportModal';
import { AndroidInstallModal } from './components/AndroidInstallModal';
import { ProfileModal } from './components/ProfileModal';
import { PlayStoreSubmissionModal } from './components/PlayStoreSubmissionModal';
import { RidingAcademyAd } from './components/RidingAcademyAd';
import { RidingAcademyModal } from './components/RidingAcademyModal';
import { ToastContainer, ToastMessage, getRandomSafetyReminder } from './components/ToastNotification';
import { playNotificationChime } from './utils/audio';
import { DriverDashboard } from './components/DriverDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import {
  ShieldCheck,
  Phone,
  MessageCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Sparkles,
  Smartphone,
  Star,
  UserCheck,
  Car,
  Bike,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';
import { saveRideBooking, loadSavedRides, updateRideStatus } from './services/ridesService';
import { getStoredSession, signInGoogle, continueAsGuest, UserSession } from './services/authService';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [currentRole, setCurrentRole] = useState<UserRole>('passenger');

  // Locations state
  const [safeLocations, setSafeLocations] = useState<LocationPoint[]>(APPROVED_SAFE_LOCATIONS);
  const [pickupLocation, setPickupLocation] = useState<LocationPoint>(safeLocations[0]);
  const [destLocation, setDestLocation] = useState<LocationPoint>(safeLocations[1]);
  const [selectedMapMode, setSelectedMapMode] = useState<'pickup' | 'destination' | null>(null);

  // Fare Configuration state
  const [fareConfig, setFareConfig] = useState<FareConfig>(DEFAULT_FARE_CONFIG);

  // Active user profiles
  const [passengerProfile, setPassengerProfile] = useState<PassengerProfile>({
    id: 'pass_multan_1',
    fullName: 'Zainab Ahmed',
    mobile: '03247150585',
    cnic: '36302-9847123-4',
    photoUrl: '/src/assets/images/eagle_logo_crest_1793507620161.jpg',
    emergencyContactName: 'Razia Begum (Mother)',
    emergencyContactPhone: '03001234567',
    isOtpVerified: true,
    isCnicVerified: true,
    isApproved: true,
    rating: 4.95,
    totalRides: 18,
  });

  const [drivers, setDrivers] = useState<DriverProfile[]>([
    {
      id: 'drv_1',
      fullName: 'Ayesha Bibi',
      mobile: '03247150585',
      cnic: '36302-1984732-2',
      cnicFrontUrl: '/docs/cnic_front.jpg',
      cnicBackUrl: '/docs/cnic_back.jpg',
      selfieUrl: '/docs/selfie.jpg',
      drivingLicenceNumber: 'MLT-2023-8891',
      drivingLicenceUrl: '/docs/licence.jpg',
      vehicleRegistrationUrl: '/docs/reg.jpg',
      vehiclePhotos: ['/src/assets/images/vehicle_women_scooty_1793507621173.jpg'],
      vehicleType: 'scooty',
      vehicleModel: 'Honda CD / Scooty 110',
      vehicleNumber: 'MN-24-7860',
      isApproved: true,
      approvalStatus: 'approved',
      isOnline: true,
      rating: 4.9,
      totalTrips: 142,
      currentLat: 30.2291,
      currentLng: 71.4883,
      todayEarnings: 2850,
      weeklyEarnings: 16400,
      acceptanceRate: 98,
    },
    {
      id: 'drv_2',
      fullName: 'Sadia Malik',
      mobile: '03217654321',
      cnic: '36302-5541298-6',
      cnicFrontUrl: '/docs/cnic_front_2.jpg',
      cnicBackUrl: '/docs/cnic_back_2.jpg',
      selfieUrl: '/docs/selfie_2.jpg',
      drivingLicenceNumber: 'MLT-2024-3412',
      drivingLicenceUrl: '/docs/licence_2.jpg',
      vehicleRegistrationUrl: '/docs/reg_2.jpg',
      vehiclePhotos: ['/src/assets/images/vehicle_women_bike_1793507620830.jpg'],
      vehicleType: 'bike',
      vehicleModel: 'Yamaha YBR 125 Pink',
      vehicleNumber: 'MN-23-4591',
      isApproved: true,
      approvalStatus: 'approved',
      isOnline: false,
      rating: 4.85,
      totalTrips: 89,
      currentLat: 30.2642,
      currentLng: 71.5098,
      todayEarnings: 1200,
      weeklyEarnings: 9800,
      acceptanceRate: 95,
    },
    {
      id: 'drv_3',
      fullName: 'Dr. Maryam Khan',
      mobile: '03339876543',
      cnic: '36302-7712345-8',
      cnicFrontUrl: '/docs/cnic_front_3.jpg',
      cnicBackUrl: '/docs/cnic_back_3.jpg',
      selfieUrl: '/docs/selfie_3.jpg',
      drivingLicenceNumber: 'MLT-2022-9011',
      drivingLicenceUrl: '/docs/licence_3.jpg',
      vehicleRegistrationUrl: '/docs/reg_3.jpg',
      vehiclePhotos: ['/src/assets/images/vehicle_women_car_1793507620855.jpg'],
      vehicleType: 'car',
      vehicleModel: 'Suzuki Cultus AC White',
      vehicleNumber: 'LEA-21-9982',
      isApproved: false,
      approvalStatus: 'pending',
      isOnline: false,
      rating: 5.0,
      totalTrips: 0,
      currentLat: 30.1834,
      currentLng: 71.4428,
      todayEarnings: 0,
      weeklyEarnings: 0,
      acceptanceRate: 100,
    },
  ]);

  // Bookings list
  const [bookings, setBookings] = useState<RideBooking[]>([
    {
      id: 'EWR-847291',
      passengerId: 'pass_multan_1',
      passengerName: 'Zainab Ahmed',
      passengerPhone: '03247150585',
      driverId: 'drv_1',
      driverName: 'Ayesha Bibi',
      driverPhone: '03247150585',
      driverRating: 4.9,
      vehicleType: 'scooty',
      vehicleNumber: 'MN-24-7860',
      pickupLocation: safeLocations[0],
      destinationLocation: safeLocations[2],
      pickupAddress: 'BZU Main Gate, Bosan Road',
      destinationAddress: 'Mall of Multan, Bosan Road',
      distanceKm: 3.8,
      estimatedMinutes: 11,
      estimatedFare: 245,
      is30KmPackageApplied: false,
      paymentMethod: 'cash',
      paymentStatus: 'paid',
      status: 'completed',
      bookingTime: '2026-10-31T14:30:00Z',
    },
  ]);

  // Complaints state
  const [complaints, setComplaints] = useState<ComplaintReport[]>([
    {
      id: 'CMP-104',
      reporterType: 'passenger',
      reporterName: 'Khadija Noor',
      reporterContact: '03123456789',
      category: 'safety',
      description: 'Street light was dim near Kachehri Chowk waiting area.',
      status: 'resolved',
      createdAt: '2026-10-30T18:15:00Z',
    },
  ]);

  // Active Ride tracking modal
  const [activeBooking, setActiveBooking] = useState<RideBooking | null>(null);

  // Modals visibility
  const [showSosModal, setShowSosModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAndroidModal, setShowAndroidModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPlayStoreModal, setShowPlayStoreModal] = useState(false);
  const [showAcademyModal, setShowAcademyModal] = useState(false);

  // Toast notifications state for random safety reminders
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const handleShowSafetyToast = (reminder: Omit<ToastMessage, 'id'>) => {
    const newToast: ToastMessage = {
      ...reminder,
      id: `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 3));
    playNotificationChime();
  };

  const t = translations[lang];
  const pktInfo = getCurrentPktTime(fareConfig.morningStartHourPKT, fareConfig.nightCurfewHourPKT);

  // Map pin coordinate picker handler
  const handleSelectCoordinatesOnMap = (lat: number, lng: number, mode: 'pickup' | 'destination') => {
    // Find closest safe point or set coordinate
    const chosenPoint: LocationPoint = {
      id: `custom_${Date.now()}`,
      name: `${mode === 'pickup' ? 'Selected Pickup Point' : 'Selected Destination'} (Lat: ${lat.toFixed(3)}, Lng: ${lng.toFixed(3)})`,
      nameUrdu: `${mode === 'pickup' ? 'منتخب کردہ مقام' : 'منزل کا مقام'}`,
      roadName: 'Multan Safe Road Corridor',
      lat,
      lng,
      isMainRoad: true,
      isSafeHub: true,
      landmark: 'Multan Monitored Zone',
      description: 'Verified public corridor point',
    };

    if (mode === 'pickup') {
      setPickupLocation(chosenPoint);
    } else {
      setDestLocation(chosenPoint);
    }
    setSelectedMapMode(null);
  };

  const [userSession, setUserSession] = useState<UserSession>(() => getStoredSession());

  useEffect(() => {
    loadSavedRides().then((saved) => {
      if (saved && saved.length > 0) {
        setBookings((prev) => {
          const existingIds = new Set(prev.map((b) => b.id));
          const newItems = saved.filter((s) => !existingIds.has(s.id));
          return [...newItems, ...prev];
        });
      }
    });
  }, []);

  const handleConfirmNewBooking = (booking: RideBooking) => {
    saveRideBooking(booking);
    setBookings([booking, ...bookings]);
    setActiveBooking(booking);
    handleShowSafetyToast(getRandomSafetyReminder());
  };

  const handleUpdateBookingStatus = (newStatus: RideBooking['status']) => {
    if (!activeBooking) return;
    const updated = { ...activeBooking, status: newStatus };
    updateRideStatus(activeBooking.id, newStatus);
    setActiveBooking(updated);
    setBookings(bookings.map((b) => (b.id === updated.id ? updated : b)));
  };

  return (
    <div className={`min-h-screen flex flex-col bg-rose-50/30 ${lang === 'ur' ? 'font-urdu' : ''}`} dir={lang === 'ur' ? 'rtl' : 'ltr'}>
      {/* 24/7 Universal Contact Support Bar on EVERY screen */}
      <SupportHotbar
        lang={lang}
        onOpenSos={() => setShowSosModal(true)}
        onOpenHelp={() => setShowHelpModal(true)}
        variant="banner"
      />

      {/* Primary Brand Top Bar */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        lang={lang}
        onLangToggle={() => setLang(lang === 'en' ? 'ur' : 'en')}
        onOpenSos={() => setShowSosModal(true)}
        onOpenAndroidModal={() => setShowAndroidModal(true)}
        nightCurfewHour={fareConfig.nightCurfewHourPKT}
        morningStartHour={fareConfig.morningStartHourPKT}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* PASSENGER VIEW */}
        {currentRole === 'passenger' && (
          <div className="space-y-8">
            {/* Hero Banner with Golden Crest & Women Empowerment Tagline */}
            <div className="relative rounded-3xl bg-gradient-to-r from-pink-900 via-rose-800 to-amber-900 text-white p-6 sm:p-8 shadow-2xl overflow-hidden border border-amber-400/30">
              <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/40 text-xs font-bold tracking-wide">
                    <span>👑</span>
                    <span>MULTAN'S PREMIER WOMEN-ONLY TRANSPORT</span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                    {lang === 'ur' ? 'ایگل ویمنز رائیڈ ملتان' : "EAGLE WOMEN'S RIDE"}
                  </h1>

                  <p className="text-base sm:text-lg font-medium text-pink-100 max-w-xl">
                    "{t.tagline}"
                  </p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold pt-1">
                    <span className="flex items-center gap-1.5 text-amber-300">
                      <ShieldCheck className="w-4 h-4" />
                      100% Verified Female Drivers
                    </span>
                    <span className="flex items-center gap-1.5 text-pink-200">
                      <Clock className="w-4 h-4" />
                      06:00 AM – 10:00 PM Strict Curfew
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-300">
                      <CheckCircle2 className="w-4 h-4" />
                      Main Road Monitored Corridors
                    </span>
                  </div>
                </div>

                {/* Right Hero Badge / Passenger Profile Quick Pill */}
                <div className="shrink-0 flex flex-col items-center gap-3">
                  <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                        {passengerProfile.fullName}
                      </span>
                    </div>
                    <span className="text-[11px] block text-pink-100">
                      CNIC: {passengerProfile.cnic}
                    </span>
                    <button
                      onClick={() => setShowProfileModal(true)}
                      className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md transition-all"
                    >
                      Verify / Edit Profile
                    </button>
                  </div>

                  <button
                    onClick={() => setShowAndroidModal(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-pink-900" />
                    <span>{lang === 'ur' ? 'اینڈرائیڈ APK ڈاؤنلوڈ کریں' : 'Download Android App (APK)'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* InDrive-Style Booking Split (Form on Left, Leaflet Map on Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: inDrive-style booking form */}
              <div className="lg:col-span-7">
                <BookingForm
                  lang={lang}
                  fareConfig={fareConfig}
                  passengerProfile={passengerProfile}
                  pickup={pickupLocation}
                  destination={destLocation}
                  onPickupChange={setPickupLocation}
                  onDestinationChange={setDestLocation}
                  onConfirmBooking={handleConfirmNewBooking}
                  onSelectMapMode={setSelectedMapMode}
                  selectedMapMode={selectedMapMode}
                  onShowSafetyToast={handleShowSafetyToast}
                />
              </div>

              {/* Right Column: Interactive Leaflet Map & Safe Corridors */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white rounded-3xl p-4 shadow-xl border border-rose-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Live Multan Safe Radar
                      </h3>
                      <span className="text-sm font-extrabold text-slate-900 block">
                        Main Road Transit Corridor
                      </span>
                    </div>

                    <span className="text-[10px] font-bold text-pink-700 bg-pink-100 px-2 py-0.5 rounded border border-pink-200">
                      Bosan Rd · Cantt · Gulgasht
                    </span>
                  </div>

                  {/* Leaflet Map */}
                  <div className="h-72 w-full rounded-2xl overflow-hidden border border-rose-200">
                    <MapLeaflet
                      pickup={pickupLocation}
                      destination={destLocation}
                      driverLocation={drivers[0].isOnline ? { lat: drivers[0].currentLat, lng: drivers[0].currentLng } : undefined}
                      vehicleType="scooty"
                      onSelectCoordinates={handleSelectCoordinatesOnMap}
                      selectionMode={selectedMapMode}
                      interactive={true}
                    />
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                    <span>GPS High-Accuracy Navigation</span>
                    <button
                      onClick={() => setShowHelpModal(true)}
                      className="font-bold text-pink-700 hover:underline"
                    >
                      Report Unsafe Spot
                    </button>
                  </div>
                </div>

                {/* Quick Safe Points Directory in Multan */}
                <div className="bg-white rounded-3xl p-4 shadow-md border border-rose-100 space-y-2">
                  <span className="text-xs font-extrabold text-slate-900 block">
                    Popular Approved Multan Safe Points
                  </span>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {safeLocations.slice(0, 4).map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => {
                          setPickupLocation(loc);
                        }}
                        className="p-2 rounded-xl text-left border border-slate-200 hover:border-pink-500 bg-slate-50/60 hover:bg-pink-50/50 transition-all text-[11px]"
                      >
                        <span className="font-bold text-slate-800 block truncate">{loc.name.split(',')[0]}</span>
                        <span className="text-[10px] text-slate-500 truncate block">{loc.roadName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Options Feature Section with Generated Images */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    OUR 3 DEDICATED WOMEN RIDE OPTIONS
                  </h2>
                  <p className="text-xs text-slate-500">
                    Safe, dignified, and comfortable travel tailored for women in Multan.
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-xs font-bold text-pink-700 bg-pink-100 px-3 py-1 rounded-full">
                    Fixed 30 KM Saver Packages Available
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Bike */}
                <div className="bg-white rounded-3xl p-5 shadow-lg border border-rose-100 flex flex-col justify-between hover:shadow-xl transition-all">
                  <div>
                    <div className="h-44 w-full rounded-2xl overflow-hidden bg-pink-50 mb-4 border border-rose-100">
                      <img
                        src="/src/assets/images/vehicle_women_bike_1793507620830.jpg"
                        alt="Women Bike Ride Multan"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-extrabold text-base text-slate-900">{t.bikeTitle}</h3>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Economical
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {t.bikeDesc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Base Fare:</span>
                      <span className="font-mono font-bold text-slate-800">PKR {fareConfig.bike.baseFare}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Per KM:</span>
                      <span className="font-mono font-bold text-slate-800">PKR {fareConfig.bike.perKm}</span>
                    </div>
                    <div className="flex justify-between text-pink-700 font-bold bg-pink-50 p-1.5 rounded-lg">
                      <span>30 KM Saver Package:</span>
                      <span className="font-mono">PKR {fareConfig.bike.package30Km}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Scooty */}
                <div className="bg-white rounded-3xl p-5 shadow-lg border-2 border-pink-400 flex flex-col justify-between hover:shadow-xl transition-all relative">
                  <div className="absolute -top-3 right-6 bg-gradient-to-r from-pink-600 to-rose-600 text-white text-[10px] uppercase font-black px-3 py-0.5 rounded-full shadow-sm">
                    Most Popular in Multan
                  </div>

                  <div>
                    <div className="h-44 w-full rounded-2xl overflow-hidden bg-pink-50 mb-4 border border-rose-100">
                      <img
                        src="/src/assets/images/vehicle_women_scooty_1793507621173.jpg"
                        alt="Women Scooty Ride Multan"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-extrabold text-base text-pink-900">{t.scootyTitle}</h3>
                      <span className="text-[11px] font-bold text-pink-800 bg-pink-100 px-2 py-0.5 rounded">
                        Women's Favorite
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {t.scootyDesc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Base Fare:</span>
                      <span className="font-mono font-bold text-slate-800">PKR {fareConfig.scooty.baseFare}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Per KM:</span>
                      <span className="font-mono font-bold text-slate-800">PKR {fareConfig.scooty.perKm}</span>
                    </div>
                    <div className="flex justify-between text-pink-700 font-bold bg-pink-50 p-1.5 rounded-lg">
                      <span>30 KM Saver Package:</span>
                      <span className="font-mono">PKR {fareConfig.scooty.package30Km}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Car */}
                <div className="bg-white rounded-3xl p-5 shadow-lg border border-rose-100 flex flex-col justify-between hover:shadow-xl transition-all">
                  <div>
                    <div className="h-44 w-full rounded-2xl overflow-hidden bg-pink-50 mb-4 border border-rose-100">
                      <img
                        src="/src/assets/images/vehicle_women_car_1793507620855.jpg"
                        alt="Women AC Car Ride Multan"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-extrabold text-base text-slate-900">{t.carTitle}</h3>
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        AC Luxury
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {t.carDesc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Base Fare:</span>
                      <span className="font-mono font-bold text-slate-800">PKR {fareConfig.car.baseFare}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Per KM:</span>
                      <span className="font-mono font-bold text-slate-800">PKR {fareConfig.car.perKm}</span>
                    </div>
                    <div className="flex justify-between text-pink-700 font-bold bg-pink-50 p-1.5 rounded-lg">
                      <span>30 KM Saver Package:</span>
                      <span className="font-mono">PKR {fareConfig.car.package30Km}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Riding Academy Promo Ad Post */}
            <RidingAcademyAd
              lang={lang}
              onOpenDetails={() => setShowAcademyModal(true)}
            />

            {/* Women Safety Pillars Grid */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-rose-100 space-y-5">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-[11px] uppercase font-bold text-pink-700 tracking-wider">
                  Our Uncompromising Promise
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Women Safety System Built for Pakistan
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-pink-600 text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <h4 className="font-bold text-slate-900">100% Women Passengers & Drivers</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Zero male interference. Men are strictly barred from booking or operating rides.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200 space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-600 text-white text-[10px] font-extrabold uppercase tracking-wide shadow-xs">
                    Card 2 • Pink Badge
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Strict 10:00 PM Night Curfew</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Operating strictly 06:00 AM – 10:00 PM PKT. No rides dispatched after dark hours.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200 space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-600 text-white text-[10px] font-extrabold uppercase tracking-wide shadow-xs">
                    Card 3 • Pink Badge
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Main Road Restrictions</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Pickups & drop-offs only on well-lit, CCTV-monitored main avenues and commercial points.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-extrabold uppercase tracking-wide shadow-xs">
                    Card 4 • Red Badge
                  </div>
                  <h4 className="font-extrabold text-red-950 text-sm">Direct SOS & 15 Integration</h4>
                  <p className="text-slate-700 leading-relaxed">
                    One-tap emergency alarm, live GPS sharing with families, and direct Police 15 alert.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DRIVER PORTAL VIEW */}
        {currentRole === 'driver' && (
          <DriverDashboard
            driver={drivers[0]}
            lang={lang}
            fareConfig={fareConfig}
            onUpdateDriver={(updated) => {
              setDrivers(drivers.map((d) => (d.id === drivers[0].id ? { ...d, ...updated } : d)));
            }}
            onOpenSos={() => setShowSosModal(true)}
            onOpenHelp={() => setShowHelpModal(true)}
            onAcceptIncomingRide={(booking) => {
              setBookings([booking, ...bookings]);
            }}
          />
        )}

        {/* ADMIN CONSOLE VIEW */}
        {currentRole === 'admin' && (
          <AdminDashboard
            drivers={drivers}
            passengers={[passengerProfile]}
            fareConfig={fareConfig}
            bookings={bookings}
            complaints={complaints}
            safeLocations={safeLocations}
            lang={lang}
            onApproveDriver={(drvId) => {
              setDrivers(
                drivers.map((d) =>
                  d.id === drvId ? { ...d, isApproved: true, approvalStatus: 'approved' } : d
                )
              );
            }}
            onRejectDriver={(drvId) => {
              setDrivers(
                drivers.map((d) =>
                  d.id === drvId ? { ...d, isApproved: false, approvalStatus: 'rejected' } : d
                )
              );
            }}
            onUpdateFareConfig={setFareConfig}
            onAddSafeLocation={(newLoc) => setSafeLocations([...safeLocations, newLoc])}
            onDeleteSafeLocation={(locId) =>
              setSafeLocations(safeLocations.filter((l) => l.id !== locId))
            }
            onResolveComplaint={(cmpId) =>
              setComplaints(
                complaints.map((c) => (c.id === cmpId ? { ...c, status: 'resolved' } : c))
              )
            }
          />
        )}
      </main>

      {/* FINAL WELCOME FOOTER SECTION AS REQUIRED */}
      <footer className="bg-gradient-to-r from-pink-950 via-slate-950 to-amber-950 text-white mt-12 pt-10 pb-8 px-4 border-t-2 border-amber-500/40">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-pink-500 to-amber-300 shadow-lg overflow-hidden">
            <img
              src="/src/assets/images/eagle_logo_crest_1793507620161.jpg"
              alt="Eagle Crest"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-amber-300 via-pink-200 to-amber-400 bg-clip-text text-transparent">
              EAGLE WOMEN'S RIDE
            </h2>
            <p className="text-sm font-semibold text-pink-200 mt-1">
              "Her Journey, Her Freedom, Her Safety."
            </p>
            <p className="text-xs text-amber-300/90 font-bold uppercase tracking-wider mt-1">
              Book Your Ride Today.
            </p>
          </div>

          {/* Prompt Required Contact Display */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="tel:03247150585"
              className="px-4 py-2 rounded-xl bg-pink-700 hover:bg-pink-800 text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition-all"
            >
              <Phone className="w-4 h-4 text-amber-300" />
              <span>CALL: 03247150585</span>
            </a>

            <a
              href="https://wa.me/923247150585?text=Assalam-o-Alaikum%20Eagle%20Women's%20Ride!%20I%20would%20like%20to%20book%20a%20ride."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-200" />
              <span>WHATSAPP: 03247150585</span>
            </a>

            <button
              onClick={() => setShowAndroidModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md transition-all"
            >
              <Smartphone className="w-4 h-4" />
              <span>INSTALL ON ANDROID</span>
            </button>

            <button
              onClick={() => setShowPlayStoreModal(true)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center gap-2 border border-slate-700 shadow-md transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>PLAY STORE CHECKLIST & PRIVACY</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 pt-4 border-t border-slate-800 w-full flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© 2026 EAGLE WOMEN'S RIDE · Multan, Pakistan. All Rights Reserved.</span>
            <span>Operating Hours: 06:00 AM – 10:00 PM PKT</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {showPlayStoreModal && (
        <PlayStoreSubmissionModal onClose={() => setShowPlayStoreModal(false)} />
      )}
      {activeBooking && (
        <ActiveRideModal
          booking={activeBooking}
          lang={lang}
          onClose={() => setActiveBooking(null)}
          onTriggerSos={() => setShowSosModal(true)}
          onUpdateStatus={handleUpdateBookingStatus}
          onRateDriver={(rating, review) => {
            const updated = {
              ...activeBooking,
              ratingGivenByPassenger: rating,
              reviewByPassenger: review,
            };
            setActiveBooking(updated);
            setBookings(bookings.map((b) => (b.id === updated.id ? updated : b)));
          }}
        />
      )}

      {showSosModal && (
        <SafetySOSModal
          lang={lang}
          passengerProfile={passengerProfile}
          currentLocationName={pickupLocation.name}
          onClose={() => setShowSosModal(false)}
        />
      )}

      {showHelpModal && (
        <HelpSupportModal
          lang={lang}
          onClose={() => setShowHelpModal(false)}
          onOpenSos={() => setShowSosModal(true)}
          onSubmitComplaint={(newCmp) => setComplaints([newCmp, ...complaints])}
        />
      )}

      {showAndroidModal && (
        <AndroidInstallModal onClose={() => setShowAndroidModal(false)} />
      )}

      {showProfileModal && (
        <ProfileModal
          profile={passengerProfile}
          lang={lang}
          onClose={() => setShowProfileModal(false)}
          onSaveProfile={setPassengerProfile}
        />
      )}

      {showAcademyModal && (
        <RidingAcademyModal
          lang={lang}
          onClose={() => setShowAcademyModal(false)}
        />
      )}

      {/* Floating Random Safety Reminder Toast Container */}
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
        lang={lang}
      />
    </div>
  );
}
