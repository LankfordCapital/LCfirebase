
// Do NOT add "use client" here; this module is used by both sides.
// It remains safe because we only access Auth in a client-only function.

import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import type { Auth } from 'firebase/auth';

// Hardcoded Firebase configuration to ensure it is always available.
const firebaseConfig = {
  apiKey: "AIzaSyCu0RxaSo1IKfWQ-as3xOLx8mSMm4CzrpI",
  authDomain: "lankford-lending.firebaseapp.com",
  projectId: "lankford-lending",
  storageBucket: "lankford-lending.appspot.com",
  messagingSenderId: "940157326397",
  appId: "1:940157326397:web:02fbefc8cd0a13c2160654",
};

const required = Object.entries(firebaseConfig).filter(([, v]) => !v);
if (required.length) {
  throw new Error(
    `[firebase] Missing required config values: ${required.map(([k]) => k).join(', ')}.`
  );
}


export const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

// Auth must only be touched on the client. This avoids SSR/Edge "window" issues.
export async function getClientAuth(): Promise<Auth> {
  if (typeof window === 'undefined') {
    // This is a server-side environment, so we can't and shouldn't initialize Auth.
    // The part of the code that needs auth will call this and handle the promise.
    // It's safe to not throw an error here if server-side logic doesn't depend on auth.
    // However, for clarity, we can still log a warning if needed, or just return a Promise that never resolves.
    // A better approach is to ensure this function is only called from client components.
    return new Promise(() => {}); // Return a pending promise on the server
  }
  const { getAuth, browserLocalPersistence, setPersistence } = await import('firebase/auth');
  const auth = getAuth(app);
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch {
    // Ignore persistence errors (e.g., private mode)
  }
  return auth;
}
