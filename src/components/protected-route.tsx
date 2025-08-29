
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
    // If authentication is finished and there's no user, redirect to the sign-in page.
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [loading, user, redirectTo, router]);

  // While auth state is loading, or if we have a user but are still fetching their profile,
  // show a full-screen loader. This is the key to preventing premature rendering.
  if (loading || !userProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <CustomLoader className="h-10 w-10" />
      </div>
    );
  }

  // Once the profile is loaded, check the role.
  if (allowedRoles.includes(userProfile.role)) {
    // If the role is allowed, render the children components (the correct page).
    return <>{children}</>;
  } else {
    // If the role is not allowed, redirect to the correct default page for their role.
    const path = getRedirectPath(userProfile);
    router.push(path);
    // Render a loader while the redirect happens.
    return (
        <div className="flex min-h-screen items-center justify-center">
            <CustomLoader className="h-10 w-10" />
        </div>
    );
  }
}
