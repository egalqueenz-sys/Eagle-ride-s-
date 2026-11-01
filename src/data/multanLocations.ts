import { LocationPoint } from '../types';

export const MULTAN_CENTER = {
  lat: 30.1984,
  lng: 71.4687,
  zoom: 13,
};

export const APPROVED_SAFE_LOCATIONS: LocationPoint[] = [
  {
    id: 'bosan_road',
    name: 'Bosan Road (BZU & Mall of Multan)',
    nameUrdu: 'بوسن روڈ (بی زیڈ یو اور مال آف ملتان)',
    roadName: 'Bosan Road',
    lat: 30.2642,
    lng: 71.5098,
    isMainRoad: true,
    isSafeHub: true,
    landmark: 'Bosan Road Commercial Corridor',
    description: 'Premier wide boulevard with CCTV surveillance and high lighting.',
  },
  {
    id: 'gulgasht',
    name: 'Gulgasht (Gol Bagh & Commercial Center)',
    nameUrdu: 'گلگشت (گول باغ و کمرشل سینٹر)',
    roadName: 'Pir Khurshid Colony Road',
    lat: 30.2291,
    lng: 71.4883,
    isMainRoad: true,
    isSafeHub: true,
    landmark: 'Gol Bagh Commercial Market',
    description: 'Bustling family shopping market, CCTV surveillance, active women shops.',
  },
  {
    id: 'cantt',
    name: 'Cantt (Sadar Bazaar & Mall Road)',
    nameUrdu: 'کینٹ (صدر بازار و مال روڈ)',
    roadName: 'Mall Road Cantt',
    lat: 30.1834,
    lng: 71.4428,
    isMainRoad: true,
    isSafeHub: true,
    landmark: 'Cantt Sadar & Army Public School',
    description: 'High-security Cantonment main road with checkpoints and illuminated walkways.',
  },
  {
    id: 'model_town',
    name: 'Model Town (Main Commercial Boulevard)',
    nameUrdu: 'ماڈل ٹاؤن (مین کمرشل بلیوارڈ)',
    roadName: 'Model Town Main Boulevard',
    lat: 30.1912,
    lng: 71.4556,
    isMainRoad: true,
    isSafeHub: true,
    landmark: 'Model Town Central Park',
    description: 'Peaceful, well-lit residential and commercial avenue with security gates.',
  },
  {
    id: 'mda_chowk',
    name: 'MDA Chowk (Officers Colony Road)',
    nameUrdu: 'ایم ڈی اے چوک (آفیسرز کالونی روڈ)',
    roadName: 'Officers Colony Road',
    lat: 30.2118,
    lng: 71.4651,
    isMainRoad: true,
    isSafeHub: true,
    landmark: 'Multan Development Authority Head Office',
    description: 'Spacious four-lane commercial junction with family dining and pharmaceutical stores.',
  },
  {
    id: 'shalimar',
    name: 'Shalimar (Shalimar Colony / Bosan Road)',
    nameUrdu: 'شالیمار (شالیمار کالونی / بوسن روڈ)',
    roadName: 'Shalimar Colony Main Road',
    lat: 30.2415,
    lng: 71.5012,
    isMainRoad: true,
    isSafeHub: true,
    landmark: 'Shalimar Colony Commercial Point',
    description: 'High-class family residential safe drop-off zone with active patrols.',
  },
  {
    id: 'vehari_chowk',
    name: 'Vehari Chowk (Vehari Road Main Junction)',
    nameUrdu: 'وہاڑی چوک (وہاڑی روڈ مین جنکشن)',
    roadName: 'Vehari Road',
    lat: 30.1765,
    lng: 71.4912,
    isMainRoad: true,
    isSafeHub: true,
    landmark: 'Vehari Chowk Traffic Point',
    description: 'Major arterial connection with constant police and traffic wardens presence.',
  },
  {
    id: 'nishtar_main_gate',
    name: 'Nishtar Medical University & Hospital Gate, Nishtar Road',
    nameUrdu: 'نشتر میڈیکل یونیورسٹی و ہسپتال گیٹ، نشتر روڈ',
    roadName: 'Nishtar Road',
    lat: 30.1856,
    lng: 71.4632,
    isMainRoad: true,
    isSafeHub: true,
    landmark: 'Nishtar Hospital Main Entrance',
    description: 'Round-the-clock emergency hospital gate, high lighting, dedicated women staff transit point.',
  },
  {
    id: 'abdali_road_sp_chowk',
    name: 'Abdali Road, Near SP Chowk & State Life Building',
    nameUrdu: 'ابدالی روڈ، نزد ایس پی چوک اور سٹیٹ لائف بلڈنگ',
    roadName: 'Abdali Road',
    lat: 30.1947,
    lng: 71.4582,
    isMainRoad: true,
    isSafeHub: true,
    landmark: 'State Life Insurance & Banks Hub',
    description: 'Prestigious corporate avenue with wide boulevard, bank security, and CCTV coverage.',
  },
  {
    id: 'metro_chungi_9',
    name: 'Metro Bus Chungi No. 9 Station, LMQ Road',
    nameUrdu: 'میٹرو بس چونگی نمبر 9 سٹیشن، ایل ایم کیو روڈ',
    roadName: 'LMQ Road',
    lat: 30.2185,
    lng: 71.4789,
    isMainRoad: true,
    isSafeHub: true,
    landmark: 'Chungi No. 9 Metro Terminal',
    description: 'Multan Metro elevated terminal with female security guards, elevator access, and lighting.',
  },
  {
    id: 'kachehri_chowk',
    name: 'Kachehri Chowk, Khanewal Road / Old Bahawalpur Road',
    nameUrdu: 'کچہری چوک، خانیوال روڈ',
    roadName: 'Khanewal Road',
    lat: 30.2012,
    lng: 71.4719,
    isMainRoad: true,
    isSafeHub: true,
    landmark: 'District Courts & Commissioner Office',
    description: 'Central civil intersection monitored by Multan Safe City traffic control center.',
  },
  {
    id: 'mda_chowk',
    name: 'MDA Chowk, Officers Colony Main Road',
    nameUrdu: 'ایم ڈی اے چوک، آفیسرز کالونی روڈ',
    roadName: 'Officers Colony Road',
    lat: 30.2118,
    lng: 71.4651,
    isMainRoad: true,
    isSafeHub: true,
    landmark: 'Multan Development Authority Head Office',
    description: 'Spacious four-lane commercial junction with family dining and pharmaceutical stores.',
  },
  {
    id: 'dha_multan_gate',
    name: 'DHA Multan Main Boulevard Gate, Bosan Road Extension',
    nameUrdu: 'ڈی ایچ اے ملتان مین بلیوارڈ گیٹ',
    roadName: 'Bosan Road Ext / DHA Expressway',
    lat: 30.2845,
    lng: 71.5342,
    isMainRoad: true,
    isSafeHub: true,
    landmark: 'DHA Multan Grand Gate',
    description: 'Secured gated entry with military-grade perimeter monitoring and waiting lounge.',
  },
  {
    id: 'railway_station_multan',
    name: 'Multan Cantt Railway Station VIP Gate',
    nameUrdu: 'ملتان کینٹ ریلوے اسٹیشن مین گیٹ',
    roadName: 'Station Road Cantt',
    lat: 30.1742,
    lng: 71.4395,
    isMainRoad: true,
    isSafeHub: true,
    landmark: 'Multan Railway Station',
    description: 'Railway police station adjacent, dedicated taxi/ride-hailing designated waiting lane.',
  },
  {
    id: 'multan_airport',
    name: 'Multan International Airport Main Concourse',
    nameUrdu: 'ملتان انٹرنیشنل ایئرپورٹ مین گیٹ',
    roadName: 'Airport Road',
    lat: 30.2036,
    lng: 71.4285,
    isMainRoad: true,
    isSafeHub: true,
    landmark: 'Multan International Airport (MUX)',
    description: 'Airport security force (ASF) monitored pickup area, 100% lit safe terminal.',
  },
];

// Helper to calculate distance between two coordinates in kilometers using Haversine formula
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  // Account for actual road driving curve multiplier (~1.3x)
  return Math.max(1.0, Math.round(d * 1.35 * 10) / 10);
}

// Find nearest approved safe point
export function findNearestSafePoint(lat: number, lng: number): LocationPoint {
  let nearest = APPROVED_SAFE_LOCATIONS[0];
  let minDistance = calculateHaversineDistance(lat, lng, nearest.lat, nearest.lng);

  for (const loc of APPROVED_SAFE_LOCATIONS) {
    const dist = calculateHaversineDistance(lat, lng, loc.lat, loc.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = loc;
    }
  }
  return nearest;
}
