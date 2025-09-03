
"use client";

import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence, type Auth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCu0RxaSo1IKfWQ-as3xOLx8mSMm4CzrpI",
  authDomain: "lankford-lending.firebaseapp.com",
  projectId: "lankford-lending",
  storageBucket: "lankford-lending.firebasestorage.app",
  messagingSenderId: "940157326397",
  appId: "1:940157326397:web:02fbefc8cd0a13c2160654",
  measurementId: ""
};

let app: FirebaseApp;

try {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase app:', error);
  throw error;
}

let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

try {
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  console.log('Firebase services initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase services:', error);
  throw error;
}

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

if (typeof window !== 'undefined') {
    setPersistence(auth, browserLocalPersistence).catch((error) => { 
        console.warn("Firebase persistence error", error);
    });
}

export { app, auth, db, storage, googleProvider };
