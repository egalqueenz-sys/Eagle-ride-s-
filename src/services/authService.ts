import { loginWithGooglePopup, logoutUser } from './firebase';

export interface UserSession {
  uid: string;
  displayName: string;
  email: string | null;
  photoURL: string | null;
  isGuest: boolean;
  phoneNumber?: string;
}

const SESSION_KEY = 'eagle_user_session';

export function getStoredSession(): UserSession {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to parse user session:', e);
  }

  // Default Guest session
  const defaultGuest: UserSession = {
    uid: 'guest_' + Math.random().toString(36).substring(2, 9),
    displayName: 'Guest Passenger (مہمان مسافر)',
    email: null,
    photoURL: null,
    isGuest: true,
    phoneNumber: '03247150585',
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(defaultGuest));
  return defaultGuest;
}

export function saveSession(session: UserSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export async function signInGoogle(): Promise<UserSession> {
  try {
    const res = await loginWithGooglePopup();
    const user = res.user;
    const session: UserSession = {
      uid: user.uid,
      displayName: user.displayName || 'Eagle Passenger',
      email: user.email,
      photoURL: user.photoURL,
      isGuest: false,
    };
    saveSession(session);
    return session;
  } catch (err) {
    console.warn('Google sign-in fallback to Guest:', err);
    return getStoredSession();
  }
}

export function continueAsGuest(customName?: string): UserSession {
  const session: UserSession = {
    uid: 'guest_' + Date.now(),
    displayName: customName || 'Guest Passenger (خاتون مسافر)',
    email: null,
    photoURL: null,
    isGuest: true,
    phoneNumber: '03247150585',
  };
  saveSession(session);
  return session;
}

export async function signOutSession(): Promise<UserSession> {
  await logoutUser();
  return continueAsGuest();
}
