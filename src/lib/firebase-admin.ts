
import { initializeApp, getApp, getApps, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

// Note: This is a SERVER-only file.
// It is not meant to be used on the client.

let app: App;
if (getApps().length === 0) {
    // Check if we're in development mode and use emulator if available
    if (process.env.NODE_ENV === 'development') {
        app = initializeApp({
            projectId: 'lankford-lending'
        });
        
        // Use Firestore emulator in development if available
        if (process.env.FIRESTORE_EMULATOR_HOST) {
            console.log('Using Firestore emulator');
        }
    } else {
        // Production mode - use service account or default credentials
        app = initializeApp({
            projectId: 'lankford-lending'
        });
    }
} else {
    app = getApp();
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { auth as adminAuth, db as adminDb };
