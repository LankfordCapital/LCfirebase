
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
    if (loading) {
      return; // Do nothing while auth state is loading
    }
    
    if (!user) {
      router.push(redirectTo);
      return;
    }
    
    if (userProfile && !allowedRoles.includes(userProfile.role)) {
       const path = getRedirectPath(userProfile);
       router.push(path);
    }
  }, [loading, user, userProfile, allowedRoles, redirectTo, router, getRedirectPath]);

  // While loading or if the user/profile is not yet available, show a loader.
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

  // Fallback loader while the redirect effect is being processed.
  return (
    <div className="flex min-h-screen items-center justify-center">
      <CustomLoader className="h-10 w-10" />
    </div>
  );
}
