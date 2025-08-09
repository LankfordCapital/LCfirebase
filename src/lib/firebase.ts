
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import getConfig from 'next/config';

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig() || {};

const firebaseConfig = {
  apiKey: serverRuntimeConfig?.NEXT_PUBLIC_FIREBASE_API_KEY || publicRuntimeConfig?.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: serverRuntimeConfig?.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || publicRuntimeConfig?.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: serverRuntimeConfig?.NEXT_PUBLIC_FIREBASE_PROJECT_ID || publicRuntimeConfig?.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: serverRuntimeConfig?.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || publicRuntimeConfig?.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: serverRuntimeConfig?.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || publicRuntimeConfig?.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: serverRuntimeConfig?.NEXT_PUBLIC_FIREBASE_APP_ID || publicRuntimeConfig?.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: serverRuntimeConfig?.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || publicRuntimeConfig?.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};


const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

export { app, auth, db, storage };
