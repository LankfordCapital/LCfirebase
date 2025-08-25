
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
      return; // Wait until the auth state is fully resolved
    }

    if (!user) {
      router.push(redirectTo); // Not logged in
      return;
    }

    if (userProfile) {
        if (!allowedRoles.includes(userProfile.role)) {
            // User role is not allowed for this route, redirect to their default dashboard
            const defaultPath = getRedirectPath();
            router.push(defaultPath);
        }
        // If role is allowed, the component will render children.
    }
    // If user exists but userProfile is null, it means we're in a brief state
    // before the profile is fetched. The loading screen will cover this.

  }, [user, userProfile, loading, allowedRoles, redirectTo, router, getRedirectPath]);

  // Show loader while auth state is resolving or if user is not authorized yet
  if (loading || !userProfile || !allowedRoles.includes(userProfile.role)) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
        <CustomLoader className="h-10 w-10" />
      </div>
    );
  }

  // User is authenticated and authorized, render the protected content
  return <>{children}</>;
}
