import { NextRequest, NextResponse } from 'next/server';
import { adminStorage } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    // Get basic info about the service account being used
    const bucket = adminStorage.bucket('lankford-lending.firebasestorage.app');
    
    // Try to get bucket metadata to see what service account is being used
    const [metadata] = await bucket.getMetadata();
    
    // Try to test signed URL generation
    const testFile = bucket.file('test-permissions-check.txt');
    let signedUrlTest = 'Not attempted';
    let signedUrlError = null;
    
    try {
      const [signedUrl] = await testFile.getSignedUrl({
        action: 'read',
        expires: Date.now() + 1000 * 60 * 5, // 5 minutes
      });
      signedUrlTest = 'Success';
    } catch (error) {
      signedUrlTest = 'Failed';
      signedUrlError = error instanceof Error ? error.message : String(error);
    }

    return NextResponse.json({
      success: true,
      debug: {
        environment: process.env.NODE_ENV,
        hasServiceAccountKey: !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
        hasGoogleCredentials: !!process.env.GOOGLE_APPLICATION_CREDENTIALS,
        bucketName: bucket.name,
        bucketMetadata: {
          name: metadata.name,
          location: metadata.location,
          storageClass: metadata.storageClass,
        },
        signedUrlTest: {
          result: signedUrlTest,
          error: signedUrlError,
        },
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Debug service account error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      debug: {
        environment: process.env.NODE_ENV,
        hasServiceAccountKey: !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
        hasGoogleCredentials: !!process.env.GOOGLE_APPLICATION_CREDENTIALS,
        timestamp: new Date().toISOString(),
      }
    }, { status: 500 });
  }
}
