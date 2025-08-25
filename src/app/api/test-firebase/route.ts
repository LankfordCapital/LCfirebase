import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    // Test basic Firestore connection
    const testDoc = await adminDb.collection('test').doc('connection-test').get();
    
    return NextResponse.json({
      success: true,
      message: 'Firebase connection successful',
      testDocExists: testDoc.exists,
      projectId: adminDb.app.options.projectId
    });

  } catch (error) {
    console.error('Firebase connection test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Firebase connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
