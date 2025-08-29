
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
    // If auth is not loading and there's no user, redirect.
    if (!loading && !user) {
      router.push(redirectTo);
    }
    
    // If auth is not loading and we have a user and profile, but the role is not allowed, redirect.
    if (!loading && user && userProfile && !allowedRoles.includes(userProfile.role)) {
       const path = getRedirectPath(userProfile);
       router.push(path);
    }
  }, [loading, user, userProfile, allowedRoles, redirectTo, router, getRedirectPath]);

  // While loading or if the user/profile is not yet available, show a loader.
  // This also covers the brief moment before the redirect effect runs.
  if (loading || !user || !userProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <CustomLoader className="h-10 w-10" />
      </div>
    );
  }

  // If the user's role is allowed, render the page content.
  if (allowedRoles.includes(userProfile.role)) {
    return <>{children}</>;
  }

  // Otherwise, render a loader while the redirect effect is triggered.
  return (
    <div className="flex min-h-screen items-center justify-center">
      <CustomLoader className="h-10 w-10" />
    </div>
  );
}
