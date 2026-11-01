import { collection, addDoc, doc, setDoc, getDocs, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { RideBooking } from '../types';

const LOCAL_STORAGE_KEY = 'eagle_rides_collection';

export async function saveRideBooking(booking: RideBooking): Promise<void> {
  // 1. Save locally to localStorage first (instant & resilient)
  try {
    const existingStr = localStorage.getItem(LOCAL_STORAGE_KEY);
    const existing: RideBooking[] = existingStr ? JSON.parse(existingStr) : [];
    const updated = [booking, ...existing.filter((b) => b.id !== booking.id)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed saving to localStorage:', err);
  }

  // 2. Save to Firestore collection 'rides'
  if (db) {
    try {
      const ridesRef = collection(db, 'rides');
      // Use booking.id as doc ID if possible, or addDoc
      await setDoc(doc(ridesRef, booking.id), {
        ...booking,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log(`Saved ride ${booking.id} to Firestore collection 'rides'`);
    } catch (firestoreErr) {
      console.warn('Firestore write warning (persisted locally):', firestoreErr);
    }
  }
}

export async function loadSavedRides(): Promise<RideBooking[]> {
  // 1. Check local storage
  let localRides: RideBooking[] = [];
  try {
    const existingStr = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (existingStr) {
      localRides = JSON.parse(existingStr);
    }
  } catch (err) {
    console.warn('Failed parsing local rides:', err);
  }

  // 2. Fetch from Firestore if available
  if (db) {
    try {
      const ridesRef = collection(db, 'rides');
      const q = query(ridesRef, orderBy('bookingTime', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const firestoreRides: RideBooking[] = [];
        snapshot.forEach((docSnap) => {
          firestoreRides.push(docSnap.data() as RideBooking);
        });
        return firestoreRides;
      }
    } catch (err) {
      console.warn('Firestore read error (falling back to local cache):', err);
    }
  }

  return localRides;
}

export async function updateRideStatus(rideId: string, status: string): Promise<void> {
  // Local storage update
  try {
    const existingStr = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (existingStr) {
      const rides: RideBooking[] = JSON.parse(existingStr);
      const updated = rides.map((r) => (r.id === rideId ? { ...r, status: status as any } : r));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (err) {
    console.warn('Failed updating local storage ride status:', err);
  }

  // Firestore update
  if (db) {
    try {
      const rideDocRef = doc(db, 'rides', rideId);
      await updateDoc(rideDocRef, {
        status,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firestore update status warning:', err);
    }
  }
}
