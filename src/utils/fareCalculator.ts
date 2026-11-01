import { FareConfig, VehicleCategory } from '../types';

export const FARE_RATES: Record<VehicleCategory, number> = {
  bike: 30,
  scooty: 30,
  car: 80,
};

export const DEFAULT_FARE_CONFIG: FareConfig = {
  bike: {
    baseFare: 0,
    perKm: 30, // 30 Rs / KM
    package30Km: 900,
    extraPerKm: 30,
    minFare: 30,
  },
  scooty: {
    baseFare: 0,
    perKm: 30, // 30 Rs / KM
    package30Km: 900,
    extraPerKm: 30,
    minFare: 30,
  },
  car: {
    baseFare: 0,
    perKm: 80, // 80 Rs / KM (with AC)
    package30Km: 2400,
    extraPerKm: 80,
    minFare: 80,
  },
  nightCurfewHourPKT: 22, // 10:00 PM
  morningStartHourPKT: 6, // 6:00 AM
  curfewStrictEnforced: true,
};

export interface FareCalculationResult {
  distanceKm: number;
  estimatedMinutes: number;
  farePkr: number;
  ratePerKm: number;
  is30KmPackageApplied: boolean;
  breakdown: {
    baseRate: number;
    kmRate: number;
    distanceCharge: number;
    packageSavingsPkr?: number;
    total: number;
  };
}

export function calculateEstimatedFare(
  distanceKm: number,
  vehicleType: VehicleCategory,
  config: FareConfig = DEFAULT_FARE_CONFIG
): FareCalculationResult {
  const ratePerKm = FARE_RATES[vehicleType] || config[vehicleType]?.perKm || 30;
  
  // Speed estimation in Multan city traffic:
  // Bike: ~28 km/h => ~2.1 min/km
  // Scooty: ~25 km/h => ~2.4 min/km
  // Car: ~22 km/h => ~2.7 min/km
  const minPerKm = vehicleType === 'bike' ? 2.1 : vehicleType === 'scooty' ? 2.4 : 2.7;
  const estimatedMinutes = Math.max(5, Math.round(distanceKm * minPerKm + 3));

  // User formula: totalFare = distance * rates[selectedVehicle]
  const farePkr = Math.round(distanceKm * ratePerKm);

  return {
    distanceKm,
    estimatedMinutes,
    farePkr,
    ratePerKm,
    is30KmPackageApplied: false,
    breakdown: {
      baseRate: 0,
      kmRate: ratePerKm,
      distanceCharge: farePkr,
      total: farePkr,
    },
  };
}

export function generateWhatsAppBookingUrl(params: {
  passengerName: string;
  passengerPhone: string;
  pickup: string;
  destination: string;
  vehicle: VehicleCategory;
  dateTime: string;
  distanceKm: number;
  farePkr: number;
}): string {
  const vehicleLabel =
    params.vehicle === 'bike'
      ? 'Women Bike (30 Rs/KM)'
      : params.vehicle === 'scooty'
      ? 'Women Scooty (30 Rs/KM)'
      : 'Women Car with AC (80 Rs/KM)';

  const message = [
    `*EAGLE WOMEN'S RIDE - MULTAN BOOKING*`,
    `--------------------------------------`,
    `*City:* Multan, Pakistan`,
    `*Passenger Name:* ${params.passengerName || 'Verified Passenger'}`,
    `*Contact:* ${params.passengerPhone || '03247150585'}`,
    `*Pickup Point (کہاں سے):* ${params.pickup}`,
    `*Destination (کہاں تک):* ${params.destination}`,
    `*Vehicle:* ${vehicleLabel}`,
    `*Distance (کلومیٹر):* ${params.distanceKm} KM`,
    `*Total Fare (کل کرایہ):* PKR ${params.farePkr}`,
    `*Time:* ${params.dateTime}`,
    `--------------------------------------`,
    `_فکس ریٹ، کوئی اضافی چارج نہیں (Fixed Rate, No Extra Charges)_`,
    `_Operating Hours: 06:00 AM - 10:00 PM PKT._`,
    `Please confirm my ride with a verified female driver.`,
  ].join('\n');

  return `https://wa.me/923247150585?text=${encodeURIComponent(message)}`;
}
