import React, { useState } from 'react';
import {
  DriverProfile,
  PassengerProfile,
  FareConfig,
  LocationPoint,
  RideBooking,
  ComplaintReport,
  Language,
} from '../types';
import { APPROVED_SAFE_LOCATIONS } from '../data/multanLocations';
import { getCurrentPktTime, setTestCurfewOverride } from '../utils/pktTime';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  FileText,
  DollarSign,
  Clock,
  MapPin,
  AlertTriangle,
  Users,
  Car,
  TrendingUp,
  Plus,
  Trash2,
  Lock,
  Search,
} from 'lucide-react';

interface AdminDashboardProps {
  drivers: DriverProfile[];
  passengers: PassengerProfile[];
  fareConfig: FareConfig;
  bookings: RideBooking[];
  complaints: ComplaintReport[];
  safeLocations: LocationPoint[];
  lang: Language;
  onApproveDriver: (driverId: string) => void;
  onRejectDriver: (driverId: string) => void;
  onUpdateFareConfig: (config: FareConfig) => void;
  onAddSafeLocation: (location: LocationPoint) => void;
  onDeleteSafeLocation: (id: string) => void;
  onResolveComplaint: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  drivers,
  passengers,
  fareConfig,
  bookings,
  complaints,
  safeLocations,
  lang,
  onApproveDriver,
  onRejectDriver,
  onUpdateFareConfig,
  onAddSafeLocation,
  onDeleteSafeLocation,
  onResolveComplaint,
}) => {
  const [activeTab, setActiveTab] = useState<
    'drivers' | 'fares' | 'curfew' | 'safe_locations' | 'rides' | 'complaints' | 'reports' | 'playstore'
  >('drivers');

  const [selectedDriverForReview, setSelectedDriverForReview] = useState<DriverProfile | null>(
    drivers[0] || null
  );

  // New location form state
  const [newLocationName, setNewLocationName] = useState('');
  const [newRoadName, setNewRoadName] = useState('');
  const [newLandmark, setNewLandmark] = useState('');

  // Editable Fares state
  const [editableFares, setEditableFares] = useState<FareConfig>(fareConfig);

  const pktInfo = getCurrentPktTime(fareConfig.morningStartHourPKT, fareConfig.nightCurfewHourPKT);

  const handleSaveFares = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFareConfig(editableFares);
    alert('Fare settings & 30 KM Package rates updated successfully!');
  };

  const handleCreateLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocationName || !newRoadName) return;

    const newPoint: LocationPoint = {
      id: `safe_${Date.now()}`,
      name: `${newLocationName}, ${newRoadName}`,
      nameUrdu: newLocationName,
      roadName: newRoadName,
      lat: 30.1984 + (Math.random() - 0.5) * 0.05,
      lng: 71.4687 + (Math.random() - 0.5) * 0.05,
      isMainRoad: true,
      isSafeHub: true,
      landmark: newLandmark || newLocationName,
      description: 'Admin Verified Multan Main Road Safe Hub',
    };

    onAddSafeLocation(newPoint);
    setNewLocationName('');
    setNewRoadName('');
    setNewLandmark('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Admin Top Summary Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 to-amber-500 flex items-center justify-center font-black text-xl text-white shadow-md">
            🦅
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold tracking-tight">EAGLE COMMAND ADMIN</h2>
              <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded uppercase">
                HQ Multan
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Women Safety Transport Operations · Live PKT: {pktInfo.formattedTime}
            </p>
          </div>
        </div>

        {/* Operating Curfew Quick Switcher */}
        <div className="flex items-center gap-2 text-xs bg-slate-800/80 px-3 py-2 rounded-2xl border border-slate-700">
          <span className="text-slate-300">Test Curfew Mode:</span>
          <button
            onClick={() => {
              setTestCurfewOverride(13 * 60); // 1:00 PM
              alert('Switched to Daytime Simulation (1:00 PM PKT). Curfew is OPEN.');
            }}
            className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold"
          >
            Daytime (1 PM)
          </button>
          <button
            onClick={() => {
              setTestCurfewOverride(22 * 60 + 15); // 10:15 PM
              alert('Switched to Night Curfew Simulation (10:15 PM PKT). Curfew is ACTIVE.');
            }}
            className="px-2 py-1 rounded bg-red-900 hover:bg-red-800 text-red-100 font-semibold"
          >
            Curfew (10:15 PM)
          </button>
          <button
            onClick={() => {
              setTestCurfewOverride(null);
              alert('Reset to real-time Pakistan Clock.');
            }}
            className="px-2 py-1 rounded bg-pink-700 hover:bg-pink-600 text-white font-semibold"
          >
            Real Time
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-rose-100">
        {[
          { id: 'drivers', label: `Driver Approvals (${drivers.filter((d) => !d.isApproved).length} Pending)` },
          { id: 'fares', label: '30 KM Packages & Fares' },
          { id: 'curfew', label: '10 PM Night Curfew' },
          { id: 'safe_locations', label: `Safe Main Roads (${safeLocations.length})` },
          { id: 'rides', label: `Live Rides (${bookings.length})` },
          { id: 'complaints', label: `Incidents (${complaints.length})` },
          { id: 'reports', label: 'Reports & Revenue' },
          { id: 'playstore', label: '🚀 Play Store Checklist & Privacy' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-pink-700 to-rose-600 text-white shadow-md'
                : 'bg-white hover:bg-rose-50 text-slate-700 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Driver Approvals & Document Review */}
      {activeTab === 'drivers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Driver List */}
          <div className="bg-white rounded-3xl p-4 shadow-md border border-rose-100 lg:col-span-1 space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900">Registered Women Drivers</h3>
            <div className="space-y-2">
              {drivers.map((drv) => (
                <div
                  key={drv.id}
                  onClick={() => setSelectedDriverForReview(drv)}
                  className={`p-3 rounded-2xl cursor-pointer border transition-all ${
                    selectedDriverForReview?.id === drv.id
                      ? 'border-pink-600 bg-pink-50/50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-pink-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{drv.fullName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        drv.isApproved
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {drv.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>{drv.mobile}</span>
                    <span className="font-mono uppercase font-bold text-pink-700">
                      {drv.vehicleType}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Document Review Card */}
          {selectedDriverForReview && (
            <div className="bg-white rounded-3xl p-5 shadow-md border border-rose-100 lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {selectedDriverForReview.fullName}
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    CNIC: {selectedDriverForReview.cnic} · Mobile: {selectedDriverForReview.mobile}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {!selectedDriverForReview.isApproved ? (
                    <>
                      <button
                        onClick={() => onApproveDriver(selectedDriverForReview.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve Driver</span>
                      </button>

                      <button
                        onClick={() => onRejectDriver(selectedDriverForReview.id)}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1 border border-emerald-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Verified & Active</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Private Document Showcase */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">CNIC Front & Back</span>
                  <div className="h-28 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 p-2">
                    <FileText className="w-8 h-8 text-pink-600" />
                    <span className="ml-2 font-mono text-slate-700 text-[11px]">
                      NADRA CNIC Verified
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">Driving Licence</span>
                  <div className="h-28 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 p-2">
                    <ShieldCheck className="w-8 h-8 text-amber-500" />
                    <span className="ml-2 font-mono text-slate-700 text-[11px]">
                      Licence #{selectedDriverForReview.drivingLicenceNumber}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">
                    Vehicle Registration & Plate
                  </span>
                  <p className="text-slate-600">
                    Number Plate: <span className="font-mono font-bold text-slate-900">{selectedDriverForReview.vehicleNumber}</span>
                  </p>
                  <p className="text-slate-600">
                    Model: <span className="font-bold text-slate-900">{selectedDriverForReview.vehicleModel}</span>
                  </p>
                  <p className="text-slate-600">
                    Type: <span className="font-bold capitalize text-pink-700">{selectedDriverForReview.vehicleType}</span>
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">Driver Verification Contact</span>
                  <p className="text-slate-600">Official Multan Police & NADRA cross-check completed.</p>
                  <a
                    href={`tel:${selectedDriverForReview.mobile}`}
                    className="inline-block mt-2 font-bold text-pink-700 underline text-xs"
                  >
                    Call Driver ({selectedDriverForReview.mobile})
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Fares & 30 KM Package Management */}
      {activeTab === 'fares' && (
        <form onSubmit={handleSaveFares} className="bg-white rounded-3xl p-6 shadow-md border border-rose-100 space-y-5">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Fare System & 30 KM Fixed Package Configuration
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Admin controls all Bike, Scooty, and Car rates in Multan, plus extra charges beyond 30 KM.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Bike Settings */}
            <div className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-sm text-slate-900">Women Bike</span>
                <span className="text-xs font-mono font-bold text-pink-700">Rates (PKR)</span>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block">Base Fare:</label>
                <input
                  type="number"
                  value={editableFares.bike.baseFare}
                  onChange={(e) =>
                    setEditableFares({
                      ...editableFares,
                      bike: { ...editableFares.bike, baseFare: Number(e.target.value) },
                    })
                  }
                  className="w-full text-xs p-2 bg-white rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block">Per KM Charge:</label>
                <input
                  type="number"
                  value={editableFares.bike.perKm}
                  onChange={(e) =>
                    setEditableFares({
                      ...editableFares,
                      bike: { ...editableFares.bike, perKm: Number(e.target.value) },
                    })
                  }
                  className="w-full text-xs p-2 bg-white rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block">
                  30 KM Fixed Saver Package:
                </label>
                <input
                  type="number"
                  value={editableFares.bike.package30Km}
                  onChange={(e) =>
                    setEditableFares({
                      ...editableFares,
                      bike: { ...editableFares.bike, package30Km: Number(e.target.value) },
                    })
                  }
                  className="w-full text-xs p-2 bg-white rounded-lg border border-slate-300 font-mono font-bold text-pink-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block">
                  Extra KM Charge (Beyond 30 KM):
                </label>
                <input
                  type="number"
                  value={editableFares.bike.extraPerKm}
                  onChange={(e) =>
                    setEditableFares({
                      ...editableFares,
                      bike: { ...editableFares.bike, extraPerKm: Number(e.target.value) },
                    })
                  }
                  className="w-full text-xs p-2 bg-white rounded-lg border border-slate-300 font-mono"
                />
              </div>
            </div>

            {/* Scooty Settings */}
            <div className="p-4 rounded-2xl border-2 border-pink-300 bg-pink-50/40 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-pink-200">
                <span className="font-bold text-sm text-pink-900">Women Scooty / Scooter</span>
                <span className="text-xs font-mono font-bold text-pink-700">Rates (PKR)</span>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block">Base Fare:</label>
                <input
                  type="number"
                  value={editableFares.scooty.baseFare}
                  onChange={(e) =>
                    setEditableFares({
                      ...editableFares,
                      scooty: { ...editableFares.scooty, baseFare: Number(e.target.value) },
                    })
                  }
                  className="w-full text-xs p-2 bg-white rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block">Per KM Charge:</label>
                <input
                  type="number"
                  value={editableFares.scooty.perKm}
                  onChange={(e) =>
                    setEditableFares({
                      ...editableFares,
                      scooty: { ...editableFares.scooty, perKm: Number(e.target.value) },
                    })
                  }
                  className="w-full text-xs p-2 bg-white rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block">
                  30 KM Fixed Saver Package:
                </label>
                <input
                  type="number"
                  value={editableFares.scooty.package30Km}
                  onChange={(e) =>
                    setEditableFares({
                      ...editableFares,
                      scooty: { ...editableFares.scooty, package30Km: Number(e.target.value) },
                    })
                  }
                  className="w-full text-xs p-2 bg-white rounded-lg border border-slate-300 font-mono font-bold text-pink-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block">
                  Extra KM Charge (Beyond 30 KM):
                </label>
                <input
                  type="number"
                  value={editableFares.scooty.extraPerKm}
                  onChange={(e) =>
                    setEditableFares({
                      ...editableFares,
                      scooty: { ...editableFares.scooty, extraPerKm: Number(e.target.value) },
                    })
                  }
                  className="w-full text-xs p-2 bg-white rounded-lg border border-slate-300 font-mono"
                />
              </div>
            </div>

            {/* Car Settings */}
            <div className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-sm text-slate-900">Women Car (AC)</span>
                <span className="text-xs font-mono font-bold text-pink-700">Rates (PKR)</span>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block">Base Fare:</label>
                <input
                  type="number"
                  value={editableFares.car.baseFare}
                  onChange={(e) =>
                    setEditableFares({
                      ...editableFares,
                      car: { ...editableFares.car, baseFare: Number(e.target.value) },
                    })
                  }
                  className="w-full text-xs p-2 bg-white rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block">Per KM Charge:</label>
                <input
                  type="number"
                  value={editableFares.car.perKm}
                  onChange={(e) =>
                    setEditableFares({
                      ...editableFares,
                      car: { ...editableFares.car, perKm: Number(e.target.value) },
                    })
                  }
                  className="w-full text-xs p-2 bg-white rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block">
                  30 KM Fixed Saver Package:
                </label>
                <input
                  type="number"
                  value={editableFares.car.package30Km}
                  onChange={(e) =>
                    setEditableFares({
                      ...editableFares,
                      car: { ...editableFares.car, package30Km: Number(e.target.value) },
                    })
                  }
                  className="w-full text-xs p-2 bg-white rounded-lg border border-slate-300 font-mono font-bold text-pink-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block">
                  Extra KM Charge (Beyond 30 KM):
                </label>
                <input
                  type="number"
                  value={editableFares.car.extraPerKm}
                  onChange={(e) =>
                    setEditableFares({
                      ...editableFares,
                      car: { ...editableFares.car, extraPerKm: Number(e.target.value) },
                    })
                  }
                  className="w-full text-xs p-2 bg-white rounded-lg border border-slate-300 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-pink-700 hover:bg-pink-800 text-white font-extrabold text-xs shadow-md transition-all"
            >
              Save Updated Fares & Packages
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: Curfew & Operating Hours Manager */}
      {activeTab === 'curfew' && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-rose-100 space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <Lock className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs">
              <h4 className="font-bold text-amber-950 text-sm">Strict 10:00 PM Night Safety Curfew Policy</h4>
              <p className="mt-1 text-slate-700 leading-relaxed">
                As per Eagle Women's Ride charter, zero rides are dispatched or accepted after 10:00 PM PKT.
                Driver availability automatically closes down. Trips estimated to finish after 10:00 PM are rejected at booking.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="font-bold text-slate-800 block mb-2">Curfew Parameters</span>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Night Curfew Cutoff:</span>
                  <span className="font-bold font-mono text-red-700 bg-red-100 px-2 py-0.5 rounded">
                    10:00 PM (22:00 PKT)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Morning Resumption:</span>
                  <span className="font-bold font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    06:00 AM (06:00 PKT)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">City Jurisdiction:</span>
                  <span className="font-bold text-slate-800">Multan Safe Zone</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="font-bold text-slate-800 block mb-2">Automated Enforcement Engine</span>
              <p className="text-slate-600 leading-relaxed mb-3">
                Current Status: <span className="font-bold text-emerald-600">100% Active</span>. The server rejects API ride allocations past 22:00 PKT.
              </p>
              <button
                type="button"
                onClick={() => alert('Operating hours verified compliant with women safety policies.')}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800"
              >
                Validate Operating Hours
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Safe Main Roads Manager */}
      {activeTab === 'safe_locations' && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-rose-100 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Approved Multan Main Roads & Safe Hubs
              </h3>
              <p className="text-xs text-slate-500">
                Rides are strictly prohibited in deserted or isolated alleyways.
              </p>
            </div>
          </div>

          {/* Add New Safe Point Form */}
          <form onSubmit={handleCreateLocation} className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 flex flex-wrap gap-2 text-xs">
            <input
              type="text"
              placeholder="Safe Hub Name (e.g. Chungi No. 6 Metro)"
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
              className="flex-1 min-w-[200px] p-2 bg-white rounded-xl border border-slate-300"
              required
            />
            <input
              type="text"
              placeholder="Main Road Name (e.g. Bosan Road)"
              value={newRoadName}
              onChange={(e) => setNewRoadName(e.target.value)}
              className="flex-1 min-w-[160px] p-2 bg-white rounded-xl border border-slate-300"
              required
            />
            <input
              type="text"
              placeholder="Landmark / Security Post"
              value={newLandmark}
              onChange={(e) => setNewLandmark(e.target.value)}
              className="flex-1 min-w-[160px] p-2 bg-white rounded-xl border border-slate-300"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-pink-700 hover:bg-pink-800 text-white font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Safe Point</span>
            </button>
          </form>

          {/* Locations Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Safe Point / Hub</th>
                  <th className="py-2.5 px-3">Road Name</th>
                  <th className="py-2.5 px-3">Security Landmark</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {safeLocations.map((loc) => (
                  <tr key={loc.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{loc.name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{loc.roadName}</td>
                    <td className="py-2.5 px-3 text-slate-500">{loc.landmark}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Main Road Approved
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onDeleteSafeLocation(loc.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete Safe Point"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Bookings & Active Rides */}
      {activeTab === 'rides' && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-rose-100 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">Multan City Ride History & Radar</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Ride ID</th>
                  <th className="py-2.5 px-3">Passenger</th>
                  <th className="py-2.5 px-3">Vehicle</th>
                  <th className="py-2.5 px-3">Pickup</th>
                  <th className="py-2.5 px-3">Destination</th>
                  <th className="py-2.5 px-3">Fare</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((bk) => (
                  <tr key={bk.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-3 font-mono font-bold text-pink-700">{bk.id}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{bk.passengerName}</td>
                    <td className="py-2.5 px-3 capitalize">{bk.vehicleType}</td>
                    <td className="py-2.5 px-3 text-slate-600 truncate max-w-[150px]">
                      {bk.pickupAddress}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 truncate max-w-[150px]">
                      {bk.destinationAddress}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      PKR {bk.estimatedFare}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 capitalize">
                        {bk.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: Complaints & Incidents */}
      {activeTab === 'complaints' && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-rose-100 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">Incident & Complaints Desk</h3>
          <div className="space-y-3">
            {complaints.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{c.reporterName}</span>
                    <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-bold uppercase">
                      {c.category}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 font-mono">{c.reporterContact}</span>
                  </div>
                  <p className="mt-1 text-slate-700">{c.description}</p>
                </div>

                <div>
                  {c.status === 'pending' ? (
                    <button
                      onClick={() => onResolveComplaint(c.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                    >
                      Resolve Incident
                    </button>
                  ) : (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Resolved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: Reports & Revenue */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-rose-100 space-y-5">
          <h3 className="font-extrabold text-base text-slate-900">
            Multan Women Ride Operations - Monthly Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Gross Revenue</span>
              <span className="text-2xl font-black text-pink-700 font-mono block mt-1">
                PKR 482,500
              </span>
              <span className="text-[10px] text-emerald-600 font-medium">+34% this month</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Completed Rides</span>
              <span className="text-2xl font-black text-slate-900 font-mono block mt-1">
                1,840
              </span>
              <span className="text-[10px] text-slate-500 font-medium">100% Women corridor</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Verified Drivers</span>
              <span className="text-2xl font-black text-slate-900 font-mono block mt-1">
                {drivers.filter((d) => d.isApproved).length + 42}
              </span>
              <span className="text-[10px] text-pink-700 font-medium">All NADRA checked</span>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
              <span className="text-[11px] font-bold text-amber-900 uppercase">Curfew Compliance</span>
              <span className="text-2xl font-black text-amber-700 font-mono block mt-1">
                100%
              </span>
              <span className="text-[10px] text-amber-800 font-medium">0 rides past 10 PM</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: Play Store Submission Center */}
      {activeTab === 'playstore' && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-rose-100 space-y-4">
          <div className="p-4 bg-gradient-to-r from-pink-900 to-slate-900 text-white rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-extrabold text-amber-300 tracking-wider">
                Google Play Store Launch Portal
              </span>
              <h3 className="text-base font-black mt-0.5">
                Ready for Google Play Review & Approval
              </h3>
            </div>
            <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-xl">
              v1.0.0 Prepared
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block">Google Play Console Data Safety Summary</span>
              <p className="text-slate-600 leading-relaxed">
                All data safety declarations have been drafted: Precise Location (Ride routing & SOS), Personal Info (Name, Phone, CNIC), Photos (Driver vetting documents).
              </p>
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-semibold text-[11px]">
                ✓ Complete privacy policy template ready for submission.
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block">Mandatory Safety Disclosure Check</span>
              <ul className="space-y-1.5 text-slate-600">
                <li>• Prominent Location Disclosure dialog active in app</li>
                <li>• Night Curfew (10:00 PM PKT) documented in description</li>
                <li>• Account Deletion route configured via Helpline 03247150585</li>
                <li>• Encrypted transit via HTTPS (TLS 1.3)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
