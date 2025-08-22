
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import { CustomLoader } from './ui/custom-loader';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export function ProtectedRoute({ children, allowedRoles, redirectTo = '/auth/signin' }: ProtectedRouteProps) {
  const { user, loading, getRedirectPath, isLoggingOut } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // If logging out, don't do any redirects
    if (isLoggingOut) {
      return;
    }

    if (loading) {
      return; // Wait for the auth state to be determined
    }

    if (!user) {
      router.push(redirectTo);
      return;
    }

    const checkUserRole = async () => {
        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (allowedRoles.includes(userData.role)) {
                    setIsAuthorized(true);
                } else {
                    // Role not allowed, redirect to appropriate page based on user role
                    try {
                        const redirectPath = getRedirectPath();
                        router.push(redirectPath);
                    } catch (redirectError) {
                        console.error('Redirect failed, going to home:', redirectError);
                        router.push('/');
                    }
                }
            } else if (user.email === 'admin@lankfordcapital.com' && (allowedRoles.includes('workforce') || allowedRoles.includes('admin'))) {
                setIsAuthorized(true);
            }
            else {
                 console.warn(`No user document found for UID: ${user.uid}. Redirecting.`);
                 // Try to redirect to appropriate page, fallback to home if that fails
                 try {
                     const redirectPath = getRedirectPath();
                     router.push(redirectPath);
                 } catch (redirectError) {
                     console.error('Redirect failed, going to home:', redirectError);
                     router.push('/');
                 }
            }
        } catch (error) {
            console.error("Authorization check failed:", error);
            // If we can't check authorization due to permissions, try to redirect based on user info
            // Check if this is a known admin user
            const isAdminUser = user.uid === 'UCqwzQPlG4Xcb3BzcxGQ8JvjDba2' || 
                           user.uid === 'LQYGVdjvcAOB58nnK4lzP3sgW6B2' || 
                           user.uid === 'Wvzsq4sWJWf3NOjwMgMhqpw4O9b2';
            
            if (isAdminUser && (allowedRoles.includes('workforce') || allowedRoles.includes('admin'))) {
                // Known admin user, allow access
                setIsAuthorized(true);
            } else {
                try {
                    const redirectPath = getRedirectPath();
                    router.push(redirectPath);
                } catch (redirectError) {
                    console.error('Fallback redirect failed, going to home:', redirectError);
                    router.push('/');
                }
            }
        }
    };
    
    checkUserRole();

  }, [user, loading, router, allowedRoles, redirectTo, getRedirectPath, isLoggingOut]);

  if (loading || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <CustomLoader className="h-10 w-10" />
      </div>
    );
  }

  return <>{children}</>;
}
