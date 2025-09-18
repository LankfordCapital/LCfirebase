// Test script to check service account permissions locally
// Run with: node test-service-account-local.js

const { initializeApp, getApps } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const { credential } = require('firebase-admin');
const fs = require('fs');
const path = require('path');

async function testServiceAccountPermissions() {
  try {
    console.log('🔍 Testing Service Account Permissions...\n');

    // Initialize Firebase Admin
    let app;
    if (getApps().length === 0) {
      let credentialConfig;
      
      // Try to load service account from local file
      const serviceAccountPath = path.join(process.cwd(), 'service-account-key.json');
      
      if (fs.existsSync(serviceAccountPath)) {
        console.log('✅ Found local service account key file');
        const serviceAccountFile = fs.readFileSync(serviceAccountPath, 'utf8');
        const serviceAccount = JSON.parse(serviceAccountFile);
        credentialConfig = credential.cert(serviceAccount);
        console.log('📋 Service Account Email:', serviceAccount.client_email);
      } else {
        console.log('⚠️  No local service account key found, using application default credentials');
        credentialConfig = credential.applicationDefault();
      }

      app = initializeApp({
        projectId: 'lankford-lending',
        storageBucket: 'lankford-lending.firebasestorage.app',
        credential: credentialConfig
      });
    } else {
      app = getApps()[0];
    }

    const storage = getStorage(app);
    const bucket = storage.bucket('lankford-lending.firebasestorage.app');

    console.log('📦 Testing bucket access...');
    
    // Test 1: Bucket metadata
    try {
      const [metadata] = await bucket.getMetadata();
      console.log('✅ Bucket access successful');
      console.log('   - Bucket name:', metadata.name);
      console.log('   - Location:', metadata.location);
    } catch (error) {
      console.log('❌ Bucket access failed:', error.message);
      return;
    }

    // Test 2: File upload
    console.log('\n📤 Testing file upload...');
    const testFileName = `permission-test-${Date.now()}.txt`;
    const testFilePath = `test-permissions/${testFileName}`;
    const testFile = bucket.file(testFilePath);
    
    try {
      await testFile.save('This is a test file for permission checking', {
        metadata: {
          contentType: 'text/plain',
        },
      });
      console.log('✅ File upload successful');
    } catch (error) {
      console.log('❌ File upload failed:', error.message);
      return;
    }

    // Test 3: Signed URL generation
    console.log('\n🔗 Testing signed URL generation...');
    try {
      const [signedUrl] = await testFile.getSignedUrl({
        action: 'read',
        expires: Date.now() + 1000 * 60 * 5, // 5 minutes
      });
      console.log('✅ Signed URL generation successful');
      console.log('   - URL:', signedUrl.substring(0, 100) + '...');
    } catch (error) {
      console.log('❌ Signed URL generation failed:', error.message);
      console.log('   This is likely the issue you\'re experiencing in production');
      
      // Test fallback URL
      console.log('\n🔄 Testing fallback URL generation...');
      const fallbackUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(testFilePath)}?alt=media`;
      console.log('✅ Fallback URL generated:', fallbackUrl.substring(0, 100) + '...');
    }

    // Test 4: File deletion (cleanup)
    console.log('\n🗑️  Cleaning up test file...');
    try {
      await testFile.delete();
      console.log('✅ Test file deleted successfully');
    } catch (error) {
      console.log('⚠️  Could not delete test file:', error.message);
    }

    console.log('\n🎉 Service account permission test completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testServiceAccountPermissions();
