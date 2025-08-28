
import { initializeApp, getApp, getApps, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { credential } from 'firebase-admin';
// Note: This is a SERVER-only file.
// It is not meant to be used on the client.

let app: App;
if (getApps().length === 0) {
    try {
        // Use the service account key file via environment variable
        const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
        if (serviceAccountPath) {
            app = initializeApp({
                projectId: 'lankford-lending',
                credential: credential.applicationDefault()
            });
            console.log('Firebase Admin initialized with service account key');
        } else {
            // Fallback to basic initialization
            app = initializeApp({
                projectId: 'lankford-lending'
            });
            console.log('Firebase Admin initialized with basic config');
        }
    } catch (error) {
        console.error('Error initializing Firebase Admin:', error);
        throw error;
    }
    
    // Use Firestore emulator in development if available
    if (process.env.FIRESTORE_EMULATOR_HOST) {
        console.log('Using Firestore emulator');
    }
} else {
    app = getApp();
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { auth as adminAuth, db as adminDb };
