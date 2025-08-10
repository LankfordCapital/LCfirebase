
"use client";

import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, setPersistence, inMemoryPersistence, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";


/**
 * Client-side Firebase web config.
 * These are NOT secrets and must be present at runtime in the browser.
 */
const firebaseConfig = {
  apiKey: "AIzaSyCu0RxaSo1IKfWQ-as3xOLx8mSMm4CzrpI",
  authDomain: "lankford-lending.firebaseapp.com",
  projectId: "lankford-lending",
  storageBucket: "lankford-lending.firebasestorage.app",
  messagingSenderId: "940157326397",
  appId: "1:940157326397:web:02fbefc8cd0a13c2160654",
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
