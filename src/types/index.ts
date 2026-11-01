export type Language = 'en' | 'ur';

export type UserRole = 'passenger' | 'driver' | 'admin';

export type VehicleCategory = 'bike' | 'scooty' | 'car';

export type RideStatus = 
  | 'idle'
  | 'searching'
  | 'accepted'
  | 'driver_arriving'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type PaymentMethod = 'cash' | 'easypaisa' | 'jazzcash' | 'bank_transfer';

export interface LocationPoint {
  id: string;
  name: string;
  nameUrdu: string;
  roadName: string;
  lat: number;
  lng: number;
  isMainRoad: boolean;
  isSafeHub: boolean;
  landmark: string;
  description: string;
}

export interface FareConfig {
  bike: {
    baseFare: number;
    perKm: number;
    package30Km: number;
    extraPerKm: number;
    minFare: number;
  };
  scooty: {
    baseFare: number;
    perKm: number;
    package30Km: number;
    extraPerKm: number;
    minFare: number;
  };
  car: {
    baseFare: number;
    perKm: number;
    package30Km: number;
    extraPerKm: number;
    minFare: number;
  };
  nightCurfewHourPKT: number; // 22 = 10:00 PM
  morningStartHourPKT: number; // 6 = 6:00 AM
  curfewStrictEnforced: boolean;
}

export interface PassengerProfile {
  id: string;
  fullName: string;
  mobile: string;
  cnic: string;
  photoUrl: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  isOtpVerified: boolean;
  isCnicVerified: boolean;
  isApproved: boolean;
  rating: number;
  totalRides: number;
}

export interface DriverProfile {
  id: string;
  fullName: string;
  mobile: string;
  cnic: string;
  cnicFrontUrl: string;
  cnicBackUrl: string;
  selfieUrl: string;
  drivingLicenceNumber: string;
  drivingLicenceUrl: string;
  vehicleRegistrationUrl: string;
  vehiclePhotos: string[];
  vehicleType: VehicleCategory;
  vehicleModel: string;
  vehicleNumber: string;
  isApproved: boolean;
  approvalStatus: 'approved' | 'pending' | 'rejected';
  isOnline: boolean;
  rating: number;
  totalTrips: number;
  currentLat: number;
  currentLng: number;
  todayEarnings: number;
  weeklyEarnings: number;
  acceptanceRate: number;
}

export interface RideBooking {
  id: string;
  passengerId: string;
  passengerName: string;
  passengerPhone: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  driverPhoto?: string;
  driverRating?: number;
  vehicleType: VehicleCategory;
  vehicleModel?: string;
  vehicleNumber?: string;
  pickupLocation: LocationPoint;
  destinationLocation: LocationPoint;
  pickupAddress: string;
  destinationAddress: string;
  distanceKm: number;
  estimatedMinutes: number;
  estimatedFare: number;
  totalFare?: number;
  perKmRate?: number;
  fromText?: string;
  toText?: string;
  is30KmPackageApplied: boolean;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid';
  status: RideStatus;
  bookingTime: string;
  scheduledTime?: string;
  completedAt?: string;
  ratingGivenByPassenger?: number;
  reviewByPassenger?: string;
  isWhatsAppBooking?: boolean;
  chatMessages?: RideChatMessage[];
}

export interface RideChatMessage {
  id: string;
  senderRole: 'passenger' | 'driver';
  senderName: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface ComplaintReport {
  id: string;
  rideId?: string;
  reporterType: 'passenger' | 'driver';
  reporterName: string;
  reporterContact: string;
  category: 'safety' | 'driver_behavior' | 'fare_dispute' | 'route' | 'emergency' | 'other';
  description: string;
  status: 'pending' | 'in_investigation' | 'resolved';
  createdAt: string;
}
