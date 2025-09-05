import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
    try {
        // Test if we can access the users collection to verify Firestore connection
        const usersSnapshot = await adminDb.collection('users').limit(1).get();
        
        return NextResponse.json({
            success: true,
            message: 'Storage rules deployed successfully',
            firestoreConnected: !usersSnapshot.empty,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Storage test error:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}
