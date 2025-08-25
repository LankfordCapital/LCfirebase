
import { initializeApp, getApp, getApps, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

// Note: This is a SERVER-only file.
// It is not meant to be used on the client.

let app: App;
if (getApps().length === 0) {
    app = initializeApp({
        projectId: 'lankford-lending'
    });
} else {
    app = getApp();
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { auth as adminAuth, db as adminDb };
