

import { initializeApp, getApp, getApps, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { credential } from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
// Note: This is a SERVER-only file.
// It is not meant to be used on the client.

let app: App;
if (getApps().length === 0) {
    try {
        let credentialConfig;
        
        // Try multiple approaches to load credentials
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
            // Option 1: From environment variable (JSON string)
            console.log('Loading Firebase Admin from environment variable');
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
            credentialConfig = credential.cert(serviceAccount);
        } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            // Option 2: From GOOGLE_APPLICATION_CREDENTIALS path
            console.log('Loading Firebase Admin from GOOGLE_APPLICATION_CREDENTIALS');
            credentialConfig = credential.applicationDefault();
        } else {
            // Option 3: Try to load from local file
            const serviceAccountPath = path.join(process.cwd(), 'service-account-key.json');
            console.log('Trying to load service account from:', serviceAccountPath);
            
            try {
                if (fs.existsSync(serviceAccountPath)) {
                    console.log('Service account file found, loading...');
                    const serviceAccountFile = fs.readFileSync(serviceAccountPath, 'utf8');
                    const serviceAccount = JSON.parse(serviceAccountFile);
                    credentialConfig = credential.cert(serviceAccount);
                    console.log('Firebase Admin initialized with local service account key');
                } else {
                    console.log('No service account file found, using application default credentials');
                    credentialConfig = undefined; // Will use default credentials
                }
            } catch (fileError) {
                console.error('Error loading service account file:', fileError);
                console.log('Falling back to application default credentials');
                credentialConfig = undefined;
            }
        }

        // Initialize Firebase Admin
        try {
            if (credentialConfig) {
                app = initializeApp({
                    projectId: 'lankford-lending',
                    credential: credentialConfig
                });
                console.log('Firebase Admin initialized with credentials');
            } else {
                // Fallback for development/cloud environments
                app = initializeApp({
                    projectId: 'lankford-lending'
                });
                console.log('Firebase Admin initialized with default configuration');
            }
        } catch (initError) {
            console.error('Error during Firebase Admin initialization:', initError);
            // Force fallback to basic initialization
            app = initializeApp({
                projectId: 'lankford-lending'
            });
            console.log('Firebase Admin initialized with basic fallback after error');
        }
    } catch (error) {
        console.error('Error initializing Firebase Admin:', error);
        
        // Last resort: try basic initialization
        try {
            app = initializeApp({
                projectId: 'lankford-lending'
            });
            console.log('Firebase Admin initialized with basic fallback config');
        } catch (fallbackError) {
            console.error('Complete Firebase Admin initialization failure:', fallbackError);
            throw fallbackError;
        }
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
