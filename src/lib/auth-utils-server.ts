/**
 * Server-side authentication utilities for API routes
 * This file contains Firebase Admin SDK imports and should only be used on the server
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin if not already initialized
let adminApp: any;
try {
  adminApp = getApps().length ? getApps()[0] : initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID || "lankford-lending",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
}

export interface AuthenticatedUser {
  uid: string;
  email: string;
  role: string;
  status: string;
}

export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    if (!token) {
      return NextResponse.json(
        { error: 'Missing authentication token' },
        { status: 401 }
      );
    }
    
    // Verify the token with Firebase Admin
    const decodedToken = await getAuth(adminApp).verifyIdToken(token);
    
    if (!decodedToken) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }
    
    return null; // No error, authentication successful
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}

export async function getAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    if (!token) {
      return null;
    }
    
    // Verify the token with Firebase Admin
    const decodedToken = await getAuth(adminApp).verifyIdToken(token);
    
    if (!decodedToken) {
      return null;
    }
    
    // Get user profile from Firestore
    const { adminDb } = await import('@/lib/firebase-admin');
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      return null;
    }
    
    const userData = userDoc.data();
    
    return {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      role: userData?.role || 'borrower',
      status: userData?.status || 'pending',
    };
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
}

export async function requireRole(request: NextRequest, allowedRoles: string[]): Promise<NextResponse | null> {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }
    
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    return null; // No error, role check passed
  } catch (error) {
    console.error('Role check error:', error);
    return NextResponse.json(
      { error: 'Role verification failed' },
      { status: 500 }
    );
  }
}
