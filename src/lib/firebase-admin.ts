

import { initializeApp, getApp, getApps, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { credential } from 'firebase-admin';
import * as path from 'path';
// Note: This is a SERVER-only file.
// It is not meant to be used on the client.

let app: App;
if (getApps().length === 0) {
    try {
        // Use the service account key file
        const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(process.cwd(), 'service-account-key.json');
        
        if (require('fs').existsSync(serviceAccountPath)) {
            const serviceAccount = require(serviceAccountPath);
            app = initializeApp({
                projectId: 'lankford-lending',
                credential: credential.cert(serviceAccount)
            });
            console.log('Firebase Admin initialized with service account key');
        } else {
            // Fallback to basic initialization (for development/testing)
            app = initializeApp({
                projectId: 'lankford-lending'
            });
            console.log('Firebase Admin initialized with basic config (no service account)');
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
