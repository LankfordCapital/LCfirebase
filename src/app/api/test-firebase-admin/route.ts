import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
    try {
        console.log('Testing Firebase Admin connection...');
        
        // Test basic Firestore connection
        const testDoc = await adminDb.collection('_test').doc('connection-test').set({
            timestamp: new Date(),
            message: 'Firebase Admin connection test successful'
        });
        
        console.log('Firebase Admin test successful');
        
        return NextResponse.json({
            success: true,
            message: 'Firebase Admin connection successful',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Firebase Admin test failed:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            details: error
        }, { status: 500 });
    }
}
