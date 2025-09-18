import { NextRequest, NextResponse } from 'next/server';
import { adminStorage } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const bucket = adminStorage.bucket('lankford-lending.firebasestorage.app');
    
    // Test 1: Basic bucket access
    let bucketAccessTest = 'Not attempted';
    let bucketAccessError = null;
    try {
      await bucket.getMetadata();
      bucketAccessTest = 'Success';
    } catch (error) {
      bucketAccessTest = 'Failed';
      bucketAccessError = error instanceof Error ? error.message : String(error);
    }

    // Test 2: File upload (small test file)
    let uploadTest = 'Not attempted';
    let uploadError = null;
    let testFilePath = null;
    try {
      const testFileName = `permission-test-${Date.now()}.txt`;
      const testFilePath = `test-permissions/${testFileName}`;
      const testFile = bucket.file(testFilePath);
      
      await testFile.save('This is a test file for permission checking', {
        metadata: {
          contentType: 'text/plain',
        },
      });
      
      uploadTest = 'Success';
      testFilePath = testFilePath;
    } catch (error) {
      uploadTest = 'Failed';
      uploadError = error instanceof Error ? error.message : String(error);
    }

    // Test 3: Signed URL generation
    let signedUrlTest = 'Not attempted';
    let signedUrlError = null;
    let signedUrl = null;
    try {
      if (testFilePath) {
        const testFile = bucket.file(testFilePath);
        const [url] = await testFile.getSignedUrl({
          action: 'read',
          expires: Date.now() + 1000 * 60 * 5, // 5 minutes
        });
        signedUrlTest = 'Success';
        signedUrl = url;
      } else {
        signedUrlTest = 'Skipped - no test file uploaded';
      }
    } catch (error) {
      signedUrlTest = 'Failed';
      signedUrlError = error instanceof Error ? error.message : String(error);
    }

    // Test 4: File deletion (cleanup)
    let deleteTest = 'Not attempted';
    let deleteError = null;
    try {
      if (testFilePath) {
        const testFile = bucket.file(testFilePath);
        await testFile.delete();
        deleteTest = 'Success';
      } else {
        deleteTest = 'Skipped - no test file to delete';
      }
    } catch (error) {
      deleteTest = 'Failed';
      deleteError = error instanceof Error ? error.message : String(error);
    }

    return NextResponse.json({
      success: true,
      tests: {
        bucketAccess: {
          result: bucketAccessTest,
          error: bucketAccessError,
        },
        fileUpload: {
          result: uploadTest,
          error: uploadError,
          testFilePath: testFilePath,
        },
        signedUrlGeneration: {
          result: signedUrlTest,
          error: signedUrlError,
          signedUrl: signedUrl,
        },
        fileDeletion: {
          result: deleteTest,
          error: deleteError,
        },
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasServiceAccountKey: !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
        hasGoogleCredentials: !!process.env.GOOGLE_APPLICATION_CREDENTIALS,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Service account permission test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasServiceAccountKey: !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
        hasGoogleCredentials: !!process.env.GOOGLE_APPLICATION_CREDENTIALS,
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
