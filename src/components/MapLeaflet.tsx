import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { LocationPoint, VehicleCategory } from '../types';

export interface MapLeafletProps {
  // Support both pickupLocation/destLocation and pickup/destination
  pickupLocation?: LocationPoint;
  destLocation?: LocationPoint;
  pickup?: LocationPoint;
  destination?: LocationPoint;
  driverLocation?: { lat: number; lng: number };
  vehicleType?: VehicleCategory;
  onSelectCoordinates?: (lat: number, lng: number, mode: 'pickup' | 'destination') => void;
  selectionMode?: 'pickup' | 'destination' | null;
  interactive?: boolean;
}

const DEFAULT_PICKUP: LocationPoint = {
  id: 'bosan_road',
  name: 'Bosan Road (Women Univ Gate)',
  nameUrdu: 'بوسن روڈ',
  roadName: 'Bosan Road',
  lat: 30.2585,
  lng: 71.5147,
  isMainRoad: true,
  isSafeHub: true,
  landmark: 'Women University Gate',
  description: 'Main Bosan Road Safe Corridor',
};

const DEFAULT_DEST: LocationPoint = {
  id: 'gulgasht',
  name: 'Gulgasht Colony Gol Bagh',
  nameUrdu: 'گلگشت مین گول باغ',
  roadName: 'Pir Khurshid Colony Road',
  lat: 30.2291,
  lng: 71.4883,
  isMainRoad: true,
  isSafeHub: true,
  landmark: 'Gol Bagh Market',
  description: 'Approved Main Road Safe Point',
};

export const MapLeaflet: React.FC<MapLeafletProps> = ({
  pickupLocation,
  destLocation,
  pickup,
  destination,
  driverLocation,
  vehicleType = 'scooty',
  onSelectCoordinates,
  selectionMode = null,
  interactive = true,
}) => {
  // Normalize pickup and destination from either prop variant
  const activePickup = pickupLocation || pickup || DEFAULT_PICKUP;
  const activeDest = destLocation || destination || DEFAULT_DEST;

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const pickupMarkerRef = useRef<L.Marker | null>(null);
  const destMarkerRef = useRef<L.Marker | null>(null);
  const driverMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const routeGlowPolylineRef = useRef<L.Polyline | null>(null);
  const driverApproachPolylineRef = useRef<L.Polyline | null>(null);
  const lastBoundsKeyRef = useRef<string>('');

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [activePickup.lat, activePickup.lng],
        zoom: 13,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add zoom control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Handle map click for selecting points
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (onSelectCoordinates && selectionMode) {
        onSelectCoordinates(e.latlng.lat, e.latlng.lng, selectionMode);
      }
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [onSelectCoordinates, selectionMode]);

  // Update Markers and Draw Trip Polyline Route
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 1. Custom Icon for Pickup (Deep Pink with Crown / Location Pin)
    const pickupIcon = L.divIcon({
      className: 'custom-pin-pickup',
      html: `
        <div style="
          background: linear-gradient(135deg, #be185d, #ec4899);
          border: 2px solid #ffffff;
          box-shadow: 0 4px 12px rgba(190, 24, 93, 0.45);
          width: 36px;
          height: 36px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="
            transform: rotate(45deg);
            color: #ffffff;
            font-size: 13px;
            font-weight: 700;
          ">📍</span>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -34],
    });

    // 2. Custom Icon for Destination (Rich Golden Amber with Checkered Flag)
    const destIcon = L.divIcon({
      className: 'custom-pin-dest',
      html: `
        <div style="
          background: linear-gradient(135deg, #d97706, #f59e0b);
          border: 2px solid #ffffff;
          box-shadow: 0 4px 12px rgba(217, 119, 6, 0.45);
          width: 36px;
          height: 36px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="
            transform: rotate(45deg);
            color: #ffffff;
            font-size: 13px;
            font-weight: 700;
          ">🏁</span>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -34],
    });

    // 3. Custom Icon for Female Driver Vehicle
    const driverIcon = L.divIcon({
      className: 'custom-pin-driver',
      html: `
        <div style="
          background: #ffffff;
          border: 2px solid #be185d;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        ">
          <span style="font-size: 19px;">
            ${vehicleType === 'bike' ? '🏍️' : vehicleType === 'car' ? '🚗' : '🛵'}
          </span>
          <span style="
            position: absolute;
            top: -3px;
            right: -3px;
            background: #10b981;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid white;
          "></span>
        </div>
      `,
      iconSize: [42, 42],
      iconAnchor: [21, 21],
    });

    // Update Pickup Marker
    if (pickupMarkerRef.current) {
      pickupMarkerRef.current.setLatLng([activePickup.lat, activePickup.lng]);
    } else {
      pickupMarkerRef.current = L.marker([activePickup.lat, activePickup.lng], {
        icon: pickupIcon,
        draggable: interactive && selectionMode === 'pickup',
      })
        .addTo(map)
        .bindPopup(`<b>Pickup (کہاں سے):</b><br/>${activePickup.name}`);
    }

    // Update Destination Marker
    if (destMarkerRef.current) {
      destMarkerRef.current.setLatLng([activeDest.lat, activeDest.lng]);
    } else {
      destMarkerRef.current = L.marker([activeDest.lat, activeDest.lng], {
        icon: destIcon,
        draggable: interactive && selectionMode === 'destination',
      })
        .addTo(map)
        .bindPopup(`<b>Destination (کہاں تک):</b><br/>${activeDest.name}`);
    }

    // Update Driver Marker
    if (driverLocation) {
      if (driverMarkerRef.current) {
        driverMarkerRef.current.setLatLng([driverLocation.lat, driverLocation.lng]);
      } else {
        driverMarkerRef.current = L.marker([driverLocation.lat, driverLocation.lng], {
          icon: driverIcon,
        })
          .addTo(map)
          .bindPopup(`<b>Eagle Verified Rider</b><br/>Live En Route`);
      }
    } else if (driverMarkerRef.current) {
      driverMarkerRef.current.remove();
      driverMarkerRef.current = null;
    }

    // 4. DRAW TRIP ROUTE POLYLINE (Dashed path between pickupLocation and destLocation)
    // Multan corridor path coordinates with natural road curve
    const midLat = (activePickup.lat + activeDest.lat) / 2;
    const midLng = (activePickup.lng + activeDest.lng) / 2;
    // Slight offset for Multan city road curvature
    const bendLat = midLat + (activeDest.lng > activePickup.lng ? 0.002 : -0.002);
    const bendLng = midLng + (activeDest.lat > activePickup.lat ? -0.003 : 0.003);

    const tripRouteCoords: L.LatLngExpression[] = [
      [activePickup.lat, activePickup.lng],
      [bendLat, bendLng],
      [activeDest.lat, activeDest.lng],
    ];

    // Background glow/casing polyline
    if (routeGlowPolylineRef.current) {
      routeGlowPolylineRef.current.setLatLngs(tripRouteCoords);
    } else {
      routeGlowPolylineRef.current = L.polyline(tripRouteCoords, {
        color: '#f43f5e',
        weight: 8,
        opacity: 0.25,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);
    }

    // Main vibrant dashed route polyline (#E91E63)
    if (routePolylineRef.current) {
      routePolylineRef.current.setLatLngs(tripRouteCoords);
    } else {
      routePolylineRef.current = L.polyline(tripRouteCoords, {
        color: '#E91E63',
        weight: 4.5,
        opacity: 0.95,
        dashArray: '8, 8',
        className: 'leaflet-trip-route-dash',
        lineCap: 'round',
        lineJoin: 'round',
      })
        .addTo(map)
        .bindTooltip(
          `<b>Safe Route:</b> ${activePickup.name.split('(')[0]} ➔ ${activeDest.name.split('(')[0]}`,
          { sticky: true, className: 'bg-white px-2 py-1 rounded shadow text-xs font-semibold' }
        );
    }

    // Optional driver approach line to pickup if active
    if (driverLocation) {
      const approachCoords: L.LatLngExpression[] = [
        [driverLocation.lat, driverLocation.lng],
        [activePickup.lat, activePickup.lng],
      ];
      if (driverApproachPolylineRef.current) {
        driverApproachPolylineRef.current.setLatLngs(approachCoords);
      } else {
        driverApproachPolylineRef.current = L.polyline(approachCoords, {
          color: '#10b981',
          weight: 3,
          dashArray: '4, 6',
          opacity: 0.8,
          lineCap: 'round',
        }).addTo(map);
      }
    } else if (driverApproachPolylineRef.current) {
      driverApproachPolylineRef.current.remove();
      driverApproachPolylineRef.current = null;
    }

    // Fit map bounds to frame pickup and destination nicely (on change or initial render)
    const currentBoundsKey = `${activePickup.lat.toFixed(4)},${activePickup.lng.toFixed(4)}-${activeDest.lat.toFixed(4)},${activeDest.lng.toFixed(4)}`;
    if (lastBoundsKeyRef.current !== currentBoundsKey) {
      const bounds = L.latLngBounds([
        [activePickup.lat, activePickup.lng],
        [activeDest.lat, activeDest.lng],
        ...(driverLocation ? [[driverLocation.lat, driverLocation.lng] as [number, number]] : []),
      ]);
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 15 });
      lastBoundsKeyRef.current = currentBoundsKey;
    }
  }, [
    activePickup.lat,
    activePickup.lng,
    activePickup.name,
    activeDest.lat,
    activeDest.lng,
    activeDest.name,
    driverLocation,
    vehicleType,
    interactive,
    selectionMode,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (routeGlowPolylineRef.current) {
        routeGlowPolylineRef.current.remove();
        routeGlowPolylineRef.current = null;
      }
      if (routePolylineRef.current) {
        routePolylineRef.current.remove();
        routePolylineRef.current = null;
      }
      if (driverApproachPolylineRef.current) {
        driverApproachPolylineRef.current.remove();
        driverApproachPolylineRef.current = null;
      }
      if (pickupMarkerRef.current) {
        pickupMarkerRef.current.remove();
        pickupMarkerRef.current = null;
      }
      if (destMarkerRef.current) {
        destMarkerRef.current.remove();
        destMarkerRef.current = null;
      }
      if (driverMarkerRef.current) {
        driverMarkerRef.current.remove();
        driverMarkerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[260px] rounded-2xl overflow-hidden shadow-inner border border-rose-100 bg-rose-50/20">
      <div ref={mapContainerRef} className="w-full h-full min-h-[260px]" />

      {/* Selection Mode Guide Overlay */}
      {selectionMode && (
        <div className="absolute top-3 left-3 right-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-pink-200 shadow-md text-xs font-medium text-pink-900 flex items-center justify-between">
          <span>
            📍 Tap on map to set {selectionMode === 'pickup' ? 'Pickup Main Road' : 'Safe Destination'}
          </span>
          <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
            Multan Verified Safe Corridor
          </span>
        </div>
      )}

      {/* Legend Badge */}
      <div className="absolute bottom-3 left-3 z-[990] bg-white/90 backdrop-blur-xs px-2.5 py-1.5 rounded-xl border border-rose-200 shadow-xs text-[10px] flex items-center gap-2">
        <span className="flex items-center gap-1 font-bold text-pink-800">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-600 inline-block"></span>
          Pickup
        </span>
        <span className="text-slate-300">|</span>
        <span className="flex items-center gap-1 font-bold text-amber-800">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
          Destination
        </span>
        <span className="text-slate-300">|</span>
        <span className="flex items-center gap-1 font-mono font-bold text-pink-700">
          <span className="w-4 h-0.5 border-t-2 border-dashed border-pink-600 inline-block"></span>
          Trip Route
        </span>
      </div>
    </div>
  );
};
