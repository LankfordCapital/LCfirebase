
"use client";

import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, setPersistence, inMemoryPersistence, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

/**
 * Read a NEXT_PUBLIC_ variable and throw a crisp error if missing.
 */
function env(key: string): string {
  const v = process.env[key];
  if (!v || v.trim() === "") {
    throw new Error(
      `Missing required Firebase env var: ${key}. ` +
      `Add it to .env.local (must start with NEXT_PUBLIC_). ` +
      `Then restart the dev server.`
    );
  }
  return v;
}

/**
 * Client-side Firebase web config.
 * These are NOT secrets and must be present at runtime in the browser.
 */
const firebaseConfig = {
  apiKey: env("NEXT_PUBLIC_FIREBASE_API_KEY"),
  authDomain: env("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: env("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: env("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: env("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: env("NEXT_PUBLIC_FIREBASE_APP_ID"),
  // Optional:
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth: Auth = getAuth(app);
// Note: Not awaiting setPersistence here as it's not critical for initialization
// and we want to avoid any top-level awaits in a client file.
setPersistence(auth, inMemoryPersistence).catch((error) => {
  console.warn("Firebase persistence error", error);
});


const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

export { app, auth, db, storage };
