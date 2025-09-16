
"use client";

import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence, browserSessionPersistence, type Auth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCu0RxaSo1IKfWQ-as3xOLx8mSMm4CzrpI",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "lankford-lending.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "lankford-lending",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "lankford-lending.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "940157326397",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:940157326397:web:02fbefc8cd0a13c2160654",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ""
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

// Global variable to track if user explicitly logged out
let userExplicitlyLoggedOut = false;

// Check if user explicitly logged out from localStorage
if (typeof window !== 'undefined') {
    userExplicitlyLoggedOut = localStorage.getItem('userExplicitlyLoggedOut') === 'true';
}

if (typeof window !== 'undefined') {
    // Production-ready persistence setup with comprehensive error handling
    const setupPersistence = async () => {
        try {
            // Only set persistence if user hasn't explicitly logged out
            if (!userExplicitlyLoggedOut) {
                // Use session persistence for automatic logout on browser close
                await setPersistence(auth, browserSessionPersistence);
                
                if (process.env.NODE_ENV === 'development') {
                    console.log('Firebase auth persistence set to browserSessionPersistence');
                }
            } else {
                if (process.env.NODE_ENV === 'development') {
                    console.log('User explicitly logged out, skipping persistence setup');
                }
                // Clear the explicit logout flag after app restart
                localStorage.removeItem('userExplicitlyLoggedOut');
                userExplicitlyLoggedOut = false;
            }
        } catch (error) {
            // Comprehensive error handling with fallback strategy
            console.warn("Failed to set browserSessionPersistence, trying fallback:", error);
            
            try {
                // Fallback to local persistence if session fails
                await setPersistence(auth, browserLocalPersistence);
                
                if (process.env.NODE_ENV === 'development') {
                    console.log('Firebase auth persistence set to browserLocalPersistence (fallback)');
                }
            } catch (fallbackError) {
                // Final fallback - let Firebase use default persistence
                console.warn("Failed to set any persistence, auth will use default:", fallbackError);
                
                // In production, we might want to track this error
                if (process.env.NODE_ENV === 'production') {
                    // Could send to error tracking service here
                    console.error('Critical: Unable to set Firebase auth persistence', fallbackError);
                }
            }
        }
    };
    
    // Set up persistence with error boundary
    setupPersistence().catch((error) => {
        console.error('Critical error in persistence setup:', error);
    });
}

// Export function to mark explicit logout
export const markExplicitLogout = () => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('userExplicitlyLoggedOut', 'true');
        userExplicitlyLoggedOut = true;
        console.log('🔒 User explicitly logged out - will not auto-restore session');
    }
};

// Export function to clear explicit logout (for successful sign-ins)
export const clearExplicitLogout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('userExplicitlyLoggedOut');
        userExplicitlyLoggedOut = false;
        console.log('🔓 Explicit logout flag cleared - session persistence restored');
    }
};

// Comprehensive cache clearing function
export const clearAllAuthCache = () => {
    if (typeof window !== 'undefined') {
        console.log('🧹 Clearing all authentication cache...');
        
        try {
            // Clear localStorage items related to authentication
            const authKeys = [
                'userExplicitlyLoggedOut',
                'firebase:authUser',
                'firebase:host',
                'firebase:app',
                'firebase:auth',
                'firebase:config'
            ];
            
            // Clear all localStorage keys that might contain auth data
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                if (key && (
                    key.includes('firebase') ||
                    key.includes('auth') ||
                    key.includes('user') ||
                    key.includes('token') ||
                    key.includes('session') ||
                    key.includes('login') ||
                    authKeys.includes(key)
                )) {
                    localStorage.removeItem(key);
                    console.log(`🗑️ Removed localStorage key: ${key}`);
                }
            }
            
            // Clear sessionStorage completely
            sessionStorage.clear();
            console.log('🗑️ Cleared all sessionStorage');
            
            // Clear IndexedDB if it exists (Firebase might use it)
            if ('indexedDB' in window) {
                try {
                    indexedDB.deleteDatabase('firebaseLocalStorageDb');
                    console.log('🗑️ Cleared Firebase IndexedDB');
                } catch (error) {
                    console.warn('Could not clear IndexedDB:', error);
                }
            }
            
            // Clear any service worker caches
            if ('caches' in window) {
                caches.keys().then(cacheNames => {
                    cacheNames.forEach(cacheName => {
                        if (cacheName.includes('auth') || cacheName.includes('firebase')) {
                            caches.delete(cacheName);
                            console.log(`🗑️ Cleared cache: ${cacheName}`);
                        }
                    });
                });
            }
            
            // Force reload the page to clear any in-memory cache
            console.log('🔄 Forcing page reload to clear in-memory cache...');
            setTimeout(() => {
                window.location.reload();
            }, 100);
            
        } catch (error) {
            console.error('Error clearing auth cache:', error);
        }
    }
};

// Production-ready function to clear authentication-related cache
export const clearAuthCache = () => {
    if (typeof window !== 'undefined') {
        try {
            // Clear Firebase-specific localStorage
            const firebaseKeys = Object.keys(localStorage).filter(key => 
                key.startsWith('firebase:') || 
                key.includes('authUser') ||
                key.includes('userExplicitlyLoggedOut')
            );
            
            firebaseKeys.forEach(key => {
                localStorage.removeItem(key);
                if (process.env.NODE_ENV === 'development') {
                    console.log(`🗑️ Removed auth key: ${key}`);
                }
            });
            
            // Clear sessionStorage for complete logout
            sessionStorage.clear();
            
            if (process.env.NODE_ENV === 'development') {
                console.log('✅ Authentication cache cleared');
            }
            
        } catch (error) {
            console.error('Error clearing auth cache:', error);
        }
    }
};

export { app, auth, db, storage, googleProvider };
