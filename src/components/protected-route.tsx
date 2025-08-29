
'use client';

import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { CustomLoader } from './ui/custom-loader';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export function ProtectedRoute({ children, allowedRoles, redirectTo = '/auth/signin' }: ProtectedRouteProps) {
  const { user, loading, userProfile, getRedirectPath } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // We should not do anything while the authentication state is loading.
    // The component will just render the loader.
    if (loading) {
      return; 
    }

    // If loading is finished and there's no user, redirect to the sign-in page.
    if (!user) {
      router.push(redirectTo);
      return;
    }

    // If we have a user but are waiting for their profile data from Firestore,
    // continue showing the loader. This prevents trying to check roles prematurely.
    if (!userProfile) {
        return;
    }

    // If the user's role is not in the list of allowed roles, redirect them.
    if (!allowedRoles.includes(userProfile.role)) {
        const defaultPathForRole = getRedirectPath(userProfile);
        router.push(defaultPathForRole);
    }

  }, [user, userProfile, loading, allowedRoles, redirectTo, router, getRedirectPath]);
  
  // Render a loader while auth state is being determined or profile is being fetched.
  if (loading || !user || !userProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <CustomLoader className="h-10 w-10" />
      </div>
    );
  }
  
  // If the user's role is not allowed, render a loader while redirecting.
  if (!allowedRoles.includes(userProfile.role)) {
       return (
          <div className="flex min-h-screen items-center justify-center">
            <CustomLoader className="h-10 w-10" />
          </div>
        );
  }

  // If all checks pass, render the protected content.
  return <>{children}</>;
}
