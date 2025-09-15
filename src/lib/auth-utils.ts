import { NextRequest } from 'next/server';
import { adminAuth } from './firebase-admin';

export interface AuthResult {
  success: boolean;
  user?: any;
  error?: string;
}

/**
 * Verifies Firebase Auth token from request headers
 */
export async function verifyAuthToken(request: NextRequest): Promise<AuthResult> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { success: false, error: 'Missing or invalid authorization header' };
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return { success: true, user: decodedToken };
  } catch (error) {
    console.error('Token verification failed:', error);
    return { success: false, error: 'Invalid or expired token' };
  }
}

/**
 * Middleware helper for API routes that require authentication
 */
export function requireAuth(handler: (request: NextRequest, user: any) => Promise<Response>) {
  return async (request: NextRequest) => {
    const authResult = await verifyAuthToken(request);
    
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ error: authResult.error }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return handler(request, authResult.user);
  };
}

/**
 * Middleware helper for API routes that require admin access
 */
export function requireAdmin(handler: (request: NextRequest, user: any) => Promise<Response>) {
  return requireAuth(async (request: NextRequest, user: any) => {
    // Check if user has admin role in Firestore
    // This would require additional Firestore query in a real implementation
    // For now, we'll check if the user has admin claims
    if (!user.admin && !user.custom_claims?.admin) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return handler(request, user);
  });
}

/**
 * Helper to get user ID from Firebase token
 */
export function getUserIdFromToken(token: any): string {
  return token.uid;
}

/**
 * Helper to check if user has specific role
 */
export function hasRole(token: any, role: string): boolean {
  return token.custom_claims?.role === role || token.role === role;
}
