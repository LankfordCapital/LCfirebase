
// Do NOT add "use client" here; this module is used by both sides.
// It remains safe because we only access Auth in a client-only function.

import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import type { Auth } from 'firebase/auth';

// IMPORTANT: Access NEXT_PUBLIC_* directly. No "process = {}" shims, no destructuring.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // Optional:
  ...(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    ? { measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID }
    : {}),
};

// Minimal runtime validation that does NOT touch "process" beyond the inlined reads above.
const required = [
  ['apiKey', firebaseConfig.apiKey],
  ['authDomain', firebaseConfig.authDomain],
  ['projectId', firebaseConfig.projectId],
  ['storageBucket', firebaseConfig.storageBucket],
  ['messagingSenderId', firebaseConfig.messagingSenderId],
  ['appId', firebaseConfig.appId],
] as const;

const missing = required.filter(([, v]) => !v || v === 'YOUR_API_KEY' || v?.trim() === '');
if (missing.length) {
  throw new Error(
    `[firebase] Missing required env vars: ${missing.map(([k]) => k).join(
      ', '
    )}. Put them in .env.local with NEXT_PUBLIC_ prefixes and restart dev server.`
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
