// Database Initialization Script
// This script ensures essential Firestore collections exist and are properly structured

import { db } from './firebase-client';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// Collection names
const COLLECTIONS = {
  ENHANCED_LOAN_APPLICATIONS: 'enhancedLoanApplications',
  USERS: 'users',
  BORROWER_PROFILES: 'borrower-profiles'
};

// Initialize database collections
export async function initializeDatabase() {
  console.log('Initializing database collections...');
  
  try {
    // Ensure each collection exists by creating an _init document
    await ensureCollectionExists(COLLECTIONS.ENHANCED_LOAN_APPLICATIONS);
    await ensureCollectionExists(COLLECTIONS.USERS);
    await ensureCollectionExists(COLLECTIONS.BORROWER_PROFILES);
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    // Don't throw - allow the app to continue even if initialization fails
  }
}

// Ensure a collection exists by creating an _init document
async function ensureCollectionExists(collectionName: string) {
  try {
    console.log(`Ensuring collection exists: ${collectionName}`);
    
    const initDocRef = doc(db, collectionName, '_init');
    const initDoc = await getDoc(initDocRef);
    
    if (!initDoc.exists()) {
      console.log(`Creating _init document for collection: ${collectionName}`);
      
      await setDoc(initDocRef, {
        created: serverTimestamp(),
        purpose: 'Collection initialization document',
        collection: collectionName,
        version: '1.0.0'
      });
      
      console.log(`_init document created for collection: ${collectionName}`);
    } else {
      console.log(`Collection ${collectionName} already has _init document`);
    }
    
    return true;
  } catch (error) {
    console.error(`Failed to ensure collection exists: ${collectionName}`, error);
    
    // Check if it's a permission error
    if (error instanceof Error && error.message.includes('permission-denied')) {
      console.warn(`Permission denied for collection: ${collectionName}. This may be expected if security rules are restrictive.`);
    }
    
    // Don't throw - allow the app to continue
    return false;
  }
}

// Check if a collection is accessible (without creating documents)
export async function checkCollectionAccess(collectionName: string): Promise<boolean> {
  try {
    console.log(`Checking access to collection: ${collectionName}`);
    
    const initDocRef = doc(db, collectionName, '_init');
    await getDoc(initDocRef);
    
    console.log(`Collection ${collectionName} is accessible`);
    return true;
  } catch (error) {
    console.error(`Collection ${collectionName} is not accessible:`, error);
    return false;
  }
}

// Get collection status for all collections
export async function getCollectionStatus() {
  const status = {
    enhancedLoanApplications: false,
    users: false,
    borrowerProfiles: false
  };
  
  try {
    status.enhancedLoanApplications = await checkCollectionAccess(COLLECTIONS.ENHANCED_LOAN_APPLICATIONS);
    status.users = await checkCollectionAccess(COLLECTIONS.USERS);
    status.borrowerProfiles = await checkCollectionAccess(COLLECTIONS.BORROWER_PROFILES);
  } catch (error) {
    console.error('Error checking collection status:', error);
  }
  
  return status;
}

// Clean up initialization documents (for development/testing)
export async function cleanupInitDocuments() {
  console.log('Cleaning up initialization documents...');
  
  try {
    // Note: This would require delete permissions in Firestore rules
    // For now, we'll just log what would be cleaned up
    console.log('Would clean up _init documents from collections:', Object.values(COLLECTIONS));
    console.log('Note: Delete permissions required in Firestore rules for cleanup');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

// Export collection names for use in other parts of the app
export { COLLECTIONS };
