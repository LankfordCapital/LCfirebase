
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
    // If auth state is still loading, do nothing yet.
    if (loading) {
      return; 
    }

    // If there's no user, redirect to the sign-in page.
    if (!user) {
      router.push(redirectTo);
      return;
    }

    // If there is a user but their profile hasn't loaded yet, do nothing.
    // This prevents premature redirects.
    if (!userProfile) {
        return;
    }

    // If the user's role is not in the allowed list, redirect them to their default page.
    if (!allowedRoles.includes(userProfile.role)) {
        const defaultPath = getRedirectPath(userProfile);
        router.push(defaultPath);
    }

  }, [user, userProfile, loading, allowedRoles, redirectTo, router, getRedirectPath]);
  
  // While loading auth state or the user profile, show a loader.
  if (loading || !userProfile) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
        <CustomLoader className="h-10 w-10" />
      </div>
    );
  }
  
  // If the user's role is not allowed for this route, show a loader while redirecting.
  if (!allowedRoles.includes(userProfile.role)) {
       return (
          <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
            <CustomLoader className="h-10 w-10" />
          </div>
        );
  }

  // If everything is fine, render the protected content.
  return <>{children}</>;
}
