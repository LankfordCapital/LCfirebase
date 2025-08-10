"use client";

import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence, type Auth } from "firebase/auth";
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


const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

if (typeof window !== 'undefined') {
    setPersistence(auth, browserLocalPersistence).catch((error) => { 
        console.warn("Firebase persistence error", error);
    });
}

export { app, auth, db, storage };
