import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  role?: string;
  status?: string;
  fullName?: string;
}

/**
 * Verifies Firebase Auth token from request headers and fetches user profile
 * @param request - NextRequest object
 * @returns AuthenticatedUser object or null if invalid
 */
export async function verifyAuthToken(request: NextRequest): Promise<AuthenticatedUser | null> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // Fetch user profile from Firestore for role and status
    try {
      const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        return {
          uid: decodedToken.uid,
          email: decodedToken.email,
          role: userData?.role,
          status: userData?.status,
          fullName: userData?.fullName
        };
      }
    } catch (firestoreError) {
      console.error('Error fetching user profile from Firestore:', firestoreError);
    }
    
    // Fallback to token data if Firestore fetch fails
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role,
      status: decodedToken.status
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Middleware function to require authentication for API routes
 * @param request - NextRequest object
 * @returns NextResponse with error if unauthorized, or null if authorized
 */
export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
  const user = await verifyAuthToken(request);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid or missing authentication token' },
      { status: 401 }
    );
  }
  
  return null; // User is authenticated
}

/**
 * Middleware function to require specific role for API routes
 * @param request - NextRequest object
 * @param allowedRoles - Array of allowed roles
 * @returns NextResponse with error if unauthorized, or null if authorized
 */
export async function requireRole(
  request: NextRequest, 
  allowedRoles: string[]
): Promise<NextResponse | null> {
  const user = await verifyAuthToken(request);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid or missing authentication token' },
      { status: 401 }
    );
  }
  
  // Admin can access any route
  if (user.role === 'admin') {
    return null;
  }
  
  if (!user.role || !allowedRoles.includes(user.role)) {
    return NextResponse.json(
      { error: 'Forbidden - Insufficient permissions' },
      { status: 403 }
    );
  }
  
  return null; // User has required role
}

/**
 * Middleware function to require admin role for API routes
 * @param request - NextRequest object
 * @returns NextResponse with error if unauthorized, or null if authorized
 */
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  return requireRole(request, ['admin']);
}

/**
 * Middleware function to require approved status for API routes
 * @param request - NextRequest object
 * @returns NextResponse with error if unauthorized, or null if authorized
 */
export async function requireApprovedStatus(request: NextRequest): Promise<NextResponse | null> {
  const user = await verifyAuthToken(request);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid or missing authentication token' },
      { status: 401 }
    );
  }
  
  if (user.status !== 'approved') {
    return NextResponse.json(
      { error: 'Forbidden - Account not approved' },
      { status: 403 }
    );
  }
  
  return null; // User is approved
}

/**
 * Get authenticated user from request (for use in route handlers)
 * @param request - NextRequest object
 * @returns AuthenticatedUser object or null if invalid
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  return verifyAuthToken(request);
}

/**
 * Middleware function to require specific user ownership
 * @param request - NextRequest object
 * @param targetUserId - The user ID that should own the resource
 * @returns NextResponse with error if unauthorized, or null if authorized
 */
export async function requireOwnership(request: NextRequest, targetUserId: string): Promise<NextResponse | null> {
  const user = await verifyAuthToken(request);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid or missing authentication token' },
      { status: 401 }
    );
  }
  
  // Admin can access any resource, users can only access their own
  if (user.role !== 'admin' && user.uid !== targetUserId) {
    return NextResponse.json(
      { error: 'Forbidden - Can only access your own resources' },
      { status: 403 }
    );
  }
  
  return null; // User has access
}