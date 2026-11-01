import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

// Standard fallback config for Multan Eagle App
const defaultConfig = {
  apiKey: "AIzaSyDummyKeyForEagleRideMultan2026",
  authDomain: "eagle-womens-ride-multan.firebaseapp.com",
  projectId: "eagle-womens-ride-multan",
  storageBucket: "eagle-womens-ride-multan.appspot.com",
  messagingSenderId: "98558632611",
  appId: "1:98558632611:web:eaglewomensridemultan",
};

let app: FirebaseApp;
let db: Firestore | null = null;
let auth: Auth | null = null;

try {
  if (getApps().length === 0) {
    app = initializeApp(defaultConfig);
  } else {
    app = getApp();
  }
  db = getFirestore(app);
  auth = getAuth(app);
} catch (err) {
  console.warn('Firebase initialization in offline/standalone mode:', err);
}

export { app, db, auth };
export const googleProvider = new GoogleAuthProvider();

export async function loginWithGooglePopup() {
  if (!auth) {
    throw new Error('Firebase Auth not available');
  }
  return signInWithPopup(auth, googleProvider);
}

export async function logoutUser() {
  if (auth) {
    await signOut(auth);
  }
  localStorage.removeItem('eagle_user_session');
}
