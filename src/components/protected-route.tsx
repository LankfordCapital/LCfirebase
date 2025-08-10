
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
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
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
                    // Role not allowed, redirect to a safe page (e.g., main dashboard or sign-in)
                     router.push('/dashboard'); 
                }
            } else if (user.email === 'admin@lankfordcapital.com' && (allowedRoles.includes('workforce') || allowedRoles.includes('admin'))) {
                setIsAuthorized(true);
            }
            else {
                 console.warn(`No user document found for UID: ${user.uid}. Redirecting.`);
                 router.push(redirectTo);
            }
        } catch (error) {
            console.error("Authorization check failed:", error);
            router.push(redirectTo);
        }
    };
    
    checkUserRole();

  }, [user, loading, router, allowedRoles, redirectTo]);

  if (loading || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <CustomLoader className="h-10 w-10" />
      </div>
    );
  }

  return <>{children}</>;
}
