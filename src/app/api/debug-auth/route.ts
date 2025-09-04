import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    // Get all users from Firebase Auth
    const listUsersResult = await adminAuth.listUsers();
    const authUsers = listUsersResult.users.map(user => ({
      uid: user.uid,
      email: user.email,
      disabled: user.disabled,
      emailVerified: user.emailVerified,
      customClaims: user.customClaims
    }));

    // Get all users from Firestore
    const usersSnapshot = await adminDb.collection('users').get();
    const firestoreUsers = usersSnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      success: true,
      authUsers,
      firestoreUsers,
      summary: {
        totalAuthUsers: authUsers.length,
        totalFirestoreUsers: firestoreUsers.length,
        pendingUsers: firestoreUsers.filter((u: any) => u.status === 'pending').length,
        approvedUsers: firestoreUsers.filter((u: any) => u.status === 'approved').length
      }
    });
  } catch (error) {
    console.error('Debug auth error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
